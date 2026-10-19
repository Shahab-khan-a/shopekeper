Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\Admin0\Desktop\myproject\colab\shopekeper-main\assets\images\mainLogoImage.png"
$outDir = "c:\Users\Admin0\Desktop\myproject\colab\shopekeper-main\store_assets"

if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}

$destPath = Join-Path $outDir "play_store_icon_512x512.png"

$src = [System.Drawing.Image]::FromFile($srcPath)
$bmp = New-Object System.Drawing.Bitmap(512, 512)
$g = [System.Drawing.Graphics]::FromImage($bmp)

$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

# Clean white background matching the app branding
$g.Clear([System.Drawing.Color]::White)

# 56px padding on all sides -> 400x400 logo centered inside 512x512 canvas
$padding = 56
$logoSize = 512 - ($padding * 2) # 400px

$g.DrawImage($src, $padding, $padding, $logoSize, $logoSize)

$bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()
$src.Dispose()

Write-Output "Successfully updated 512x512 icon with comfortable breathing space: $destPath"
