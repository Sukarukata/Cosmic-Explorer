$base = 'C:\Users\dat50\.gemini\antigravity\scratch\cosmos-exploration'
$html = [System.IO.File]::ReadAllText("$base\index.html", [System.Text.Encoding]::UTF8)
$css = [System.IO.File]::ReadAllText("$base\css\style.css", [System.Text.Encoding]::UTF8)
$data = [System.IO.File]::ReadAllText("$base\js\data.js", [System.Text.Encoding]::UTF8)
$app = [System.IO.File]::ReadAllText("$base\js\app.js", [System.Text.Encoding]::UTF8)

$styleTag = "<style>`n" + $css + "`n</style>"
$scriptTag = "<script>`n" + $data + "`n" + $app + "`n</script>"

$html = [System.Text.RegularExpressions.Regex]::Replace($html, '<link rel="stylesheet" href="css/style\.css[^"]*" />', $styleTag)
$html = [System.Text.RegularExpressions.Regex]::Replace($html, '<script src="js/data\.js[^"]*"></script>', '')
$html = [System.Text.RegularExpressions.Regex]::Replace($html, '<script src="js/app\.js[^"]*"></script>', $scriptTag)

[System.IO.File]::WriteAllText("$base\kham-pha-vu-tru.html", $html, [System.Text.Encoding]::UTF8)
Write-Output "Successfully built kham-pha-vu-tru.html"
Get-Item "$base\kham-pha-vu-tru.html" | Select-Object Name, Length
