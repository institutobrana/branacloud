using System.Security.Cryptography;
using System.IO;
using System.Windows;

namespace Brana.NativePkcs12;

internal static class Program
{
    private const long MaxPfxBytes = 50L * 1024 * 1024;
    [STAThread]
    public static void Main(string[] args)
    {
        if (args.Contains("--self-test")) { SelfTest.Run(); return; }
        try
        {
            var request = Pkcs12Protocol.Parse(Pkcs12Protocol.ReadFrame(Console.OpenStandardInput()));
            var app = new Application();
            var dialog = new Pkcs12Dialog($"{request.CertificateDerSha256[..12]} / {request.OperationId[..Math.Min(8, request.OperationId.Length)]}");
            if (dialog.ShowDialog() != true || dialog.SelectedPath is null) throw new InvalidDataException("PKCS12_CANCELLED");
            // Password and path remain local to this process. No diagnostic contains either value.
            var pfx = new FileInfo(dialog.SelectedPath);
            if (pfx.Length <= 0 || pfx.Length > MaxPfxBytes) throw new InvalidDataException("PKCS12_FILE_TOO_LARGE");
            var pfxBytes = File.ReadAllBytes(dialog.SelectedPath);
            try
            {
                var signature = Pkcs12SignerCore.LoadAndSign(request, pfxBytes, dialog.Password);
                Pkcs12Protocol.WriteBinaryFrame(Console.OpenStandardOutput(), signature);
                CryptographicOperations.ZeroMemory(pfxBytes);
            }
            finally { CryptographicOperations.ZeroMemory(pfxBytes); }
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine("PKCS12_ERROR=" + Sanitize(ex));
            Console.Error.Flush();
            Environment.ExitCode = 1;
        }
    }

    private static string Sanitize(Exception ex) => ex is InvalidDataException ? ex.Message : ex is CryptographicException ? "PKCS12_OPERATION_FAILED" : "PKCS12_HELPER_FAILED";
}
