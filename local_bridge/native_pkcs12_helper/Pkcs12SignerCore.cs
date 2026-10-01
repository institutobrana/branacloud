using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.IO;

namespace Brana.NativePkcs12;

public static class Pkcs12SignerCore
{
    public static byte[] LoadAndSign(PublicSignRequest request, ReadOnlyMemory<byte> pfxBytes, string? password)
    {
        if (request.CertificateSource != "FILE_PKCS12") throw new InvalidDataException("CERTIFICATE_SOURCE_INVALID");
        byte[] expectedDer;
        byte[] data;
        try { expectedDer = Convert.FromBase64String(request.ExpectedCertificateDerB64); data = Convert.FromBase64String(request.DataB64); }
        catch (FormatException) { throw new InvalidDataException("PUBLIC_INPUT_INVALID"); }
        if (!CryptographicOperations.FixedTimeEquals(SHA256.HashData(expectedDer), Convert.FromHexString(request.CertificateDerSha256))) throw new InvalidDataException("PUBLIC_DER_HASH_MISMATCH");
        if (!CryptographicOperations.FixedTimeEquals(SHA256.HashData(data), Convert.FromHexString(request.DataSha256))) throw new InvalidDataException("DATA_HASH_MISMATCH");
        X509Certificate2? certificate = null;
        try
        {
            certificate = string.IsNullOrEmpty(password)
                ? new X509Certificate2(pfxBytes.ToArray(), (string?)null, X509KeyStorageFlags.EphemeralKeySet | X509KeyStorageFlags.Exportable)
                : new X509Certificate2(pfxBytes.ToArray(), password, X509KeyStorageFlags.EphemeralKeySet | X509KeyStorageFlags.Exportable);
        }
        catch (CryptographicException) when (string.IsNullOrEmpty(password)) { throw new InvalidDataException("PKCS12_PASSWORD_REQUIRED"); }
        catch (CryptographicException) { throw new InvalidDataException("PKCS12_PASSWORD_INVALID"); }
        using (certificate)
        {
            var der = certificate.RawData;
            if (!der.AsSpan().SequenceEqual(expectedDer) || !SHA256.HashData(der).AsSpan().SequenceEqual(Convert.FromHexString(request.CertificateDerSha256))) throw new InvalidDataException("PKCS12_DER_MISMATCH");
            using var rsa = certificate.GetRSAPrivateKey() ?? throw new InvalidDataException("RSA_PRIVATE_KEY_UNAVAILABLE");
            return rsa.SignData(data, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
        }
    }
}
