using System.Buffers.Binary;
using System.IO;
using System.Security.Cryptography;
using System.Text.Json;

namespace Brana.NativePkcs12;

public sealed record PublicSignRequest(
    string OperationId,
    string AuthorizationId,
    string CertificateSource,
    string CertificateDerSha256,
    string ExpectedCertificateDerB64,
    string PreparedPdfSha256,
    string DataSha256,
    string DataB64);

public static class Pkcs12Protocol
{
    public const int MaxFrameBytes = 1_048_576;

    public static byte[] ReadFrame(Stream input)
    {
        var header = new byte[4];
        ReadExact(input, header);
        var length = BinaryPrimitives.ReadInt32LittleEndian(header);
        if (length <= 0 || length > MaxFrameBytes) throw new InvalidDataException("FRAME_LENGTH_INVALID");
        var body = new byte[length];
        ReadExact(input, body);
        return body;
    }

    public static void WriteFrame(Stream output, object value)
    {
        var body = JsonSerializer.SerializeToUtf8Bytes(value);
        if (body.Length > MaxFrameBytes) throw new InvalidDataException("FRAME_TOO_LARGE");
        Span<byte> header = stackalloc byte[4];
        BinaryPrimitives.WriteInt32LittleEndian(header, body.Length);
        output.Write(header); output.Write(body); output.Flush();
    }

    public static void WriteBinaryFrame(Stream output, ReadOnlySpan<byte> signature)
    {
        if (signature.Length == 0 || signature.Length > MaxFrameBytes) throw new InvalidDataException("SIGNATURE_FRAME_INVALID");
        Span<byte> header = stackalloc byte[4];
        BinaryPrimitives.WriteInt32LittleEndian(header, signature.Length);
        output.Write(header); output.Write(signature); output.Flush();
    }

    public static PublicSignRequest Parse(ReadOnlySpan<byte> body)
    {
        JsonDocument json;
        try { json = JsonDocument.Parse(body.ToArray()); }
        catch (JsonException) { throw new InvalidDataException("FRAME_JSON_INVALID"); }
        using (json)
        {
        var root = json.RootElement;
        var request = new PublicSignRequest(
            Get(root, "operation_id"), Get(root, "authorization_id"), Get(root, "certificate_source"),
            Get(root, "certificate_der_sha256"), Get(root, "expected_certificate_der_b64"),
            Get(root, "prepared_pdf_sha256"), Get(root, "data_sha256"), Get(root, "data_b64"));
        if (request.CertificateSource != "FILE_PKCS12") throw new InvalidDataException("CERTIFICATE_SOURCE_INVALID");
        if (string.IsNullOrWhiteSpace(request.OperationId) || string.IsNullOrWhiteSpace(request.AuthorizationId)) throw new InvalidDataException("IDENTIFIER_REQUIRED");
        if (!IsSha256(request.CertificateDerSha256) || !IsSha256(request.PreparedPdfSha256) || !IsSha256(request.DataSha256)) throw new InvalidDataException("HASH_INVALID");
        return request;
        }
    }

    private static string Get(JsonElement root, string name) => root.TryGetProperty(name, out var value) && value.ValueKind == JsonValueKind.String ? value.GetString() ?? "" : "";
    private static bool IsSha256(string value) => value.Length == 64 && value.All(Uri.IsHexDigit);
    private static void ReadExact(Stream input, byte[] buffer)
    {
        var offset = 0;
        while (offset < buffer.Length) { var count = input.Read(buffer, offset, buffer.Length - offset); if (count == 0) throw new InvalidDataException("FRAME_TRUNCATED"); offset += count; }
    }
}
