<#
    Menjalankan aplikasi ini di komputer sendiri, terus-menerus.

    Gunanya satu: supaya hasil pekerjaan dapat dibuka kapan saja di
    http://localhost:3000 tanpa harus menyalakan apa pun lebih dulu - termasuk
    dari ponsel di jaringan Wi-Fi yang sama, lewat alamat jaringan yang
    ditampilkan Next.js saat menyala.

    Dua hal dijaga sekaligus:

      1. PostgreSQL lokal (`prisma dev`). Tanpa ini, halaman yang membaca
         basis data - dashboard, editor, pengaturan - gagal.
      2. Aplikasinya sendiri (`next dev`).

    Keduanya diawasi dalam satu gelung. Bila salah satu mati - komputer
    tertidur, proses ditutup tidak sengaja, galat yang menjatuhkannya - ia
    dinyalakan lagi setelah jeda pendek.

    ## Yang diperiksa adalah portnya, bukan prosesnya

    Ini yang membuat dua percobaan pertama gagal, dan pantas dijelaskan supaya
    tidak diputar balik nanti.

    Di Windows, proses yang **menyalakan** sebuah layanan bukan layanan itu
    sendiri. `prisma dev` menyalakan servernya lalu selesai - dan bila
    servernya sudah hidup, ia keluar dengan kode 0 sambil menulis "Skipped!
    Your prisma dev server is already running". `npm run dev` pun begitu:
    rantai `cmd.exe` > `npm.cmd` > `node` membuat pembungkusnya dapat selesai
    sementara Next.js di ujung rantai tetap melayani.

    Mengawasi prosesnya karena itu menghasilkan hal yang sama pada keduanya:
    pengawas mengira layanannya mati setiap dua puluh detik lalu menyalakan
    satu lagi, sampai beberapa instans berebut port yang sama dan sebagian
    gagal - sementara di log terlihat aplikasinya justru melayani dengan
    baik.

    Yang benar bagi keduanya sama: **tanya portnya.** Kalau ada yang
    mendengarkan di sana, layanannya hidup - siapa pun yang menyalakannya, dan
    dalam bentuk proses apa pun.

    ## Lognya sengaja di luar folder project

    Percobaan pertama menaruhnya di `logs/` di dalam project, dan itu keliru
    dengan cara yang tidak langsung terlihat: `next dev` mengawasi berkas di
    dalam project, sehingga **setiap baris log yang ditulis pengawas ini
    memicu satu pemuatan ulang halaman**. Yang terlihat pengguna adalah
    halaman yang menyegarkan dirinya sendiri sesekali - dan, karena adegan
    pembuka diputar setiap pemuatan, animasi yang tiba-tiba muncul tanpa ada
    yang menyentuh apa pun.

    Diuji langsung: menambahkan satu baris ke berkas log di dalam project
    menghasilkan satu `GET /` tambahan di log server.

    Karena itu lognya kini ditulis ke luar project sama sekali. Letaknya
    ditampilkan pada baris pertama setiap kali pengawas menyala.

    Menjalankannya sekali (jendela ini harus tetap terbuka):
        powershell -ExecutionPolicy Bypass -File "scripts\dev-24jam.ps1"

    Menyalakannya otomatis setiap masuk Windows:
        powershell -ExecutionPolicy Bypass -File "scripts\pasang-tugas.ps1"
#>

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

# Di luar project - lihat alasannya di kepala berkas ini.
$logDir = Join-Path $env:LOCALAPPDATA "cv-ats-builder\logs"
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }

$logUtama = Join-Path $logDir "dev-24jam.log"

function Tulis-Log {
    param([string]$Pesan)
    $baris = "{0}  {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Pesan
    Add-Content -Path $logUtama -Value $baris -Encoding utf8
    Write-Output $baris
}

# Log yang sudah besar dipangkas, bukan dihapus: baris terakhir justru yang
# menjelaskan kenapa sesuatu mati barusan.
function Pangkas-Log {
    param([string]$Path, [int]$MaksBaris = 2000)
    if (-not (Test-Path $Path)) { return }
    $isi = @(Get-Content -Path $Path -ErrorAction SilentlyContinue)
    if ($isi.Count -gt $MaksBaris) {
        $isi | Select-Object -Last ([int]($MaksBaris / 2)) |
            Set-Content -Path $Path -Encoding utf8
    }
}

<#
    Port basis data dibaca dari .env, bukan ditulis tetap di sini.

    `prisma dev` memilih portnya sendiri, dan nomornya berubah bila server
    lokalnya pernah dibuat ulang. Satu-satunya tempat yang pasti mengikuti
    adalah DATABASE_URL - berkas yang sama yang dipakai aplikasinya.
#>
function Ambil-PortDatabase {
    $envPath = Join-Path $root ".env"
    if (-not (Test-Path $envPath)) { return 51213 }

    $baris = Get-Content $envPath | Where-Object { $_ -match '^\s*DATABASE_URL\s*=' }
    if (-not $baris) { return 51213 }

    if ($baris -match ':(\d{2,5})/') { return [int]$Matches[1] }
    return 51213
}

function Port-Mendengarkan {
    param([int]$Port)
    $null -ne (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
}

$portDb = Ambil-PortDatabase
$portWeb = if ($env:PORT) { [int]$env:PORT } else { 3000 }

<#
    Menyalakan sebuah layanan bila portnya tidak menjawab.

    Jeda minimalnya yang penting. Keduanya butuh belasan detik untuk siap, dan
    tanpa jeda ini gelung akan memanggilnya lagi setiap dua puluh detik selagi
    yang pertama masih menyala - persis cara membuat beberapa instans berebut
    port yang sama.
#>
function Jaga-Layanan {
    param(
        [Parameter(Mandatory)][string]$Nama,
        [Parameter(Mandatory)][int]$Port,
        [Parameter(Mandatory)][string]$Perintah,
        [Parameter(Mandatory)][ref]$TerakhirDinyalakan,
        [int]$JedaDetik = 45
    )

    if (Port-Mendengarkan -Port $Port) { return }
    if (((Get-Date) - $TerakhirDinyalakan.Value).TotalSeconds -lt $JedaDetik) { return }

    Tulis-Log "$Nama tidak menjawab di port $Port. Menyalakan..."

    $log = Join-Path $logDir "$Nama.log"
    Pangkas-Log -Path $log

    Start-Process -FilePath "cmd.exe" `
        -ArgumentList "/c", "$Perintah >> `"$log`" 2>&1" `
        -WorkingDirectory $root -WindowStyle Hidden | Out-Null

    $TerakhirDinyalakan.Value = Get-Date
}

<#
    Siapa yang memegang sebuah port.

    Dipakai untuk mengenali basis data yang **mati lalu hidup lagi**. Yang
    berubah dalam keadaan itu bukan portnya - port yang sama tetap dijawab -
    melainkan prosesnya. Mengawasi port saja tidak cukup di sini, dan itu tidak
    bertentangan dengan aturan "tanya portnya" di kepala berkas: portnya tetap
    yang menentukan hidup atau mati, PID hanya menentukan apakah ia proses yang
    sama dengan sebelumnya.
#>
function Pemilik-Port {
    param([int]$Port)
    $c = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
        Select-Object -First 1
    if ($c) { return [int]$c.OwningProcess }
    return 0
}

function Hentikan-Web {
    param([string]$Alasan)
    Tulis-Log "Menyalakan ulang server web: $Alasan"
    Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
        Where-Object { $_.CommandLine -like "*$root*" -and $_.CommandLine -notlike "*prisma*" } |
        ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
    Start-Sleep -Seconds 2
}

Tulis-Log "=== dev-24jam mulai (project: $root, basis data: $portDb, web: $portWeb) ==="
Tulis-Log "Log ada di: $logDir"

$dbTerakhir = [datetime]::MinValue
$webTerakhir = [datetime]::MinValue
$pernahSiap = $false

# PID proses yang sedang memegang port basis data. 0 berarti belum diketahui.
$pidDb = 0

<#
    Basis data dinyalakan dan DITUNGGU lebih dulu, sebelum server web sekali pun
    dijalankan.

    Sebelum ini keduanya dinyalakan pada putaran gelung yang sama, dan urutan
    itu punya akibat yang tidak langsung terlihat: server web sempat menyala
    lebih dulu, membuka lumbung koneksinya ke basis data yang belum siap, lalu
    memegang koneksi yang tidak pernah hidup. Halaman yang tidak menyentuh
    basis data - beranda, /coba - tetap melayani dengan baik, sehingga dari
    luar semuanya tampak normal sampai seseorang membuka penyuntingnya.
#>
$batasTunggu = (Get-Date).AddSeconds(90)
while (-not (Port-Mendengarkan -Port $portDb) -and (Get-Date) -lt $batasTunggu) {
    Jaga-Layanan -Nama "database" -Port $portDb `
        -Perintah "npm run db:dev" -TerakhirDinyalakan ([ref]$dbTerakhir)
    Start-Sleep -Seconds 3
}

if (Port-Mendengarkan -Port $portDb) {
    $pidDb = Pemilik-Port -Port $portDb
    Tulis-Log "Basis data siap di port $portDb (PID $pidDb). Menyalakan server web."
} else {
    <#
        Ini yang dulu tidak pernah dikatakan siapa pun.

        Bila basis data gagal menyala, server web tetap dinyalakan - halamannya
        terbuka, dan satu-satunya tanda bahwa ada yang salah adalah layar galat
        beserta tumpukan stack trace Prisma di web.log. Baris di bawah ini
        menyebutkannya dengan kalimat yang dapat dibaca manusia, di log utama,
        sebelum galatnya sempat terjadi.
    #>
    Tulis-Log "PERINGATAN: basis data TIDAK menyala di port $portDb setelah 90 detik."
    Tulis-Log "  Halaman yang memakai basis data akan gagal. Periksa database.log."
    Tulis-Log "  Lock basi dari proses yang dimatikan paksa adalah sebab yang lazim:"
    Tulis-Log "  hapus HANYA %LOCALAPPDATA%\prisma-dev-nodejs\Data\durable-streams\atscv\server.lock.lock"
}

while ($true) {
    Jaga-Layanan -Nama "database" -Port $portDb `
        -Perintah "npm run db:dev" -TerakhirDinyalakan ([ref]$dbTerakhir)

    <#
        Basis data yang mati lalu hidup lagi adalah PROSES BARU, dan koneksi
        yang dipegang server web menunjuk proses yang sudah tidak ada. Koneksi
        begitu tidak pernah bisa disambung kembali - yang muncul P1017
        ConnectionClosed, pada setiap halaman yang menyentuh basis data,
        sampai server webnya sendiri dinyalakan ulang.

        Sebelum ini tidak ada yang menyadarinya: portnya dijawab, jadi pengawas
        menganggap keduanya sehat, dan yang menemukan masalahnya justru
        pengguna - lewat layar galat.

        Karena itu yang dibandingkan pemilik portnya, bukan sekadar portnya.
    #>
    $pidSekarang = Pemilik-Port -Port $portDb
    if ($pidSekarang -ne 0 -and $pidDb -ne 0 -and $pidSekarang -ne $pidDb) {
        Tulis-Log "Basis data berganti proses (PID $pidDb -> $pidSekarang)."
        Tulis-Log "  Koneksi yang dipegang server web menunjuk proses lama dan tidak dapat disambung."
        Hentikan-Web -Alasan "basis data berganti proses"
        $webTerakhir = [datetime]::MinValue
        $pernahSiap = $false
    }
    if ($pidSekarang -ne 0) { $pidDb = $pidSekarang }

    Jaga-Layanan -Nama "web" -Port $portWeb `
        -Perintah "npm run dev" -TerakhirDinyalakan ([ref]$webTerakhir)

    if (-not $pernahSiap -and (Port-Mendengarkan -Port $portWeb)) {
        $pernahSiap = $true
        Tulis-Log "Siap: http://localhost:$portWeb"

        # Alamat Wi-Fi ikut dicatat supaya halamannya dapat dibuka dari ponsel
        # tanpa harus mencarinya lebih dulu. Next.js sendiri hanya menyebut
        # satu adapter, dan pada komputer yang punya adapter virtual - VirtualBox,
        # WSL, VPN - yang disebutnya kerap justru bukan yang tersambung Wi-Fi.
        Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
            Where-Object {
                $_.IPAddress -ne "127.0.0.1" -and
                $_.IPAddress -notlike "169.254.*" -and
                $_.InterfaceAlias -notmatch "Loopback"
            } |
            ForEach-Object {
                Tulis-Log "  dari perangkat lain ($($_.InterfaceAlias)): http://$($_.IPAddress):$portWeb"
            }
    }

    Start-Sleep -Seconds 20
    Pangkas-Log -Path $logUtama
}
