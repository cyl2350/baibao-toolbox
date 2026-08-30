# ============================================================
# 闲鱼运营定时提醒(Windows 计划任务版)
# 用法:
#   1) 测试:  powershell -ExecutionPolicy Bypass -File scripts/xianyu-reminder.ps1
#   2) 注册计划任务(每天 8:30 / 12:30 / 20:00 弹窗提醒):
#      schtasks /Create /TN "闲鱼运营提醒" /TR "powershell -ExecutionPolicy Bypass -WindowStyle Hidden -File \"%CD%\scripts\xianyu-reminder.ps1\"" /SC DAILY /ST 08:30 /F
#      schtasks /Create /TN "闲鱼午间提醒"  /TR "powershell -ExecutionPolicy Bypass -WindowStyle Hidden -File \"%CD%\scripts\xianyu-reminder.ps1\"" /SC DAILY /ST 12:30 /F
#      schtasks /Create /TN "闲鱼晚间提醒"  /TR "powershell -ExecutionPolicy Bypass -WindowStyle Hidden -File \"%CD%\scripts\xianyu-reminder.ps1\"" /SC DAILY /ST 20:00 /F
#   3) 删除:  schtasks /Delete /TN "闲鱼运营提醒" /F
# ============================================================
$root = Split-Path -Parent $PSScriptRoot
$workbench = Join-Path $root "docs\闲鱼AI代运营工作台\工作台.html"

# 按当前时间给出任务提示
$h = Get-Date -Format HH
if ($h -lt '11') { $slot = "早上(擦亮 6 件商品 + 看曝光数据)" }
elseif ($h -lt '17') { $slot = "中午(回复询价 <10 分钟 + 处理新订单)" }
else { $slot = "晚上(记台账 + 未读跟进 + 复盘调价)" }

$msg = "闲鱼运营提醒:现在是「$slot」时段。`n`n点击确定打开 AI 代运营工作台,10 分钟搞定今日任务。"

# 弹窗提醒(确定后打开工作台)
Add-Type -AssemblyName System.Windows.Forms
$r = [System.Windows.Forms.MessageBox]::Show($msg, "闲鱼 AI 代运营", [System.Windows.Forms.MessageBoxButtons]::OKCancel)
if ($r -eq [System.Windows.Forms.DialogResult]::OK -and (Test-Path $workbench)) {
  Start-Process $workbench
}
