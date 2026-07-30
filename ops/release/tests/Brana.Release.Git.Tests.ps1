Import-Module "$PSScriptRoot\..\modules\Brana.Release.Common.psm1" -Force
Import-Module "$PSScriptRoot\..\modules\Brana.Release.Git.psm1" -Force

Describe 'Brana.Release.Git' {
    It 'module imports' {
        (Get-Module Brana.Release.Git) -ne $null | Should Be $true
    }

    It 'git is available in this environment' {
        Test-BranaGitAvailable | Should Be $true
    }

    It 'detects this repository and exposes summary fields' {
        $summary = Get-BranaGitRepositorySummary -Path "$PSScriptRoot\..\.." -RequiredPaths @('ops/release/brana-release.ps1')
        $summary.IsRepository | Should Be $true
        $summary.RepositoryRoot | Should Match 'BRANA CLOUD'
        $summary.Branch | Should Not Be $null
        $summary.Head | Should Match '^[0-9a-f]{40}$'
        $summary.RequiredPaths.Count | Should Be 1
    }

    It 'reports required path problems as errors' {
        $summary = Get-BranaGitRepositorySummary -Path "$PSScriptRoot\..\.." -RequiredPaths @('does-not-exist.txt')
        $summary.Errors.Count | Should Be 1
        $summary.IsHealthy | Should Be $false
    }

    It 'rejects arbitrary operations before starting git.exe' {
        { Invoke-BranaGitReadOnly -Operation 'reset --hard' -RepositoryPath "$PSScriptRoot\..\.." } | Should Throw
    }
}
