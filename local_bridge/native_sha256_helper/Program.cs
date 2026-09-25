using System.Buffers.Binary;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Runtime.InteropServices;
using System.Text.Json;

static class Program
{
record ProviderInfo(string ProviderName, uint ProviderType);

[StructLayout(LayoutKind.Sequential)]
struct CryptKeyProvInfo
{
    public IntPtr ContainerName;
    public IntPtr ProviderName;
    public uint ProviderType;
    public uint Flags;
    public uint KeySpec;
    public uint ProvParamCount;
    public IntPtr ProvParams;
}

[DllImport("crypt32.dll", SetLastError = true)]
static extern bool CertGetCertificateContextProperty(IntPtr certContext, uint propertyId,
    IntPtr data, ref uint dataSize);

public static async Task Main(string[] args)
{
// Deliberately standalone: it is not referenced by the bridge or HTTP runtime.
// Production selection remains disabled until an explicit future authorization.
const int MaxFrame = 1_048_576;
if (args.Contains("--help"))
{
    Console.WriteLine("Framed stdin/stdout RSA-SHA256 helper; no command-line key or PDF data.");
    Console.WriteLine("Default mode is disabled; integration requires an explicit future gate.");
    return;
}
if (!args.Contains("--explicit-authorized-run"))
    throw new InvalidOperationException("REAL_HELPER_EXPLICIT_GATE_REQUIRED");

var input = Console.OpenStandardInput();
var output = Console.OpenStandardOutput();
var header = new byte[4];
if (await ReadExact(input, header) != 4)
    throw new InvalidDataException("FRAME_HEADER_UNAVAILABLE");
var length = BinaryPrimitives.ReadInt32LittleEndian(header);
if (length <= 0 || length > MaxFrame)
    throw new InvalidDataException("FRAME_LENGTH_INVALID");
var frame = new byte[length];
if (await ReadExact(input, frame) != length)
    throw new InvalidDataException("FRAME_TRUNCATED");

using var request = JsonDocument.Parse(frame);
var root = request.RootElement;
var expectedDer = root.GetProperty("certificate_der_sha256").GetString() ?? "";
var data = Convert.FromBase64String(root.GetProperty("data_b64").GetString() ?? "");
if (data.Length == 0 || data.Length > MaxFrame)
    throw new InvalidDataException("SIGN_INPUT_INVALID");
if (expectedDer.Length != 64 || expectedDer.Any(c => !Uri.IsHexDigit(c)))
    throw new InvalidDataException("CERTIFICATE_ID_INVALID");

using var store = new X509Store(StoreName.My, StoreLocation.CurrentUser);
store.Open(OpenFlags.ReadOnly | OpenFlags.OpenExistingOnly);
var matches = store.Certificates.Cast<X509Certificate2>()
    .Where(c => SHA256.HashData(c.RawData).AsSpan().SequenceEqual(Convert.FromHexString(expectedDer)))
    .ToArray();
if (matches.Length != 1)
    throw new InvalidOperationException(matches.Length == 0 ? "CERTIFICATE_NOT_FOUND" : "CERTIFICATE_AMBIGUOUS");
using var cert = matches[0];
if (DateTime.UtcNow < cert.NotBefore.ToUniversalTime() || DateTime.UtcNow > cert.NotAfter.ToUniversalTime())
    throw new InvalidOperationException("CERTIFICATE_EXPIRED_OR_NOT_YET_VALID");
var providerInfo = ReadProviderInfo(cert);
if (!string.Equals(providerInfo.ProviderName, "Microsoft Enhanced Cryptographic Provider v1.0", StringComparison.Ordinal)
    || providerInfo.ProviderType != 1)
    throw new InvalidOperationException("CERTIFICATE_PROVIDER_INCOMPATIBLE");
using var rsa = cert.GetRSAPrivateKey() ?? throw new InvalidOperationException("RSA_PRIVATE_KEY_UNAVAILABLE");
if (rsa.KeySize != 2048)
    throw new InvalidOperationException("RSA_KEY_SIZE_INVALID");
var signature = RsaSha256Signing.SignData(rsa, data);
if (signature.Length != rsa.KeySize / 8)
    throw new InvalidOperationException("RSA_SIGNATURE_LENGTH_INVALID");
BinaryPrimitives.WriteInt32LittleEndian(header, signature.Length);
await output.WriteAsync(header);
await output.WriteAsync(signature);
await output.FlushAsync();

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

static ProviderInfo ReadProviderInfo(X509Certificate2 cert)
{
    uint size = 0;
    if (!CertGetCertificateContextProperty(cert.Handle, 2, IntPtr.Zero, ref size))
        throw new InvalidOperationException("CERTIFICATE_PROVIDER_METADATA_UNAVAILABLE");
    var buffer = Marshal.AllocHGlobal((int)size);
    try
    {
        if (!CertGetCertificateContextProperty(cert.Handle, 2, buffer, ref size))
            throw new InvalidOperationException("CERTIFICATE_PROVIDER_METADATA_UNAVAILABLE");
        var info = Marshal.PtrToStructure<CryptKeyProvInfo>(buffer);
        return new ProviderInfo(Marshal.PtrToStringUni(info.ProviderName) ?? "", info.ProviderType);
    }
    finally { Marshal.FreeHGlobal(buffer); }
}
}
}
