using System.Windows;
using System.IO;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Reflection;
using System.Security.Cryptography;

namespace Brana.WindowsApproval;

public partial class App : Application
{
    private CancellationTokenSource? cancellation;
    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);
        ReportAssemblyIdentity();
        ShutdownMode = ShutdownMode.OnExplicitShutdown;
        if (e.Args.Length != 1 || string.IsNullOrWhiteSpace(e.Args[0])) { Shutdown(2); return; }
        cancellation = new CancellationTokenSource(TimeSpan.FromMinutes(10));
        _ = NamedPipeApprovalServer.RunAsync(e.Args[0], HandleFrame, cancellation.Token)
            .ContinueWith(_ => Dispatcher.Invoke(Shutdown), TaskScheduler.Default);
    }

    private static void ReportAssemblyIdentity()
    {
        var location = Assembly.GetExecutingAssembly().Location;
        var hash = string.IsNullOrWhiteSpace(location) || !File.Exists(location)
            ? "LOCATION_UNAVAILABLE"
            : Convert.ToHexString(SHA256.HashData(File.ReadAllBytes(location)));
        Console.WriteLine($"BRANA_WPF_IDENTITY=pid:{Environment.ProcessId};assembly:{location};sha256:{hash}");
        Console.Out.Flush();
    }

    protected override void OnExit(ExitEventArgs e)
    {
        cancellation?.Cancel();
        base.OnExit(e);
    }

    private byte[] HandleFrame(byte[] frame)
    {
        try
        {
            var message = UiProtocolCodec.Decode(frame);
            var id = message.RequestId ?? message.OperationId;
            if (id is null) throw new InvalidDataException("IDENTIFIER_REQUIRED");
            new UiProtocolGuard().Accept(message, message.Origin!, id, message.MessageType == "SIGNATURE_REQUEST" ? message.PreparedPdfSha256 : null);
            var expires = DateTimeOffset.FromUnixTimeSeconds((long)(message.ExpiresAt ?? 0));
            var request = new ApprovalRequest(message.MessageType!, message.Origin!, message.MessageType == "PAIRING_REQUEST" ? "Pareamento" : "Assinatura", expires, message.Nonce!, message.FieldName ?? "BranaSignature_1", message.Profile ?? "pades-ad-rb-1.3", message.PolicyOid ?? "2.16.76.1.7.1.11.1.3", message.Page ?? 0, message.Rect ?? "", message.PreparedPdfSha256 ?? "", message.RequestId ?? "", message.OperationId ?? "", message.Nonce!);
            request.Validate();
            Console.WriteLine($"WPF_PIPE_FRAME_RECEIVED={message.MessageType}:{Short(message.RequestId ?? message.OperationId ?? "")}:{Short(message.Nonce ?? "")}");
            ApprovalWindow? window = null;
            bool? dialogResult = null;
            Dispatcher.Invoke(() => { window = new ApprovalWindow(request); Console.WriteLine($"WPF_WINDOW_CREATED={Short(message.RequestId ?? message.OperationId ?? "")}"); dialogResult = window.ShowDialog(); });
            if (window is null) throw new InvalidOperationException("UI_WINDOW_NOT_CREATED");
            var decision = dialogResult == true && window.ApprovedByButton && window.Result == ApprovalState.APPROVED ? ApprovalState.APPROVED : ApprovalState.DENIED;
            if (DateTimeOffset.UtcNow >= expires) decision = ApprovalState.EXPIRED;
            Console.WriteLine($"WPF_DECISION={Short(message.RequestId ?? message.OperationId ?? "")}:{Short(message.Nonce ?? "")}:dialog={dialogResult}:button={window.ApprovedByButton}:result={window.Result}:decision={decision}:source={(decision == ApprovalState.APPROVED ? "ApproveClick" : "none")}");
            if (decision == ApprovalState.APPROVED && string.IsNullOrWhiteSpace(message.RequestId) && string.IsNullOrWhiteSpace(message.OperationId)) decision = ApprovalState.DENIED;
            Console.WriteLine($"WPF_FRAME_SENT={Short(message.RequestId ?? message.OperationId ?? "")}:{Short(message.Nonce ?? "")}:decision={decision}:source={(decision == ApprovalState.APPROVED ? "ApproveClick" : "none")}");
            return UiProtocolCodec.Encode(new UiProtocolMessage { Protocol = "brana-ui-v1", MessageType = decision == ApprovalState.APPROVED ? "APPROVE" : decision == ApprovalState.DENIED ? "DENY" : "EXPIRED", RequestId = message.RequestId, OperationId = message.OperationId, Origin = message.Origin, Nonce = message.Nonce, Decision = decision.ToString(), ApprovalSource = decision == ApprovalState.APPROVED ? "ApproveClick" : null, ErrorCode = null, ExpiresAt = message.ExpiresAt });
        }
        catch (Exception ex)
        {
            return UiProtocolCodec.Encode(new UiProtocolMessage { Protocol = "brana-ui-v1", MessageType = "ERROR", Origin = "https://localhost:5173", Nonce = "error", ErrorCode = ex is InvalidDataException ? ex.Message : "UI_REQUEST_INVALID", ExpiresAt = DateTimeOffset.UtcNow.AddSeconds(1).ToUnixTimeSeconds() });
        }
    }

    private static string Short(string value) => value.Length <= 8 ? value : value[..8];
}
