namespace Brana.WindowsApproval;

public enum ApprovalState { PENDING, APPROVED, DENIED, EXPIRED, UNAVAILABLE }

public sealed record ApprovalRequest(
    string State,
    string Origin,
    string TechnicalName,
    DateTimeOffset ExpiresAt,
    string ApprovalCode,
    string FieldName,
    string Profile,
    string PolicyOid,
    int Page,
    string Rect,
    string SyntheticPreview,
    string RequestId,
    string OperationId,
    string Nonce)
{
    private static readonly string[] Forbidden = ["pdf", "pfx", "pin", "password", "senha", "private", "hmac", "thumbprint", "key"];

    public ApprovalRequest Validate()
    {
        if (string.IsNullOrWhiteSpace(Origin) || !Origin.StartsWith("https://", StringComparison.OrdinalIgnoreCase)) throw new ArgumentException("ORIGIN_INVALID");
        if (string.IsNullOrWhiteSpace(TechnicalName) || TechnicalName.Length > 128) throw new ArgumentException("TECHNICAL_NAME_INVALID");
        if (!string.Equals(FieldName, "BranaSignature_1", StringComparison.Ordinal)) throw new ArgumentException("FIELD_NOT_ALLOWED");
        foreach (var value in new[] { TechnicalName, SyntheticPreview, ApprovalCode })
            if (Forbidden.Any(word => value.Contains(word, StringComparison.OrdinalIgnoreCase))) throw new ArgumentException("SENSITIVE_DATA_NOT_ALLOWED");
        return this;
    }
}
