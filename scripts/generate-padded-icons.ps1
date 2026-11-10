Add-Type -AssemblyName System.Drawing

$srcPath = (Resolve-Path "assets\images\mainLogoImage.png").Path
$srcBmp = [System.Drawing.Bitmap]::FromFile($srcPath)

# Source bounds of real logo in mainLogoImage.png
$minX = 156; $maxX = 1880; $minY = 560; $maxY = 1600
$srcW = $maxX - $minX + 1 # 1725
$srcH = $maxY - $minY + 1 # 1041

# Target size on 1024x1024 canvas: 570px width (569 x 343 px)
# This provides:
# - 57px safe breathing space inside Samsung/Android squircle mask (171px margin)
# - 9.3px safe clearance inside Google Pixel circular mask (341px radius)
$targetW = 570
$targetH = [int]([Math]::Round($srcH * ($targetW / $srcW))) # 344
$destX = [int]((1024 - $targetW) / 2) # 227
$destY = [int]((1024 - $targetH) / 2) # 340

Write-Host "Creating assets: 1024x1024 canvas, logo=${targetW}x${targetH} centered at (${destX}, ${destY})"

# -------------------------------------------------------------
# 1. Generate 1024x1024 android-icon-foreground.png and icon.png
# -------------------------------------------------------------
$icon1024 = New-Object System.Drawing.Bitmap(1024, 1024)
$g1024 = [System.Drawing.Graphics]::FromImage($icon1024)
$g1024.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g1024.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g1024.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g1024.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$g1024.Clear([System.Drawing.Color]::White)

$srcRect = New-Object System.Drawing.Rectangle($minX, $minY, $srcW, $srcH)
$destRect = New-Object System.Drawing.Rectangle($destX, $destY, $targetW, $targetH)
$g1024.DrawImage($srcBmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

# Save android-icon-foreground.png
$fgPath = (Resolve-Path "assets\images\android-icon-foreground.png").Path
$icon1024.Save($fgPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Updated $fgPath (1024x1024)"

# Save icon.png (used by iOS and Expo main icon)
$iconPath = (Resolve-Path "assets\images\icon.png").Path
$icon1024.Save($iconPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Updated $iconPath (1024x1024)"

# Save favicon.png
$favPath = (Resolve-Path "assets\images\favicon.png").Path
$icon1024.Save($favPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Updated $favPath (1024x1024)"

$g1024.Dispose()
$icon1024.Dispose()

# -------------------------------------------------------------
# 2. Generate 1024x1024 android-icon-background.png (pure white)
# -------------------------------------------------------------
$bg1024 = New-Object System.Drawing.Bitmap(1024, 1024)
$gBg = [System.Drawing.Graphics]::FromImage($bg1024)
$gBg.Clear([System.Drawing.Color]::White)
$bgPath = (Resolve-Path "assets\images\android-icon-background.png").Path
$bg1024.Save($bgPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Updated $bgPath (1024x1024)"
$gBg.Dispose()
$bg1024.Dispose()

# -------------------------------------------------------------
# 3. Generate 1024x1024 android-icon-monochrome.png (valid transparent PNG)
# -------------------------------------------------------------
# Draw logo scaled to temp bitmap first
$tempBmp = New-Object System.Drawing.Bitmap($targetW, $targetH)
$tempG = [System.Drawing.Graphics]::FromImage($tempBmp)
$tempG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$tempG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$tempG.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$tempG.Clear([System.Drawing.Color]::White)
$tempG.DrawImage($srcBmp, (New-Object System.Drawing.Rectangle(0, 0, $targetW, $targetH)), $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

$mono1024 = New-Object System.Drawing.Bitmap(1024, 1024)
$gMono = [System.Drawing.Graphics]::FromImage($mono1024)
$gMono.Clear([System.Drawing.Color]::Transparent)

for ($y = 0; $y -lt $targetH; $y++) {
    for ($x = 0; $x -lt $targetW; $x++) {
        $c = $tempBmp.GetPixel($x, $y)
        # Check if pixel is part of the logo (dark or green)
        $isDark = ($c.R -lt 50 -and $c.G -lt 50 -and $c.B -lt 50)
        $isGreen = ($c.G -gt 80 -and $c.G -gt ($c.R + 25) -and $c.G -gt ($c.B + 15))
        if ($isDark -or $isGreen) {
            # Solid black glyph with full opacity for Android theme engine tinting
            $mono1024.SetPixel($destX + $x, $destY + $y, [System.Drawing.Color]::FromArgb(255, 0, 0, 0))
        } elseif ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            # Anti-aliased edge: compute alpha
            $minVal = [Math]::Min($c.R, [Math]::Min($c.G, $c.B))
            $alpha = [int]([Math]::Round(255.0 * (1.0 - ($minVal / 255.0))))
            if ($alpha -gt 25) {
                if ($alpha -gt 255) { $alpha = 255 }
                $mono1024.SetPixel($destX + $x, $destY + $y, [System.Drawing.Color]::FromArgb($alpha, 0, 0, 0))
            }
        }
    }
}

$monoPath = (Resolve-Path "assets\images\android-icon-monochrome.png").Path
$mono1024.Save($monoPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Updated $monoPath (1024x1024 transparent PNG)"

$tempG.Dispose()
$tempBmp.Dispose()
$gMono.Dispose()
$mono1024.Dispose()

# -------------------------------------------------------------
# 4. Generate 512x512 store_assets/play_store_icon_512x512.png
# -------------------------------------------------------------
$playStoreTargetW = 340
$playStoreTargetH = [int]([Math]::Round($srcH * ($playStoreTargetW / $srcW))) # ~205
$playDestX = [int]((512 - $playStoreTargetW) / 2) # 86
$playDestY = [int]((512 - $playStoreTargetH) / 2) # 153

$playBmp = New-Object System.Drawing.Bitmap(512, 512)
$playG = [System.Drawing.Graphics]::FromImage($playBmp)
$playG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$playG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$playG.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$playG.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$playG.Clear([System.Drawing.Color]::White)

$playDestRect = New-Object System.Drawing.Rectangle($playDestX, $playDestY, $playStoreTargetW, $playStoreTargetH)
$playG.DrawImage($srcBmp, $playDestRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

$playStorePath = (Resolve-Path "store_assets\play_store_icon_512x512.png").Path
$playBmp.Save($playStorePath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Updated $playStorePath (512x512)"

$playG.Dispose()
$playBmp.Dispose()
$srcBmp.Dispose()

Write-Host "All icons generated successfully with clean safe-zone padding!"
