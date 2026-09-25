using System.Buffers.Binary;
using System.IO;
using System.IO.Pipes;
using System.Security.AccessControl;
using System.Security.Principal;

namespace Brana.WindowsApproval;

public interface IApprovalChannel { ApprovalState Send(ApprovalRequest request); }
public sealed class InMemoryApprovalChannel : IApprovalChannel
{
    private readonly Func<ApprovalRequest, ApprovalState> handler;
    public InMemoryApprovalChannel(Func<ApprovalRequest, ApprovalState> handler) => this.handler = handler;
    public ApprovalState Send(ApprovalRequest request) { request.Validate(); return handler(request); }
}

public static class NamedPipeApprovalServer
{
    public const int MaxFrameBytes = 16 * 1024;
    public static PipeSecurity CreateRestrictedSecurity()
    {
        var security = new PipeSecurity();
        var current = WindowsIdentity.GetCurrent().User ?? throw new InvalidOperationException("INTERACTIVE_USER_UNAVAILABLE");
        security.AddAccessRule(new PipeAccessRule(current, PipeAccessRights.ReadWrite, AccessControlType.Allow));
        security.AddAccessRule(new PipeAccessRule(new SecurityIdentifier(WellKnownSidType.LocalSystemSid, null), PipeAccessRights.FullControl, AccessControlType.Allow));
        security.SetAccessRuleProtection(true, false);
        return security;
    }
    public static async Task RunOnceAsync(string pipeName, Func<byte[], byte[]> handler, CancellationToken cancellationToken)
    {
        await using var server = NamedPipeServerStreamAcl.Create(pipeName, PipeDirection.InOut, 1, PipeTransmissionMode.Byte, PipeOptions.Asynchronous, 16 * 1024, 16 * 1024, CreateRestrictedSecurity(), HandleInheritability.None);
        await server.WaitForConnectionAsync(cancellationToken);
        var header = new byte[4];
        if (!await ReadExactAsync(server, header, cancellationToken)) return;
        var length = BinaryPrimitives.ReadUInt32BigEndian(header);
        if (length + 4 > MaxFrameBytes) { await WriteAsync(server, ErrorFrame("MESSAGE_TOO_LARGE"), cancellationToken); return; }
        var body = new byte[length];
        if (!await ReadExactAsync(server, body, cancellationToken)) { await WriteAsync(server, ErrorFrame("FRAME_TRUNCATED"), cancellationToken); return; }
        await WriteAsync(server, handler(header.Concat(body).ToArray()), cancellationToken);
    }
    public static async Task RunAsync(string pipeName, Func<byte[], byte[]> handler, CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            try { await RunOnceAsync(pipeName, handler, cancellationToken); }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested) { break; }
            catch (IOException) when (!cancellationToken.IsCancellationRequested) { await Task.Delay(50, cancellationToken); }
            catch (UnauthorizedAccessException) when (!cancellationToken.IsCancellationRequested) { await Task.Delay(50, cancellationToken); }
        }
    }
    private static async Task<bool> ReadExactAsync(Stream stream, byte[] buffer, CancellationToken token)
    {
        var offset = 0;
        while (offset < buffer.Length) { var n = await stream.ReadAsync(buffer.AsMemory(offset, buffer.Length - offset), token); if (n == 0) return false; offset += n; }
        return true;
    }
    private static Task WriteAsync(Stream stream, byte[] frame, CancellationToken token) => stream.WriteAsync(frame, token).AsTask();
    private static byte[] ErrorFrame(string code) => UiProtocolCodec.Encode(new UiProtocolMessage
    {
        Protocol = "brana-ui-v1",
        MessageType = "ERROR",
        ErrorCode = code,
        Origin = "https://localhost:5173",
        Nonce = "error",
        ExpiresAt = DateTimeOffset.UtcNow.AddSeconds(1).ToUnixTimeSeconds()
    });
}
