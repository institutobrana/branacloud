using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Text.Json;
using System.Buffers.Binary;

if (args.Length != 1 || (args[0] != "--self-test" && args[0] != "--ephemeral-test-only"))
    throw new InvalidOperationException("TEST_HOST_ONLY");
using var rsa = RSA.Create(2048);
var certRequest = new CertificateRequest(
    new X500DistinguishedName("CN=Brana ephemeral test only"), rsa,
    HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
using var cert = certRequest.CreateSelfSigned(DateTimeOffset.UtcNow.AddMinutes(-1), DateTimeOffset.UtcNow.AddMinutes(5));
var certDer = cert.Export(X509ContentType.Cert);
if (args[0] == "--ephemeral-test-only")
{
    var identity = Convert.ToHexString(SHA256.HashData(certDer));
    await WriteFrame(Console.OpenStandardOutput(), JsonSerializer.SerializeToUtf8Bytes(new { certificate_der_b64 = Convert.ToBase64String(certDer), identity }));
    var requestBytes = await ReadFrame(Console.OpenStandardInput());
    using var requestJson = JsonDocument.Parse(requestBytes);
    var requestIdentity = requestJson.RootElement.GetProperty("identity").GetString();
    if (!string.Equals(identity, requestIdentity, StringComparison.Ordinal)) throw new InvalidOperationException("TEST_IDENTITY_MISMATCH");
    var data = Convert.FromBase64String(requestJson.RootElement.GetProperty("data_b64").GetString() ?? "");
    var result = RsaSha256Signing.SignData(rsa, data);
    await WriteFrame(Console.OpenStandardOutput(), JsonSerializer.SerializeToUtf8Bytes(new { signature_b64 = Convert.ToBase64String(result), identity, input_length = data.Length }));
    return;
}
var request = Encoding.UTF8.GetBytes("BRANA-EPHEMERAL-SHA256-TEST");
var signature = RsaSha256Signing.SignData(rsa, request);
RsaSha256Signing.VerifyData(rsa, request, signature);
Console.WriteLine($"SELF_TEST_INPUT_LENGTH={request.Length}");
Console.WriteLine($"SELF_TEST_SIGNATURE_LENGTH={signature.Length}");
Console.WriteLine($"SELF_TEST_CERT_SHA256={Convert.ToHexString(SHA256.HashData(certDer))}");
Console.WriteLine("SELF_TEST_SIGNATURE_VALID=SIM");

static async Task<byte[]> ReadFrame(Stream stream)
{
    var header = new byte[4];
    if (await ReadExact(stream, header) != 4) throw new InvalidDataException("FRAME_HEADER");
    var length = BinaryPrimitives.ReadInt32LittleEndian(header);
    if (length <= 0 || length > 1_048_576) throw new InvalidDataException("FRAME_LENGTH");
    var data = new byte[length];
    if (await ReadExact(stream, data) != length) throw new InvalidDataException("FRAME_BODY");
    return data;
}

static async Task WriteFrame(Stream stream, byte[] data)
{
    var header = new byte[4];
    BinaryPrimitives.WriteInt32LittleEndian(header, data.Length);
    await stream.WriteAsync(header); await stream.WriteAsync(data); await stream.FlushAsync();
}

static async Task<int> ReadExact(Stream stream, byte[] buffer)
{
    var total = 0;
    while (total < buffer.Length)
    {
        var read = await stream.ReadAsync(buffer.AsMemory(total));
        if (read == 0) break;
        total += read;
    }
    return total;
}
