$lines = Get-Content 'd:\Documents\hackathon AI\fivegood-demo\app\globals.css'
$start = 545
$end = 0
for($i = 0; $i -lt $lines.Count; $i++) {
    if($lines[$i] -match '^:root \{') {
        $end = $i
        break
    }
}
Write-Output "Keep lines 1-$start and $($end+1)-$($lines.Count)"
$newContent = $lines[0..($start-1)] + $lines[$end..($lines.Count-1)]
Set-Content 'd:\Documents\hackathon AI\fivegood-demo\app\globals.css' -Value $newContent
Write-Output "Done! New total: $($newContent.Count) lines"
