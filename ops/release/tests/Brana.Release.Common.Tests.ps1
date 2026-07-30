Import-Module "$PSScriptRoot\..\modules\Brana.Release.Common.psm1" -Force

Describe 'Brana.Release.Common' {
    It 'creates a valid check result' {
        $result = New-BranaCheckResult -Name 'config.environment' -Category 'Configuration' -Status 'PASS' -Severity 'BLOCKING' -Message 'Ambiente valido.' -Evidence @('ok') -DurationMs 0
        $result.Status | Should Be 'PASS'
    }

    It 'rejects invalid status' {
        { New-BranaCheckResult -Name 'x' -Category 'y' -Status 'BOGUS' -Severity 'BLOCKING' -Message 'm' } | Should Throw
    }

    It 'rejects invalid severity' {
        { New-BranaCheckResult -Name 'x' -Category 'y' -Status 'PASS' -Severity 'BOGUS' -Message 'm' } | Should Throw
    }

    It 'rejects negative duration' {
        { New-BranaCheckResult -Name 'x' -Category 'y' -Status 'PASS' -Severity 'INFO' -Message 'm' -DurationMs -1 } | Should Throw
    }

    It 'returns exit codes and does not duplicate values' {
        $codes = Get-BranaExitCodes
        $codes.SUCCESS | Should Be 0
        (($codes.Values | Sort-Object | Get-Unique).Count -eq $codes.Count) | Should Be $true
        Get-BranaExitCode -Name 'MODE_NOT_IMPLEMENTED' | Should Be 9
        { Get-BranaExitCode -Name 'NOPE' } | Should Throw
    }

    It 'detects placeholders and preserves normal text' {
        (Test-BranaPlaceholderValue 'TODO') | Should Be $true
        (Test-BranaPlaceholderValue 'CHANGE_ME') | Should Be $true
        (Test-BranaPlaceholderValue '000000000000') | Should Be $true
        (Test-BranaPlaceholderValue 'hello world') | Should Be $false
        (Test-BranaPlaceholderValue $null) | Should Be $false
        (Get-BranaPlaceholderValue 'TODO') | Should Be $true
    }

    It 'protects nested objects without mutating original' {
        $source = [pscustomobject]@{
            password = 'abc'
            nested = [pscustomobject]@{
                token = 'secret'
                value = 'keep'
            }
        }
        $copy = Protect-BranaObject -InputObject $source
        $copy.password | Should Be '<redacted>'
        $copy.nested.token | Should Be '<redacted>'
        $source.password | Should Be 'abc'
    }

    It 'handles spaces and missing paths' {
        $tempDir = Join-Path $env:TEMP ('brana common ' + [guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $tempDir | Out-Null
        try {
            $path = Join-Path $tempDir 'file.txt'
            Set-Content -LiteralPath $path -Value 'x'
            (ConvertTo-BranaNormalizedPath -Path $path -RequireExists) -match '/' | Should Be $true
            { ConvertTo-BranaNormalizedPath -Path (Join-Path $tempDir 'missing.txt') -RequireExists } | Should Throw
        }
        finally {
            if (Test-Path $tempDir) { Remove-Item -LiteralPath $tempDir -Recurse -Force }
        }
    }
}
