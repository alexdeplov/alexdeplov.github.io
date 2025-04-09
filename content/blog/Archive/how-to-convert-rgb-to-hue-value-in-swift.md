+++
title = "How to Convert RGB to HUE Value in Swift"
date = 2017-06-22T10:46:05+02:00
draft = false
featured = false
author = "Alexander Deplov"
+++
Sometimes it’s handy to use HUE properties in apps or games to animate its saturation or brightness or even the color itself. So here is super simple func to convert RGB to HUE.

```swift
let r: CGFloat = 251/255
let g: CGFloat = 94/255
let b: CGFloat = 50/255

func rgbToHue(r: CGFloat, g: CGFloat, b: CGFloat) -> (h: CGFloat, s: CGFloat, b: CGFloat) {
    let minV: CGFloat = CGFloat(min(r, g, b))
    let maxV: CGFloat = CGFloat(max(r, g, b))
    let delta: CGFloat = maxV - minV
    
    var hue: CGFloat = 0
    if delta != 0 {
        if r == maxV {
            hue = (g - b) / delta
        } else if g == maxV {
            hue = 2 + (b - r) / delta
        } else {
            hue = 4 + (r - g) / delta
        }
        
        hue *= 60
        if hue < 0 {
            hue += 360
        }
    }
    
    let saturation = maxV == 0 ? 0 : (delta / maxV)
    let brightness = maxV
    
    return (h: hue/360, s: saturation, b: brightness)
}

let hueColor = rgbToHue(r: r, g: g, b: b)
let finalColor = SKColor(hue: hueColor.h, saturation: hueColor.s, brightness: hueColor.b, alpha: 1)
```

![](images/1.webp)