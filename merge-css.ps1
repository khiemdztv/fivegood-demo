$css = Get-Content 'd:\Documents\hackathon AI\fivegood-demo\app\globals.css' -Raw
$newCss = Get-Content 'd:\Documents\hackathon AI\fivegood-demo\app\landing-new.css' -Raw

# Find the position of ":root {" and keep everything from there
$rootIdx = $css.IndexOf("`r`n:root {")
if ($rootIdx -lt 0) { $rootIdx = $css.IndexOf("`n:root {") }

$header = @"
/* ═══════════════════════════════════════════════════
   FiveGood Journey – Design System
   Based on sv5t-copilot-srs-brd.html design tokens
   ═══════════════════════════════════════════════════ */

@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,700;1,800&family=JetBrains+Mono:wght@400;600&family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&display=swap');

"@

$appCss = $css.Substring($rootIdx)
$finalCss = $header + $newCss + "`n`n" + $appCss
Set-Content 'd:\Documents\hackathon AI\fivegood-demo\app\globals.css' -Value $finalCss -NoNewline
Write-Output "Done! Written $(($finalCss -split "`n").Count) lines"
