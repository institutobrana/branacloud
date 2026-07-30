Set-StrictMode -Version Latest

$script:BranaGitAllowlist = [ordered]@{
    'rev-parse --is-inside-work-tree' = @('rev-parse','--is-inside-work-tree')
    'rev-parse --show-toplevel' = @('rev-parse','--show-toplevel')
    'rev-parse HEAD' = @('rev-parse','HEAD')
    'rev-parse --short HEAD' = @('rev-parse','--short','HEAD')
    'rev-parse --abbrev-ref HEAD' = @('rev-parse','--abbrev-ref','HEAD')
    'remote -v' = @('remote','-v')
    'status --porcelain=v1 --branch' = @('status','--porcelain=v1','--branch')
}

function Test-BranaGitAvailable {
    [CmdletBinding()]
    param()

    $git = Get-Command git.exe -ErrorAction SilentlyContinue
    return [bool]$git
}

function Initialize-BranaGitProcessHelper {
    if ([type]::GetType('Brana.Release.Git.ProcessHelper, Brana.Release.Git', $false) -ne $null) {
        return
    }

    $source = @'
using System;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;

namespace Brana.Release.Git {
    public sealed class ProcessResult {
        public int ExitCode { get; set; }
        public string StandardOutput { get; set; }
        public string StandardError { get; set; }
        public bool TimedOut { get; set; }
        public long DurationMs { get; set; }
        public int ProcessId { get; set; }
        public bool KillAttempted { get; set; }
        public bool KillConfirmed { get; set; }
    }

    public static class ProcessHelper {
        public static ProcessResult Run(string fileName, string workingDirectory, string[] arguments, int timeoutMs) {
            var result = new ProcessResult();
            var sw = Stopwatch.StartNew();
            Process process = null;
            Task<string> stdoutTask = null;
            Task<string> stderrTask = null;
            try {
                var psi = new ProcessStartInfo();
                psi.FileName = fileName;
                psi.WorkingDirectory = workingDirectory;
                psi.UseShellExecute = false;
                psi.RedirectStandardOutput = true;
                psi.RedirectStandardError = true;
                psi.CreateNoWindow = true;
                psi.Arguments = BuildArguments(arguments);
                psi.EnvironmentVariables["GIT_TERMINAL_PROMPT"] = "0";
                psi.EnvironmentVariables["GIT_PAGER"] = "cat";
                psi.EnvironmentVariables["PAGER"] = "cat";
                psi.EnvironmentVariables["GCM_INTERACTIVE"] = "Never";
                psi.EnvironmentVariables["LC_ALL"] = "C";
                psi.EnvironmentVariables["LANG"] = "C";

                process = new Process();
                process.StartInfo = psi;
                process.Start();
                result.ProcessId = process.Id;

                stdoutTask = process.StandardOutput.ReadToEndAsync();
                stderrTask = process.StandardError.ReadToEndAsync();

                if (!process.WaitForExit(timeoutMs)) {
                    result.TimedOut = true;
                    result.KillAttempted = true;
                    try {
                        process.Kill();
                    } catch {
                    }
                    try {
                        process.WaitForExit(2000);
                    } catch {
                    }
                    result.KillConfirmed = process.HasExited;
                }

                try {
                    Task.WaitAll(stdoutTask, stderrTask);
                } catch {
                }

                result.ExitCode = process.HasExited ? process.ExitCode : -1;
                result.StandardOutput = stdoutTask != null && stdoutTask.Status == TaskStatus.RanToCompletion ? stdoutTask.Result : string.Empty;
                result.StandardError = stderrTask != null && stderrTask.Status == TaskStatus.RanToCompletion ? stderrTask.Result : string.Empty;
            }
            finally {
                sw.Stop();
                result.DurationMs = sw.ElapsedMilliseconds;
                if (process != null) {
                    process.Dispose();
                }
            }
            return result;
        }

        private static string BuildArguments(string[] arguments) {
            var builder = new StringBuilder();
            if (arguments == null) {
                return string.Empty;
            }
            for (var i = 0; i < arguments.Length; i++) {
                if (i > 0) {
                    builder.Append(' ');
                }
                builder.Append(EscapeArgument(arguments[i]));
            }
            return builder.ToString();
        }

        private static string EscapeArgument(string value) {
            if (value == null) {
                return "\"\"";
            }
            if (value.Length == 0) {
                return "\"\"";
            }
            var needsQuotes = value.IndexOfAny(new char[] { ' ', '\t', '\n', '\v', '"' }) >= 0;
            if (!needsQuotes) {
                return value;
            }
            var sb = new StringBuilder();
            sb.Append('"');
            var backslashes = 0;
            for (var i = 0; i < value.Length; i++) {
                var c = value[i];
                if (c == '\\') {
                    backslashes++;
                } else if (c == '"') {
                    sb.Append(new string('\\', backslashes * 2 + 1));
                    sb.Append('"');
                    backslashes = 0;
                } else {
                    if (backslashes > 0) {
                        sb.Append(new string('\\', backslashes));
                        backslashes = 0;
                    }
                    sb.Append(c);
                }
            }
            if (backslashes > 0) {
                sb.Append(new string('\\', backslashes * 2));
            }
            sb.Append('"');
            return sb.ToString();
        }
    }
}
'@
    Add-Type -TypeDefinition $source -Language CSharp -ErrorAction Stop | Out-Null
}

function Invoke-BranaGitReadOnly {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Operation,
        [Parameter(Mandatory)]
        [string]$RepositoryPath,
        [int]$TimeoutSeconds = 30
    )

    if (-not $script:BranaGitAllowlist.Contains($Operation)) {
        throw "Operation not allowed: $Operation"
    }

    if (-not (Test-BranaGitAvailable)) {
        throw 'git.exe is not available.'
    }

    $template = $script:BranaGitAllowlist[$Operation]
    Initialize-BranaGitProcessHelper
    $result = [Brana.Release.Git.ProcessHelper]::Run('git.exe', $RepositoryPath, @($template), $TimeoutSeconds * 1000)
    $stdout = [string]$result.StandardOutput
    $stderr = [string]$result.StandardError
    $exitCode = [int]$result.ExitCode

    return [pscustomobject]@{
        ExitCode = $exitCode
        StdOut = $stdout
        StdErr = $stderr
        TimedOut = [bool]$result.TimedOut
        DurationMs = [int64]$result.DurationMs
        ProcessId = [int]$result.ProcessId
        KillAttempted = [bool]$result.KillAttempted
        KillConfirmed = [bool]$result.KillConfirmed
    }
}

function Test-BranaGitRepository {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Path
    )

    try {
        $result = Invoke-BranaGitReadOnly -Operation 'rev-parse --is-inside-work-tree' -RepositoryPath $Path
        return ($result.ExitCode -eq 0 -and $result.StdOut.Trim().ToLowerInvariant() -eq 'true')
    }
    catch {
        return $false
    }
}

function Get-BranaGitRepositorySummary {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Path,
        [string[]]$RequiredPaths = @()
    )

    $workingRootResult = Invoke-BranaGitReadOnly -Operation 'rev-parse --show-toplevel' -RepositoryPath $Path
    if ($workingRootResult.ExitCode -ne 0) {
        throw ('Unable to resolve git repository root: ' + ($workingRootResult.StdErr.Trim()))
    }

    $root = ($workingRootResult.StdOut.Trim() -replace '\\','/')
    $branchResult = Invoke-BranaGitReadOnly -Operation 'rev-parse --abbrev-ref HEAD' -RepositoryPath $root
    $headResult = Invoke-BranaGitReadOnly -Operation 'rev-parse HEAD' -RepositoryPath $root
    $shortResult = Invoke-BranaGitReadOnly -Operation 'rev-parse --short HEAD' -RepositoryPath $root
    $remoteResult = Invoke-BranaGitReadOnly -Operation 'remote -v' -RepositoryPath $root
    $statusResult = Invoke-BranaGitReadOnly -Operation 'status --porcelain=v1 --branch' -RepositoryPath $root

    if ($branchResult.ExitCode -ne 0 -or $headResult.ExitCode -ne 0 -or $shortResult.ExitCode -ne 0 -or $remoteResult.ExitCode -ne 0 -or $statusResult.ExitCode -ne 0) {
        throw 'Unable to collect git repository summary.'
    }

    $branch = $branchResult.StdOut.Trim()
    $head = $headResult.StdOut.Trim()
    $headShort = $shortResult.StdOut.Trim()
    $remoteLines = @($remoteResult.StdOut -split '\r?\n' | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
    $statusLines = @($statusResult.StdOut -split '\r?\n' | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })

    $summary = [ordered]@{
        RepositoryPathRequested = (ConvertTo-BranaNormalizedPath -Path $Path)
        RepositoryRoot = $root
        IsRepository = $true
        Branch = $branch
        Head = $head
        HeadShort = $headShort
        IsDetachedHead = ($branch -eq 'HEAD')
        RemoteLines = @($remoteLines)
        StatusLines = @($statusLines)
        RequiredPaths = @($RequiredPaths)
        Warnings = @()
        Errors = @()
    }

    $counts = [ordered]@{
        ModifiedCount = 0
        StagedCount = 0
        UntrackedCount = 0
        DeletedCount = 0
        RenamedCount = 0
        ConflictedCount = 0
    }
    $files = [ordered]@{
        ModifiedFiles = @()
        StagedFiles = @()
        UntrackedFiles = @()
        DeletedFiles = @()
        RenamedFiles = @()
        ConflictedFiles = @()
    }

    foreach ($line in $statusLines) {
        if ($line.StartsWith('## ')) { continue }
        if ($line.Length -lt 3) { continue }
        $xy = $line.Substring(0,2)
        $pathPart = $line.Substring(3)
        $primaryPath = $pathPart
        if ($pathPart -match ' -> ') {
            $primaryPath = $pathPart.Split(' -> ')[1]
            $files.RenamedFiles += $primaryPath
            $counts.RenamedCount++
        }
        if ($xy[0] -ne ' ' -and $xy[0] -ne '?') {
            $counts.StagedCount++
            $files.StagedFiles += $primaryPath
        }
        if ($xy[1] -ne ' ' -and $xy[1] -ne '?') {
            if ($xy[1] -eq 'D') { $counts.DeletedCount++ }
            else { $counts.ModifiedCount++ }
            $files.ModifiedFiles += $primaryPath
        }
        if ($xy[0] -eq '?') {
            $counts.UntrackedCount++
            $files.UntrackedFiles += $primaryPath
        }
        if ($xy -match 'U') {
            $counts.ConflictedCount++
            $files.ConflictedFiles += $primaryPath
        }
    }

    foreach ($required in $RequiredPaths) {
        if (-not [string]::IsNullOrWhiteSpace($required)) {
            $candidate = Join-Path $root $required
            if (-not (Test-Path -LiteralPath $candidate)) {
                $summary.Errors += ("Missing required git path: {0}" -f $required)
            }
        }
    }

    if ($counts.ConflictedCount -gt 0) {
        $summary.Errors += 'Merge conflicts detected.'
    }
    if ($counts.StagedCount -gt 0) {
        $summary.Warnings += 'Staged changes present.'
    }
    if ($counts.ModifiedCount -gt 0 -or $counts.UntrackedCount -gt 0 -or $counts.DeletedCount -gt 0 -or $counts.RenamedCount -gt 0) {
        $summary.Warnings += 'Working tree is dirty.'
    }

    foreach ($name in $counts.Keys) {
        $summary[$name] = $counts[$name]
    }
    foreach ($name in $files.Keys) {
        $summary[$name] = @($files[$name])
    }
    $summary.WorktreeDirty = (($counts.ModifiedCount + $counts.UntrackedCount + $counts.DeletedCount + $counts.RenamedCount) -gt 0)
    $summary.StageDirty = ($counts.StagedCount -gt 0)
    $summary.IsHealthy = ($summary.Errors.Count -eq 0)

    return [pscustomobject]$summary
}

Export-ModuleMember -Function Test-BranaGitAvailable,Test-BranaGitRepository,Get-BranaGitRepositorySummary,Invoke-BranaGitReadOnly
