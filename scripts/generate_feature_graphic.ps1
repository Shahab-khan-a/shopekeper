Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\Admin0\Desktop\myproject\colab\shopekeper-main\assets\images\mainLogoImage.png"
$outDir = "c:\Users\Admin0\Desktop\myproject\colab\shopekeper-main\store_assets"
$featPath = Join-Path $outDir "feature_graphic_1024x500.png"

$src = [System.Drawing.Image]::FromFile($srcPath)
$bmp = New-Object System.Drawing.Bitmap(1024, 500)
$g = [System.Drawing.Graphics]::FromImage($bmp)

$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Modern Slate Navy Gradient
$rect = New-Object System.Drawing.Rectangle(0, 0, 1024, 500)
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.Color]::FromArgb(15, 23, 42), [System.Drawing.Color]::FromArgb(30, 58, 138), 25.0)
$g.FillRectangle($brush, $rect)
$brush.Dispose()

# Draw Logo on left (300x300 at x=80, y=100)
$g.DrawImage($src, 80, 100, 300, 300)

# Fonts
$fontTitle = New-Object System.Drawing.Font("Segoe UI", 40, [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Regular)
$fontBadges = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)

$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$brushCyan = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(56, 189, 248))
$brushMuted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(203, 213, 225))

$g.DrawString("DigiShop POS", $fontTitle, $brushWhite, 430, 120)
$g.DrawString("Smart Retail Billing & Udhaar Khata", $fontSub, $brushCyan, 435, 205)
$g.DrawString("100% Offline  |  Fast POS  |  Cloud Sync", $fontBadges, $brushMuted, 435, 265)

$brushWhite.Dispose()
$brushCyan.Dispose()
$brushMuted.Dispose()
$fontTitle.Dispose()
$fontSub.Dispose()
$fontBadges.Dispose()
$g.Dispose()

$bmp.Save($featPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$src.Dispose()

Write-Output "Successfully generated: $featPath"
