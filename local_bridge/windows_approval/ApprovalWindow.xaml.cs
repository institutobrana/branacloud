using System.Windows;
using System.Windows.Threading;

namespace Brana.WindowsApproval;

public partial class ApprovalWindow : Window
{
    private readonly string requestId;
    private readonly string operationId;
    private readonly string nonce;
    private readonly DispatcherTimer expiryTimer;
    public ApprovalState Result { get; private set; } = ApprovalState.DENIED;
    public bool ApprovedByButton { get; private set; }

    public ApprovalWindow(ApprovalRequest request)
    {
        request.Validate();
        requestId = request.RequestId;
        operationId = request.OperationId;
        nonce = request.Nonce;
        InitializeComponent();
        OriginText.Text = request.Origin;
        NameText.Text = request.TechnicalName;
        CodeText.Text = request.ApprovalCode;
        PolicyText.Text = $"{request.Profile} / {request.PolicyOid}";
        FieldText.Text = $"{request.FieldName} — página {request.Page}, {request.Rect}";
        ExpiryText.Text = $"Expira em {request.ExpiresAt.LocalDateTime:g}";
        Loaded += (_, _) => Console.WriteLine($"WPF_WINDOW_SHOWN=pid:{Environment.ProcessId};id:{Short(requestId, operationId)};nonce:{Short(nonce)}");
        Activated += (_, _) => Console.WriteLine($"WPF_WINDOW_ACTIVATED=pid:{Environment.ProcessId};id:{Short(requestId, operationId)};nonce:{Short(nonce)}");
        expiryTimer = new DispatcherTimer { Interval = TimeSpan.FromMilliseconds(250) };
        expiryTimer.Tick += (_, _) => { if (DateTimeOffset.UtcNow < request.ExpiresAt) return; expiryTimer.Stop(); Console.WriteLine($"WPF_WINDOW_EXPIRED=pid:{Environment.ProcessId};id:{Short(requestId, operationId)};nonce:{Short(nonce)}"); Result = ApprovalState.EXPIRED; DialogResult = false; Close(); };
        Closed += (_, _) => expiryTimer.Stop();
        expiryTimer.Start();
    }

    private void ApproveClick(object sender, RoutedEventArgs e) { Console.WriteLine($"WPF_APPROVE_HANDLER_ENTERED=pid:{Environment.ProcessId};id:{Short(requestId, operationId)};nonce:{Short(nonce)};event=Click"); ApprovedByButton = true; Result = ApprovalState.APPROVED; DialogResult = true; Close(); }
    private void DenyClick(object sender, RoutedEventArgs e) { Result = ApprovalState.DENIED; DialogResult = false; Close(); }

    private static string Short(string requestId, string operationId) => Short(string.IsNullOrWhiteSpace(requestId) ? operationId : requestId);
    private static string Short(string value) => value.Length <= 8 ? value : value[..8];
}
