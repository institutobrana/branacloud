using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.IO;

namespace Brana.NativePkcs12;

internal static class SelfTest
{
    public static void Run()
    {
        ProtectedAndPlain();
        WrongAndInvalid();
        BindingAndKeyChecks();
        FrameChecks();
        Console.WriteLine("PKCS12_SELF_TEST=PASS");
    }

    private static (X509Certificate2 cert, RSA key, byte[] pfx, byte[] data, PublicSignRequest request) Fixture(bool encrypted)
    {
        using var key = RSA.Create(2048);
        var req = new CertificateRequest("CN=synthetic-pkcs12", key, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
        using var cert = req.CreateSelfSigned(DateTimeOffset.UtcNow.AddMinutes(-1), DateTimeOffset.UtcNow.AddDays(1));
        var data = Encoding.UTF8.GetBytes("synthetic-data-exactly-once");
        var der = cert.RawData;
        var pfx = cert.Export(X509ContentType.Pkcs12, encrypted ? "pass" : null);
        var request = new PublicSignRequest("op-test", "auth-test", "FILE_PKCS12", Hex(SHA256.HashData(der)), Convert.ToBase64String(der), "a".PadLeft(64, 'a'), Hex(SHA256.HashData(data)), Convert.ToBase64String(data));
        return (new X509Certificate2(cert.Export(X509ContentType.Cert)), key, pfx, data, request);
    }

    private static void ProtectedAndPlain()
    {
        foreach (var encrypted in new[] { true, false })
        {
            var f = Fixture(encrypted);
            try
            {
                var signature = Pkcs12SignerCore.LoadAndSign(f.request, f.pfx, encrypted ? "pass" : null);
                if (!f.cert.GetRSAPublicKey()!.VerifyData(f.data, signature, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1)) throw new Exception("SIGNATURE_VERIFY_FAILED");
            }
            finally { f.cert.Dispose(); f.key.Dispose(); CryptographicOperations.ZeroMemory(f.pfx); }
        }
    }

    private static void WrongAndInvalid()
    {
        var f = Fixture(true);
        try { Expect("PKCS12_PASSWORD_INVALID", () => Pkcs12SignerCore.LoadAndSign(f.request, f.pfx, "wrong")); }
        finally { f.cert.Dispose(); f.key.Dispose(); CryptographicOperations.ZeroMemory(f.pfx); }
        var invalid = Encoding.UTF8.GetBytes("invalid");
        Expect("PKCS12_PASSWORD_INVALID", () => Pkcs12SignerCore.LoadAndSign(f.request, invalid, "pass"));
        CryptographicOperations.ZeroMemory(invalid);
    }

    private static void BindingAndKeyChecks()
    {
        var f = Fixture(false);
        try
        {
            Expect("CERTIFICATE_SOURCE_INVALID", () => Pkcs12SignerCore.LoadAndSign(f.request with { CertificateSource = "WINDOWS_STORE" }, f.pfx, null));
            Expect("PUBLIC_DER_HASH_MISMATCH", () => Pkcs12SignerCore.LoadAndSign(f.request with { CertificateDerSha256 = new string('0', 64) }, f.pfx, null));
            var otherDer = RandomNumberGenerator.GetBytes(32);
            Expect("PKCS12_DER_MISMATCH", () => Pkcs12SignerCore.LoadAndSign(f.request with { ExpectedCertificateDerB64 = Convert.ToBase64String(otherDer), CertificateDerSha256 = Hex(SHA256.HashData(otherDer)) }, f.pfx, null));
        }
        finally { f.cert.Dispose(); f.key.Dispose(); CryptographicOperations.ZeroMemory(f.pfx); }
    }

    private static void FrameChecks()
    {
        Expect("FRAME_TRUNCATED", () => Pkcs12Protocol.ReadFrame(new MemoryStream(new byte[] { 1, 2 })));
        Expect("FRAME_LENGTH_INVALID", () => Pkcs12Protocol.ReadFrame(new MemoryStream(BitConverter.GetBytes(Pkcs12Protocol.MaxFrameBytes + 1))));
        Expect("CERTIFICATE_SOURCE_INVALID", () => Pkcs12Protocol.Parse(Encoding.UTF8.GetBytes("{}")));
    }

    private static void Expect(string code, Action action)
    {
        try { action(); throw new Exception("EXPECTED_" + code); }
        catch (InvalidDataException ex) when (ex.Message == code) { }
    }
    private static string Hex(byte[] value) => Convert.ToHexString(value).ToLowerInvariant();
}
