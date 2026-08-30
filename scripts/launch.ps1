# ============================================================
# 一键预启动:构建 → 部署检查 → AdSense 预检 → 本地预览
# 用法: powershell -ExecutionPolicy Bypass -File scripts\launch.ps1
# ============================================================
$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')

Write-Host "`n===== 1/3 构建站点 =====" -ForegroundColor Cyan
node build.mjs
if ($LASTEXITCODE -ne 0) { Write-Host "构建失败!" -ForegroundColor Red; exit 1 }

Write-Host "`n===== 2/3 部署就绪检查 =====" -ForegroundColor Cyan
node scripts/check-deploy.mjs

Write-Host "`n===== 3/3 AdSense 合规预检 =====" -ForegroundColor Cyan
node scripts/check-adsense.mjs

Write-Host "`n===== 本地预览 =====" -ForegroundColor Cyan
Write-Host "打开 http://127.0.0.1:8080/ 预览网站;按 Ctrl+C 停止" -ForegroundColor Yellow
node server.mjs 8080
