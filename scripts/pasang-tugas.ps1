<#
    Mendaftarkan `dev-24jam.ps1` supaya menyala sendiri setiap masuk Windows.

    Tugasnya didaftarkan **hanya untuk pengguna yang menjalankan skrip ini**,
    bukan untuk seluruh komputer, sehingga tidak menuntut hak administrator
    dan tidak menyentuh apa pun di luar akun ini.

    Yang disetel:
      - Menyala saat masuk Windows, dengan jeda 30 detik supaya jaringan dan
        layanan lain sempat siap lebih dulu.
      - Berjalan tersembunyi, tanpa jendela konsol yang mengganggu.
      - Dicoba lagi tiga kali bila gagal menyala.
      - Tanpa batas waktu jalan: tugas ini memang dimaksudkan hidup terus.
      - Tetap jalan saat memakai baterai. Bawaan Windows menghentikan tugas
        begitu daya dicabut, dan itu persis lawan dari yang diinginkan di
        sini.

    Menjalankan:
        powershell -ExecutionPolicy Bypass -File "scripts\pasang-tugas.ps1"

    Membatalkan:
        powershell -ExecutionPolicy Bypass -File "scripts\pasang-tugas.ps1" -Hapus
#>

param(
    # Menghapus tugasnya, bukan memasang.
    [switch]$Hapus
)

$ErrorActionPreference = "Stop"

$nama = "CV ATS Builder - server lokal"
$root = Split-Path -Parent $PSScriptRoot
$skrip = Join-Path $PSScriptRoot "dev-24jam.ps1"

if ($Hapus) {
    if (Get-ScheduledTask -TaskName $nama -ErrorAction SilentlyContinue) {
        Unregister-ScheduledTask -TaskName $nama -Confirm:$false
        Write-Output "Tugas `"$nama`" dihapus. Server lokal tidak lagi menyala sendiri."
    } else {
        Write-Output "Tugas `"$nama`" memang belum terpasang."
    }
    return
}

if (-not (Test-Path $skrip)) {
    throw "Tidak menemukan $skrip"
}

$action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$skrip`"" `
    -WorkingDirectory $root

$trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
$trigger.Delay = "PT30S"

$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 1) `
    -ExecutionTimeLimit (New-TimeSpan -Seconds 0) `
    -MultipleInstances IgnoreNew

$principal = New-ScheduledTaskPrincipal `
    -UserId "$env:USERDOMAIN\$env:USERNAME" `
    -LogonType Interactive `
    -RunLevel Limited

if (Get-ScheduledTask -TaskName $nama -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $nama -Confirm:$false
}

Register-ScheduledTask `
    -TaskName $nama `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Principal $principal `
    -Description "Menjalankan PostgreSQL lokal dan Next.js dev server untuk project CV ATS Builder, dan menyalakannya lagi bila mati." | Out-Null

Write-Output "Tugas `"$nama`" terpasang."
Write-Output ""
Write-Output "Menyalakan sekarang tanpa menunggu masuk ulang:"
Write-Output "    Start-ScheduledTask -TaskName `"$nama`""
Write-Output ""
Write-Output "Melihat statusnya:"
Write-Output "    Get-ScheduledTask -TaskName `"$nama`" | Get-ScheduledTaskInfo"
Write-Output ""
Write-Output "Lognya ada di: $(Join-Path $env:LOCALAPPDATA 'cv-ats-builder\logs')"
