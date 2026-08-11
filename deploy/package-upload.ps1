# Build a clean upload ZIP for the VPS (no node_modules, no secrets)
# Run: powershell -ExecutionPolicy Bypass -File deploy\package-upload.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $root "package.json"))) {
  $root = Get-Location
}
$stamp = Get-Date -Format "yyyyMMdd-HHmm"
$outDir = Join-Path $root "backups"
$zipPath = Join-Path $outDir "escort-benidorm-upload-$stamp.zip"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$excludeDirs = @(
  "node_modules", ".git", "backups", ".grok",
  "sessions"
)
$excludeFiles = @(
  ".env", ".env.local", "data\db.json", "data\db.json.tmp",
  "data\ADMIN-CREDENTIALS.txt"
)

$temp = Join-Path $env:TEMP "eb-upload-$stamp"
if (Test-Path $temp) { Remove-Item $temp -Recurse -Force }
New-Item -ItemType Directory -Force -Path $temp | Out-Null

Write-Host "Copying project to temp (clean)..."
Get-ChildItem -Path $root -Force | ForEach-Object {
  $name = $_.Name
  if ($excludeDirs -contains $name) { return }
  if ($name -eq "backups") { return }
  Copy-Item $_.FullName -Destination (Join-Path $temp $name) -Recurse -Force
}

# strip secrets / runtime data
$envFile = Join-Path $temp ".env"
if (Test-Path $envFile) { Remove-Item $envFile -Force }
$db = Join-Path $temp "data\db.json"
if (Test-Path $db) { Remove-Item $db -Force }
$cred = Join-Path $temp "data\ADMIN-CREDENTIALS.txt"
if (Test-Path $cred) { Remove-Item $cred -Force }

# ensure empty runtime dirs
New-Item -ItemType Directory -Force -Path (Join-Path $temp "data") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $temp "uploads") | Out-Null
# keep .gitkeep if present
$keep = Join-Path $root "uploads\.gitkeep"
if (Test-Path $keep) {
  Copy-Item $keep (Join-Path $temp "uploads\.gitkeep") -Force
}

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path (Join-Path $temp "*") -DestinationPath $zipPath -Force
Remove-Item $temp -Recurse -Force

$sizeMb = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
Write-Host ""
Write-Host "OK Upload package ready:"
Write-Host "  $zipPath"
Write-Host "  Size: $sizeMb MB"
Write-Host ""
Write-Host "Next on VPS:"
Write-Host "  1) scp the zip to root@YOUR_VPS_IP:/tmp/"
Write-Host "  2) unzip to /var/www/escort-benidorm"
Write-Host "  3) DOMAIN=yourdomain.com bash deploy/install-vps.sh"
Write-Host ""
Write-Host "Or see LIVE-TOMORROW.md"
