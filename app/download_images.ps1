$images = @{
    "stock-reposition.jpg" = "https://images.pexels.com/photos/6476587/pexels-photo-6476587.jpeg?auto=compress&cs=tinysrgb&w=800"
    "client-keep.jpg" = "https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg?auto=compress&cs=tinysrgb&w=800"
    "client-rebuy.jpg" = "https://images.pexels.com/photos/4464438/pexels-photo-4464438.jpeg?auto=compress&cs=tinysrgb&w=800"
    "fraud-detection-1.jpg" = "https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg?auto=compress&cs=tinysrgb&w=800"
    "fraud-detection-2.jpg" = "https://images.pexels.com/photos/3943725/pexels-photo-3943725.jpeg?auto=compress&cs=tinysrgb&w=800"
    "production-req.jpg" = "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=800"
    "landing-saas-1.jpg" = "https://images.pexels.com/photos/1181670/pexels-photo-1181670.jpeg?auto=compress&cs=tinysrgb&w=800"
    "portal-b2b-1.jpg" = "https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=800"
    "portal-b2b-2.jpg" = "https://images.pexels.com/photos/1181304/pexels-photo-1181304.jpeg?auto=compress&cs=tinysrgb&w=800"
    "app-sales-1.jpg" = "https://images.pexels.com/photos/1181243/pexels-photo-1181243.jpeg?auto=compress&cs=tinysrgb&w=800"
    "app-sales-2.jpg" = "https://images.pexels.com/photos/1181265/pexels-photo-1181265.jpeg?auto=compress&cs=tinysrgb&w=800"
    "backoffice-1.jpg" = "https://images.pexels.com/photos/1181275/pexels-photo-1181275.jpeg?auto=compress&cs=tinysrgb&w=800"
    "backoffice-2.jpg" = "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg?auto=compress&cs=tinysrgb&w=800"
    "marketplace-1.jpg" = "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800"
    "marketplace-2.jpg" = "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800"
    "dash-exec-1.jpg" = "https://images.pexels.com/photos/669619/pexels-photo-669619.jpeg?auto=compress&cs=tinysrgb&w=800"
    "dash-logistics-1.jpg" = "https://images.pexels.com/photos/1181317/pexels-photo-1181317.jpeg?auto=compress&cs=tinysrgb&w=800"
    "dash-saas-1.jpg" = "https://images.pexels.com/photos/6476584/pexels-photo-6476584.jpeg?auto=compress&cs=tinysrgb&w=800"
    "dash-marketing-1.jpg" = "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=800"
    "dash-finance-1.jpg" = "https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=800"
    "dash-finance-2.jpg" = "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=800"
    "fallback-project.jpg" = "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800"
    "about-hero.jpg" = "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920"
    "about-story.jpg" = "https://images.pexels.com/photos/17483874/pexels-photo-17483874.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
}

$destDir = "src/assets/images/external"

foreach ($name in $images.Keys) {
    $url = $images[$name]
    $output = Join-Path $destDir $name
    Write-Host "Downloading $name..."
    Invoke-WebRequest -Uri $url -OutFile $output
}
