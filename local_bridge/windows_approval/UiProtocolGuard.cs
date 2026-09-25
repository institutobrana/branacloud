using System.Security.Cryptography;
using System.IO;

namespace Brana.WindowsApproval;

public sealed class UiProtocolGuard
{
    private readonly Func<double> clock;
    private readonly HashSet<string> nonces = new(StringComparer.Ordinal);
    private readonly HashSet<string> completed = new(StringComparer.Ordinal);
    public UiProtocolGuard(Func<double>? clock = null) => this.clock = clock ?? (() => DateTimeOffset.UtcNow.ToUnixTimeSeconds());

    public UiProtocolMessage Accept(UiProtocolMessage message, string expectedOrigin, string expectedId, string? expectedHash = null)
    {
        UiProtocolCodec.ValidateForGuard(message);
        var id = message.RequestId ?? message.OperationId;
        if (!StringComparer.Ordinal.Equals(id, expectedId)) throw new InvalidDataException("IDENTIFIER_MISMATCH");
        if (!StringComparer.Ordinal.Equals(message.Origin, expectedOrigin)) throw new InvalidDataException("ORIGIN_MISMATCH");
        if (message.ExpiresAt is null || message.ExpiresAt <= clock()) throw new InvalidDataException("MESSAGE_EXPIRED");
        if (expectedHash is not null && !CryptographicOperations.FixedTimeEquals(System.Text.Encoding.ASCII.GetBytes(expectedHash), System.Text.Encoding.ASCII.GetBytes(message.PreparedPdfSha256 ?? ""))) throw new InvalidDataException("HASH_MISMATCH");
        if (!nonces.Add(message.Nonce!)) throw new InvalidDataException("NONCE_REPLAY");
        if (message.MessageType is "APPROVE" or "DENY" or "CANCEL" or "EXPIRED")
        {
            if (!completed.Add(expectedId)) throw new InvalidDataException("DECISION_DUPLICATE");
        }
        return message;
    }
}
