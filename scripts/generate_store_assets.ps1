Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\Admin0\Desktop\myproject\colab\shopekeper-main\assets\images\mainLogoImage.png"
$outDir = "c:\Users\Admin0\Desktop\myproject\colab\shopekeper-main\store_assets"
if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}

$iconPath = Join-Path $outDir "icon_512x512.png"
$featPath = Join-Path $outDir "feature_graphic_1024x500.png"

# 1. Generate 512x512 Icon
$src = [System.Drawing.Image]::FromFile($srcPath)
$iconBmp = New-Object System.Drawing.Bitmap 512, 512
$iconG = [System.Drawing.Graphics]::FromImage($iconBmp)
$iconG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$iconG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$iconG.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$iconG.Clear([System.Drawing.Color]::White)
$iconG.DrawImage($src, 0, 0, 512, 512)
$iconG.Dispose()
$iconBmp.Save($iconPath, [System.Drawing.Imaging.ImageFormat]::Png)
$iconBmp.Dispose()
Write-Output "Created $iconPath"

# 2. Generate 1024x500 Feature Graphic
$featBmp = New-Object System.Drawing.Bitmap 1024, 500
$featG = [System.Drawing.Graphics]::FromImage($featBmp)
$featG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$featG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$featG.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Gradient Background (Deep Slate Blue to Modern Indigo)
$rect = New-Object System.Drawing.Rectangle 0, 0, 1024, 500
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, ([System.Drawing.Color]::FromArgb(15, 23, 42)), ([System.Drawing.Color]::FromArgb(30, 58, 138)), 45.0
$featG.FillRectangle($brush, $rect)
$brush.Dispose()

# Draw Logo centered vertically on the left
# Logo size 300x300 at x=80, y=100
$featG.DrawImage($src, 80, 100, 300, 300)

# Text on right
$fontTitle = New-Object System.Drawing.Font "Segoe UI", 42, [System.Drawing.FontStyle]::Bold
$fontSub = New-Object System.Drawing.Font "Segoe UI", 20, [System.Drawing.FontStyle]::Regular
$fontBadge = New-Object System.Drawing.Font "Segoe UI", 16, [System.Drawing.FontStyle]::Bold

$whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$cyanBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(56, 189, 248))
$mutedBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(203, 213, 225))

$featG.DrawString("Shopkeeper POS", $fontTitle, $whiteBrush, 430, 120)
$featG.DrawString("Offline-First POS, Billing & Khata", $fontSub, $cyanBrush, 435, 200)
$featG.DrawString("✔ 100% Offline  ✔ Udhaar Ledger  ✔ Cloud Sync", $fontBadge, $mutedBrush, 435, 260)
$featG.DrawString("دکاندار ایپ - تیز رفتار بلنگ اور کھاتہ", $fontSub, $whiteBrush, 435, 320)

$whiteBrush.Dispose()
$cyanBrush.Dispose()
$mutedBrush.Dispose()
$fontTitle.Dispose()
$fontSub.Dispose()
$fontBadge.Dispose()
$featG.Dispose()

$featBmp.Save($featPath, [System.Drawing.Imaging.ImageFormat]::Png)
$featBmp.Dispose()
$src.Dispose()

Write-Output "Created $featPath"
