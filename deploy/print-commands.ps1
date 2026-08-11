# Print exact go-live commands for your domain + VPS
# Usage:
#   powershell -File deploy\print-commands.ps1 -Domain escortbenidorm.es -VpsIp 1.2.3.4
#   powershell -File deploy\print-commands.ps1 -Domain escortbenidorm.es -VpsIp 1.2.3.4 -User root

param(
  [Parameter(Mandatory = $true)][string]$Domain,
  [Parameter(Mandatory = $true)][string]$VpsIp,
  [string]$User = "root",
  [string]$Email = ""
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$zip = Get-ChildItem (Join-Path $root "backups\escort-benidorm-upload-*.zip") -ErrorAction SilentlyContinue |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1

if (-not $Email) { $Email = "admin@$Domain" }

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " EscortBenidorm — your deploy commands"
Write-Host " Domain: $Domain"
Write-Host " VPS:    $User@$VpsIp"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "0) DNS at your registrar (wait until green):" -ForegroundColor Yellow
Write-Host "   A    @     $VpsIp"
Write-Host "   A    www   $VpsIp"
Write-Host ""

if ($zip) {
  Write-Host "1) From THIS PC (PowerShell):" -ForegroundColor Yellow
  Write-Host "   scp `"$($zip.FullName)`" ${User}@${VpsIp}:/tmp/eb.zip"
} else {
  Write-Host "1) First create zip: double-click go-live-pack.bat" -ForegroundColor Red
  Write-Host "   then: scp backups\escort-benidorm-upload-XXXX.zip ${User}@${VpsIp}:/tmp/eb.zip"
}
Write-Host ""

Write-Host "2) SSH into VPS:" -ForegroundColor Yellow
Write-Host "   ssh ${User}@${VpsIp}"
Write-Host ""

Write-Host "3) On the VPS paste:" -ForegroundColor Yellow
Write-Host @"
apt-get update -y && apt-get install -y unzip
mkdir -p /var/www/escort-benidorm
unzip -o /tmp/eb.zip -d /var/www/escort-benidorm
cd /var/www/escort-benidorm
DOMAIN=$Domain EMAIL=$Email bash deploy/install-vps.sh
nano .env
# set PAY_BIZUM, PAY_IBAN, PAY_HOLDER, OPERATOR_*, SITE_URL=https://$Domain, ALLOW_MOCK_PAY=0
pm2 restart escort-benidorm
"@
Write-Host ""

Write-Host "4) Phone test (mobile data):" -ForegroundColor Yellow
Write-Host "   https://$Domain"
Write-Host "   https://$Domain/api/health"
Write-Host "   https://$Domain/admin.html"
Write-Host "   https://$Domain/precios.html"
Write-Host ""

Write-Host "5) Google Search Console → add $Domain → sitemap:" -ForegroundColor Yellow
Write-Host "   https://$Domain/sitemap.xml"
Write-Host ""
Write-Host "Done. Ops guide: DAY1-OPS.md"
Write-Host ""
