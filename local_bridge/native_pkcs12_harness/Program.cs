using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using Brana.NativePkcs12;

namespace Brana.NativePkcs12Harness;

internal static class Program
{
    public static void Main(string[] args)
    {
        if (args.Contains("--describe"))
        {
            var fixture = CreateFixture();
            try { Console.WriteLine(Convert.ToBase64String(fixture.certificate.RawData)); }
            finally { fixture.certificate.Dispose(); CryptographicOperations.ZeroMemory(fixture.pfx); }
            return;
        }
        if (!args.Contains("--serve")) { Console.Error.WriteLine("HARNESS_ERROR=MODE_REQUIRED"); Environment.ExitCode = 2; return; }
        try
        {
            var fixture = CreateFixture();
            try
            {
                Console.Error.WriteLine("HARNESS_PUBLIC_DER=" + Convert.ToBase64String(fixture.certificate.RawData)); Console.Error.Flush();
                var request = Pkcs12Protocol.Parse(Pkcs12Protocol.ReadFrame(Console.OpenStandardInput()));
                if (request.OperationId == "case-timeout") { Thread.Sleep(5000); return; }
                if (request.OperationId == "case-invalid-response") { Console.OpenStandardOutput().Write(new byte[] { 1, 2, 3 }); return; }
                var password = request.OperationId switch { "case-protected" => "test-pass", "case-wrong-password" => "wrong", "case-cancel" => null, _ => null };
                if (request.OperationId == "case-cancel") throw new InvalidDataException("PKCS12_CANCELLED");
                if (request.OperationId == "case-der-divergent") request = request with { ExpectedCertificateDerB64 = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32)), CertificateDerSha256 = Convert.ToHexString(RandomNumberGenerator.GetBytes(32)).ToLowerInvariant() };
                var signature = Pkcs12SignerCore.LoadAndSign(request, fixture.pfx, password);
                Pkcs12Protocol.WriteBinaryFrame(Console.OpenStandardOutput(), signature);
            }
            finally { fixture.certificate.Dispose(); CryptographicOperations.ZeroMemory(fixture.pfx); }
        }
        catch (Exception ex) { Console.Error.WriteLine("HARNESS_ERROR=" + Sanitize(ex)); Environment.ExitCode = 1; }
    }

    private static (X509Certificate2 certificate, byte[] pfx) CreateFixture()
    {
        using var key = RSA.Create();
        key.ImportPkcs8PrivateKey(Convert.FromBase64String("MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCsCgGxvDnbas/nKb0bGxl0pXgvzbgY1d7PuOPZVvLsQNdJBFBVTK9r/1PrIuPpEpOevfd/E4CbP8GBkwWhdGzQ9zskV/NZTeWlKw6nvy7P04HPbb25zp7QievOSRjB3otEHQVdaYzzN8RgvP2sJMjHzSHEjAv7/A7JxvY+kk+k3TxSbbGIXZCVJ1Bh39MD2ESbtIvKMOE/awvZNnE4GqePxK3ZLxPAq+D2nfqJ9TKsGz2xeQz70JitqHswK4JfKQs51dIPG1U6wxnJvm51TmWhl/yXi1LnIPSowax4ihPxyRRIQFndPfMMKmWyfr9bpRbwEhKf6aeRt8Z58mjJRiO1AgMBAAECggEAAx2vSCvTlHDL0TEFVs9X17ADjEIamoCNJ4/+uHoFrlfCTnVAizr3Vmpqd7DLFfabK93e9LNCug0ekR07leAI9IP100OwiaaKiUJNYqZoz6TSDhK7w/jFEZvd5H+YbjJ8rUAlT7rQrbsN2H6zzYFhDZVejjPHJ8o57lenMBzwSlkb1A95pM6i+AXPb1pyFrs5StA0ALpvW4ZpdCXNb3RY6vpI2Ge1b0TiM2C66dm140zhNsK/HBnLEA7Hcob3PXmcuEhksYQkGRpbkg1h6s+Kjj2b4WG5zl8yExFjLqXLkyPAA3uAiAPxXH/ZQRYqjkyZ3JfUNBdnwSm0k5X6RHqoBQKBgQDk9Zry4iWaCQoYplof8YQmwXjHHsVpN0dcbU/49H5OgfTSEq4AkynNXIKJT5kTMfbxv300w7+OPwh32AvUzMb45Uf0NWtNIOXNMqpmicMMnO9/v3ZHx9YsTl/6fpSDU0xV5CS2O7Vl0bi7+6Q39WC9dLqN/hVjUMhwkhlsdskVrwKBgQDAW3a3r9z/rc5mSCopATknHkc9BzNgURXjD8EIfeNwRrSBsT/C9BJCIVjYaJgitbd8+tWy8OqdxEex+H4xCQiG0Io0kbCL0pha85xXPrGoboQ6oq5YGGPrc0y4p5QIwt2L38qLXUeNx6mTFTnumttIniGk//IP8GQRsPKulSWZ2wKBgQDXLyXTxEuGu5wrkpz9jKWhLxBuRDNRMcz1xx70YgUbj/QiQ8AZdjZBdgKRPqglbD4k8s2f+6Fa9U7mI7zq4RLX9dVsZZBVSufvtQCFolAY2J4XOEDYMa7OsVJvQOwfiPgjeWovg2p3KWYv9s9ecFXdeYmjzfsX/mKDuiv+zp0qrQKBgBmpWgohTQNTBZEBmZZE0oIUeP58Qm9cAeZ7yI3AdaIZ3KTcp5vzgagO2NJuCbW/tk3XDMFFgJcxgzsL4pHaGagalAV1Vi8hFjA0Baxh8cN9kuhboZShFFtp01djC82raXDqlxPGivAwLcAweb0KLazfY6+mcX2M3Vy61XVS8mQ3AoGAe7lM7gAN6bWIF3hAoprBNY9ZNWA3zWEtK0NF7mCPp9VT6UkD76kjbqfZsbHqFnZx0wz++P148VR1JAtwuuJqVUYJz8hp9Mu000Jg597NDzXqbmEMzoU7eHJpWPwvAJW0r4B7S87zuVGEzrBjtSuyoswpv+0jJXwwCVTP6yUDAbE="), out _);
        var request = new CertificateRequest("CN=synthetic-harness", key, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
        using var certificate = request.Create(request.SubjectName, X509SignatureGenerator.CreateForRSA(key, RSASignaturePadding.Pkcs1), new DateTimeOffset(2026, 1, 1, 0, 0, 0, TimeSpan.Zero), new DateTimeOffset(2036, 1, 1, 0, 0, 0, TimeSpan.Zero), new byte[] { 1, 0x23, 0x45, 0x67 });
        using var certificateWithKey = certificate.CopyWithPrivateKey(key);
        var pfx = certificateWithKey.Export(X509ContentType.Pkcs12, "test-pass");
        return (new X509Certificate2(certificate.Export(X509ContentType.Cert)), pfx);
    }

    private static string Sanitize(Exception ex) => ex is InvalidDataException ? ex.Message : ex is CryptographicException ? "PKCS12_OPERATION_FAILED" : "HARNESS_OPERATION_FAILED";
}
