using System.Windows;
using Brana.NativePkcs12;

namespace Brana.NativePkcs12DialogHarness;

internal sealed class SyntheticProvider : IPkcs12DialogProvider
{
    public IReadOnlyList<Pkcs12PresentationState> States { get; } = new Pkcs12PresentationState[]
    {
        new("PFX sem senha", "arquivo sintético (caminho oculto)", false, "PFX sintético sem senha. Nenhum código é exigido."),
        new("PFX protegido", "arquivo sintético (caminho oculto)", true, "PFX sintético protegido. Informe a senha do arquivo; os caracteres ficam ocultos."),
        new("Senha incorreta", "arquivo sintético (caminho oculto)", true, "A senha do arquivo está incorreta. Verifique e tente novamente."),
        new("DER divergente", "arquivo sintético (caminho oculto)", false, "O arquivo escolhido não corresponde ao certificado selecionado no Brana."),
        new("Cancelamento", "nenhum arquivo selecionado", false, "Cancelado. Nenhum material foi usado."),
    };

    public Pkcs12PresentationState? Select(Window owner) => States[0];
}

internal static class Program
{
    [STAThread]
    public static void Main()
    {
        var app = new Application();
        var dialog = new Pkcs12Dialog("SINTÉTICO • SHA-256 abreviado: A1B2C3D4E5F6", new SyntheticProvider());
        app.Run(dialog);
    }
}
