function Invoke-BranaRunnerProcess {
    param(
        [string[]]$Arguments
    )

    $scriptPath = (Resolve-Path (Join-Path $PSScriptRoot '..\brana-release.ps1')).Path
    $argsLine = @('-NoProfile','-ExecutionPolicy','Bypass','-File',('"{0}"' -f $scriptPath)) + $Arguments
    $stdout = & powershell.exe @argsLine 2>&1 | Out-String
    $exitCode = $LASTEXITCODE
    return [pscustomobject]@{ ExitCode = $exitCode; Stdout = $stdout; Stderr = $null }
}

Describe 'Brana.Release runner' {
    It 'runner exists and parses' {
        Test-Path "$PSScriptRoot\..\brana-release.ps1" | Should Be $true
        $errors = $null
        [System.Management.Automation.Language.Parser]::ParseFile((Resolve-Path "$PSScriptRoot\..\brana-release.ps1"), [ref]$null, [ref]$errors) | Out-Null
        @($errors).Count | Should Be 0
    }

    It 'help is available' {
        $help = Get-Help "$PSScriptRoot\..\brana-release.ps1" -Full
        $help.Name | Should Match 'brana-release\.ps1'
    }

    It 'unknown mode returns code 2' {
        $r = Invoke-BranaRunnerProcess -Arguments @('-Mode','bogus','-Environment','hml','-OutputFormat','Text')
        $r.ExitCode | Should Be 2
    }

    It 'preflight mode is available and blocks express gateway rolling attempts' {
        $r = Invoke-BranaRunnerProcess -Arguments @('-Mode','preflight','-Environment','hml','-OutputFormat','Text')
        $r.ExitCode | Should Not Be 9
        $r.Stdout | Should Match 'Plano canary bloqueado'
        $r.Stdout | Should Match 'canary telemetry signals are required'
    }

    It 'invalid output format is rejected' {
        $r = Invoke-BranaRunnerProcess -Arguments @('-Mode','audit','-Environment','hml','-OutputFormat','Xml')
        $r.ExitCode | Should Be 2
    }

    It 'audit without environment is rejected' {
        $r = Invoke-BranaRunnerProcess -Arguments @('-Mode','audit','-OutputFormat','Text')
        $r.ExitCode | Should Be 2
    }

    It 'status without contract is rejected' {
        $r = Invoke-BranaRunnerProcess -Arguments @('-Mode','status','-OutputFormat','Text')
        $r.ExitCode | Should Be 2
    }

    It 'audit text works' {
        $r = Invoke-BranaRunnerProcess -Arguments @('-Mode','audit','-Environment','hml','-RepositoryPath','D:\BRANA ARQUIVOS\BRANA CLOUD','-OutputFormat','Text')
        $r.ExitCode | Should Be 0
        $r.Stdout | Should Match 'Brana Release Runner'
        $r.Stdout | Should Match 'Mode: audit'
        $r.Stdout | Should Match 'Configuration: valid'
    }

    It 'audit json is pure json' {
        $r = Invoke-BranaRunnerProcess -Arguments @('-Mode','audit','-Environment','hml','-RepositoryPath','D:\BRANA ARQUIVOS\BRANA CLOUD','-OutputFormat','Json')
        $r.ExitCode | Should Be 0
        $r.Stdout.Trim().Substring(0,1) | Should Be '{'
        $r.Stdout | Should Match '"GitSummary"'
    }

    It 'status text and json work on fixture' {
        $contractPath = Join-Path $env:TEMP ('runner-contract-' + [guid]::NewGuid().ToString('N') + '.json')
        Copy-Item -LiteralPath "$PSScriptRoot\..\examples\release-contract.example.json" -Destination $contractPath
        try {
            $text = Invoke-BranaRunnerProcess -Arguments @('-Mode','status','-ReleaseContractPath',$contractPath,'-OutputFormat','Text')
            $json = Invoke-BranaRunnerProcess -Arguments @('-Mode','status','-ReleaseContractPath',$contractPath,'-OutputFormat','Json')
            $text.ExitCode | Should Be 0
            $json.ExitCode | Should Be 0
            $json.Stdout.Trim().Substring(0,1) | Should Be '{'
        }
        finally {
            if (Test-Path $contractPath) { Remove-Item -LiteralPath $contractPath -Force }
        }
    }

    It 'status invalid contract returns 8' {
        $contractPath = Join-Path $env:TEMP ('runner-bad-contract-' + [guid]::NewGuid().ToString('N') + '.json')
        Set-Content -LiteralPath $contractPath -Value '{' -Encoding UTF8
        try {
            $r = Invoke-BranaRunnerProcess -Arguments @('-Mode','status','-ReleaseContractPath',$contractPath,'-OutputFormat','Text')
            $r.ExitCode | Should Be 8
        }
        finally {
            if (Test-Path $contractPath) { Remove-Item -LiteralPath $contractPath -Force }
        }
    }

    It 'plan dry run blocks hml express gateway without writing' {
        $before = (Get-ChildItem -LiteralPath $PSScriptRoot -Filter '*.tmp' -Force | Measure-Object).Count
        $r = Invoke-BranaRunnerProcess -Arguments @('-Mode','plan','-Environment','hml','-RepositoryPath','D:\BRANA ARQUIVOS\BRANA CLOUD','-OutputFormat','Json','-DryRun')
        $after = (Get-ChildItem -LiteralPath $PSScriptRoot -Filter '*.tmp' -Force | Measure-Object).Count
        $r.ExitCode | Should Not Be 0
        $r.Stdout | Should Match 'Plano canary bloqueado'
        $after | Should Be $before
    }
}
