using System.Windows;
using System.Windows.Controls;
using Microsoft.Win32;

namespace Brana.NativePkcs12;

public sealed class Pkcs12Dialog : Window
{
    private readonly string _identity;
    private readonly TextBox _path = new();
    private readonly PasswordBox _password = new();
    private readonly TextBlock _passwordLabel = new();
    public string? SelectedPath { get; private set; }
    public string? Password { get; private set; }

    public Pkcs12Dialog(string identity, IPkcs12DialogProvider? provider = null)
    {
        _identity = identity;
        Title = "Identidade em arquivo"; Width = 520; MinWidth = 420; SizeToContent = SizeToContent.Height; WindowStartupLocation = WindowStartupLocation.CenterScreen;
        provider ??= new FilePkcs12DialogProvider();
        var status = new TextBlock { TextWrapping = TextWrapping.Wrap, Foreground = System.Windows.Media.Brushes.DarkSlateGray, Margin = new Thickness(0, 8, 0, 8) };
        var ok = new Button { Content = "Continuar", IsDefault = true, Margin = new Thickness(4), MinWidth = 92 };
        var browse = new Button { Content = "Selecionar PFX/P12", Margin = new Thickness(0, 8, 0, 8) };
        browse.Click += (_, _) =>
        {
            var selection = provider.Select(this);
            if (selection is null) { Apply(new("Cancelado", "nenhum arquivo selecionado", false, "Operação cancelada. Nenhum arquivo foi selecionado.")); return; }
            _path.Text = selection.DisplayPath;
            _passwordLabel.Visibility = selection.PasswordRequired ? Visibility.Visible : Visibility.Collapsed;
            _password.Visibility = selection.PasswordRequired ? Visibility.Visible : Visibility.Collapsed;
            SetStatus(selection.Message);
        };
        var cancel = new Button { Content = "Cancelar", IsCancel = true, Margin = new Thickness(4) };
        ok.Click += (_, _) => { if (string.IsNullOrWhiteSpace(_path.Text) || !ok.IsEnabled) return; SelectedPath = _path.Text; Password = _password.Password; DialogResult = true; };
        var panel = new StackPanel { Margin = new Thickness(16) };
        panel.Children.Add(new TextBlock { Text = $"Identidade pública selecionada: {_identity}", TextWrapping = TextWrapping.Wrap });
        if (provider.States.Count > 0)
        {
            var statePicker = new ComboBox { ItemsSource = provider.States, DisplayMemberPath = nameof(Pkcs12PresentationState.Label), Margin = new Thickness(0, 8, 0, 4) };
            statePicker.SelectedIndex = 0;
            statePicker.SelectionChanged += (_, _) => { if (statePicker.SelectedItem is Pkcs12PresentationState state) Apply(state); };
            panel.Children.Add(statePicker);
        }
        panel.Children.Add(browse); panel.Children.Add(_path);
        _passwordLabel.Text = "Senha do arquivo (se necessária; arquivo inválido também será rejeitado):"; _passwordLabel.Margin = new Thickness(0, 10, 0, 2); _passwordLabel.Visibility = Visibility.Collapsed; _password.Visibility = Visibility.Collapsed;
        panel.Children.Add(_passwordLabel); panel.Children.Add(_password);
        panel.Children.Add(status);
        void SetStatus(string text) => status.Text = text;
        void Apply(Pkcs12PresentationState state)
        {
            _path.Text = state.DisplayPath; _password.Clear();
            _passwordLabel.Visibility = state.PasswordRequired ? Visibility.Visible : Visibility.Collapsed;
            _password.Visibility = state.PasswordRequired ? Visibility.Visible : Visibility.Collapsed;
            ok.IsEnabled = !state.Label.Equals("Cancelamento", StringComparison.OrdinalIgnoreCase) && !string.IsNullOrWhiteSpace(state.DisplayPath) && !state.Message.StartsWith("Operação cancelada", StringComparison.OrdinalIgnoreCase);
            SetStatus(state.Message);
        }
        var actions = new StackPanel { Orientation = System.Windows.Controls.Orientation.Horizontal, HorizontalAlignment = HorizontalAlignment.Right }; actions.Children.Add(cancel); actions.Children.Add(ok); panel.Children.Add(actions); Content = panel;
        if (provider.States.Count > 0) Apply(provider.States[0]);
    }
}

public sealed record Pkcs12PresentationState(string Label, string DisplayPath, bool PasswordRequired, string Message);

public interface IPkcs12DialogProvider
{
    IReadOnlyList<Pkcs12PresentationState> States { get; }
    Pkcs12PresentationState? Select(Window owner);
}

internal sealed class FilePkcs12DialogProvider : IPkcs12DialogProvider
{
    public IReadOnlyList<Pkcs12PresentationState> States => Array.Empty<Pkcs12PresentationState>();
    public Pkcs12PresentationState? Select(Window owner)
    {
        var picker = new OpenFileDialog { Filter = "PKCS#12 (*.pfx;*.p12)|*.pfx;*.p12", CheckFileExists = true };
        if (picker.ShowDialog(owner) != true) return null;
        try { using var probe = new System.Security.Cryptography.X509Certificates.X509Certificate2(picker.FileName); return new("Selecionado", picker.FileName, false, "Arquivo sem senha detectada."); }
        catch (System.Security.Cryptography.CryptographicException) { return new("Selecionado", picker.FileName, true, "Este contêiner requer a senha do arquivo."); }
    }
}
