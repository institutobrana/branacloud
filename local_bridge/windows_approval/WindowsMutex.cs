using System.Threading;

namespace Brana.WindowsApproval;

public sealed class WindowsMutexGuard : IDisposable
{
    public const string Name = "Global\\BranaCloudeBridgeApproval";
    private readonly Mutex mutex;
    private bool owns;

    private WindowsMutexGuard(Mutex mutex) { this.mutex = mutex; owns = true; }

    public static WindowsMutexGuard Acquire()
    {
        var mutex = new Mutex(true, Name, out var created);
        if (!created) { mutex.Dispose(); throw new InvalidOperationException("INSTANCE_ALREADY_RUNNING"); }
        return new WindowsMutexGuard(mutex);
    }

    public void Dispose()
    {
        if (owns) { mutex.ReleaseMutex(); owns = false; }
        mutex.Dispose();
    }
}
