using System.Security.Cryptography;

public static class RsaSha256Signing
{
    public static byte[] SignData(RSA rsa, ReadOnlySpan<byte> data)
    {
        if (data.Length == 0) throw new ArgumentException("SIGN_INPUT_INVALID");
        return rsa.SignData(data, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
    }

    public static void VerifyData(RSA rsa, ReadOnlySpan<byte> data, ReadOnlySpan<byte> signature)
    {
        if (!rsa.VerifyData(data, signature, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1))
            throw new CryptographicException("RSA_SIGNATURE_INVALID");
    }
}
