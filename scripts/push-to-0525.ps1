# Pictory-Develop → GitHub branch 0525
# PowerShell 또는 Git Bash에서 실행: .\scripts\push-to-0525.ps1

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path $PSScriptRoot -Parent
Set-Location $repoRoot

$candidates = @(
  'git'
  'C:\Program Files\Git\cmd\git.exe'
  'C:\Program Files\Git\bin\git.exe'
  'C:\Program Files (x86)\Git\cmd\git.exe'
  "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe"
)

$git = $null
foreach ($c in $candidates) {
  if ($c -eq 'git') {
    $cmd = Get-Command git -ErrorAction SilentlyContinue
    if ($cmd) { $git = $cmd.Source; break }
  } elseif (Test-Path $c) {
    $git = $c
    break
  }
}

if (-not $git) {
  Write-Host 'Git을 찾을 수 없습니다. Git for Windows 설치 후 PATH에 추가하거나,' -ForegroundColor Red
  Write-Host 'GitHub Desktop에서 Branch 0525로 Commit & Push 하세요.' -ForegroundColor Yellow
  exit 1
}

Write-Host "Using: $git" -ForegroundColor Cyan

& $git checkout 0525
& $git add -A
& $git status
& $git commit -m "UX: 뷰파인더 스포트라이트, 셔터 클릭, 조리개 로더 및 추천 플로우 개선"
& $git push -u origin 0525

Write-Host 'Done. Check: https://github.com/yms030808-code/Pictory-Develop/tree/0525' -ForegroundColor Green
