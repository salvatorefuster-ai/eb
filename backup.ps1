# Backup data + uploads
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$dest = Join-Path $root "backups\backup-$stamp"
New-Item -ItemType Directory -Force -Path $dest | Out-Null
if (Test-Path (Join-Path $root "data")) {
  Copy-Item -Recurse (Join-Path $root "data") (Join-Path $dest "data")
}
if (Test-Path (Join-Path $root "uploads")) {
  Copy-Item -Recurse (Join-Path $root "uploads") (Join-Path $dest "uploads")
}
if (Test-Path (Join-Path $root ".env")) {
  Copy-Item (Join-Path $root ".env") (Join-Path $dest ".env")
}
Write-Host "Backup OK -> $dest"
