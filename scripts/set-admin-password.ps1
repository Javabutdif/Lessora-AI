# Set a new password for an existing Lessora admin account.
# Usage (from anywhere): powershell -File scripts/set-admin-password.ps1
$repoRoot = Split-Path -Parent $PSScriptRoot
Push-Location $repoRoot
try {
    if (-not (Test-Path ".env")) {
        Write-Error "No .env file in $repoRoot. It must contain MONGODB_URI."
        exit 1
    }
    node --env-file=.env scripts/set-admin-password.mjs
    exit $LASTEXITCODE
}
finally {
    Pop-Location
}
