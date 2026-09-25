using System.Buffers.Binary;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Brana.WindowsApproval;

public sealed record UiProtocolMessage
{
    [JsonPropertyName("protocol")] public string? Protocol { get; init; }
    [JsonPropertyName("message_type")] public string? MessageType { get; init; }
    [JsonPropertyName("request_id")] public string? RequestId { get; init; }
    [JsonPropertyName("operation_id")] public string? OperationId { get; init; }
    [JsonPropertyName("origin")] public string? Origin { get; init; }
    [JsonPropertyName("client_instance_id")] public string? ClientInstanceId { get; init; }
    [JsonPropertyName("document_name")] public string? DocumentName { get; init; }
    [JsonPropertyName("prepared_pdf_sha256")] public string? PreparedPdfSha256 { get; init; }
    [JsonPropertyName("field_name")] public string? FieldName { get; init; }
    [JsonPropertyName("page")] public int? Page { get; init; }
    [JsonPropertyName("rect")] public string? Rect { get; init; }
    [JsonPropertyName("profile")] public string? Profile { get; init; }
    [JsonPropertyName("policy_oid")] public string? PolicyOid { get; init; }
    [JsonPropertyName("nonce")] public string? Nonce { get; init; }
    [JsonPropertyName("expires_at")] public double? ExpiresAt { get; init; }
    [JsonPropertyName("decision")] public string? Decision { get; init; }
    [JsonPropertyName("approval_source")] public string? ApprovalSource { get; init; }
    [JsonPropertyName("error_code")] public string? ErrorCode { get; init; }
}

public static class UiProtocolCodec
{
    public const int MaxFrameBytes = 16 * 1024;
    private static readonly UTF8Encoding StrictUtf8 = new(false, true);
    private static readonly JsonSerializerOptions Options = new()
    {
        PropertyNamingPolicy = null,
        UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        WriteIndented = false,
        Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
    };

    public static byte[] Encode(UiProtocolMessage message)
    {
        Validate(message);
        var body = JsonSerializer.SerializeToUtf8Bytes(message, Options);
        if (body.Length + 4 > MaxFrameBytes) throw new InvalidDataException("MESSAGE_TOO_LARGE");
        var frame = new byte[body.Length + 4];
        BinaryPrimitives.WriteUInt32BigEndian(frame.AsSpan(0, 4), (uint)body.Length);
        body.CopyTo(frame, 4);
        return frame;
    }

    public static UiProtocolMessage Decode(ReadOnlySpan<byte> frame)
    {
        if (frame.Length < 4) throw new InvalidDataException("FRAME_TRUNCATED");
        var length = BinaryPrimitives.ReadUInt32BigEndian(frame[..4]);
        if (length + 4 > MaxFrameBytes || frame.Length != length + 4) throw new InvalidDataException("FRAME_TRUNCATED");
        string json;
        try { json = StrictUtf8.GetString(frame.Slice(4, checked((int)length))); }
        catch (DecoderFallbackException ex) { throw new InvalidDataException("UTF8_INVALID", ex); }
        UiProtocolMessage? message;
        try { message = JsonSerializer.Deserialize<UiProtocolMessage>(json, Options); }
        catch (JsonException ex) { throw new InvalidDataException("JSON_INVALID", ex); }
        if (message is null) throw new InvalidDataException("MESSAGE_INVALID");
        Validate(message);
        return message;
    }

    private static void Validate(UiProtocolMessage message)
    {
        if (message.Protocol != "brana-ui-v1") throw new InvalidDataException("PROTOCOL_INVALID");
        var allowed = new[] { "PAIRING_REQUEST", "SIGNATURE_REQUEST", "APPROVE", "DENY", "CANCEL", "EXPIRED", "ERROR" };
        if (message.MessageType is null || !allowed.Contains(message.MessageType, StringComparer.Ordinal)) throw new InvalidDataException("MESSAGE_TYPE_INVALID");
        if (string.IsNullOrWhiteSpace(message.Origin) || !message.Origin.StartsWith("https://", StringComparison.OrdinalIgnoreCase)) throw new InvalidDataException("ORIGIN_INVALID");
        if (string.IsNullOrWhiteSpace(message.Nonce)) throw new InvalidDataException("NONCE_INVALID");
        if (message.MessageType == "SIGNATURE_REQUEST")
        {
            if (string.IsNullOrWhiteSpace(message.OperationId) || string.IsNullOrWhiteSpace(message.PreparedPdfSha256) || message.FieldName != "BranaSignature_1" || message.Profile != "pades-ad-rb-1.3" || message.PolicyOid != "2.16.76.1.7.1.11.1.3") throw new InvalidDataException("SIGNATURE_BINDING_INVALID");
        }
        else if (message.MessageType is "PAIRING_REQUEST" or "APPROVE" or "DENY" or "CANCEL" or "EXPIRED")
        {
            if (string.IsNullOrWhiteSpace(message.RequestId) && string.IsNullOrWhiteSpace(message.OperationId)) throw new InvalidDataException("IDENTIFIER_REQUIRED");
        }
        foreach (var value in new[] { message.DocumentName, message.ErrorCode })
            if (value is not null && new[] { "pin", "password", "senha", "pfx", "private", "hmac", "key" }.Any(x => value.Contains(x, StringComparison.OrdinalIgnoreCase))) throw new InvalidDataException("SENSITIVE_DATA_NOT_ALLOWED");
    }

    public static void ValidateForGuard(UiProtocolMessage message) => Validate(message);
}
