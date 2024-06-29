+++
title = "Recreate the Apple Watch's Iconic Pairing Pattern in Vector"
date = 2021-03-22T10:27:48+02:00
draft = false
featured = false
+++

![](images/0.jpg)

Apple Watch itself is so beautiful, but also its pairing screen. I feel that this pattern is too complicated to be made by hand, so it seems that it was made by using code. It turns out that Apple made it based on 24 ovals, each representing 24 hours in a day. Each oval is offset from the center. So we can easily recreate it in code.

I'm using PaperJS - a vector graphics scripting framework - because you can export any final shape or pattern to an SVG file.

### Start with an ellipse

Create an ellipse in [Sketch](http://sketch.paperjs.org/#V/0.12.15/S/XY/BCsIwEER/ZcmliqGIlYoBT+Jd8OCh7SGNCw2JSUlCC5b+u41VEQ/LMm+GHXYght+RMHJRGERDKBH2FnXHHfjgrMKrvIUGDrApXWniRAu1lq3HCRvs4cxDk55mtBhiBsDLBzIo8pxClu0qOlN4Hz1abR2DpNZcqOTPfDWyX/ENtNbLIK1h0EnsU4EmoIMVFPsthfXcMi4/6binl2qHXLVWmuAJK6rxCQ==) sandbox:

```
var strokeWidth = 2

var ellipse = new Path.Ellipse({
  size: [66, 337],
    strokeColor: 'black',
    strokeWidth: strokeWidth,
    position: view.center + [94, 0],
})
```

The code is simple and self-explanatory, except for the last line where I move the ellipse away from the center x: 94 and y: 0. 

This will be necessary later when we make copies of this ellipse and rotate them around the center.

### Making multiple ellipse clones

A simple for loop is used to create 24 clones.

At the end of the loop, we need to rotate the ellipse by an angle multiplied by the number of clones and rotate it from the center of the view.

Try yourself: [Sketch​​​​​​​](http://sketch.paperjs.org/#V/0.12.15/S/bVBNa8MwDP0rwpemi8nCUjLmbaex+2CHHdIeXFdbTDw72KaFhfz3WUnDWpjASHrv6cMamJXfyAR77zCqlnGm3IHyo/SgjLMY4BnuNlu/tQRJ+2UwIVVd3s70woToXYcf+hBbqiCY3qfzkBGvE1o+Jvd07pviPF8PkIyE5EmHxug+0AyLJ3iTsS1eZygbFh1Z0D8ooKlrDlV1v+NX3LTLizPOC1jtjVTd6h/BtKy4TK5EvQs6amcFHDWeCoU2ooccmocNh/Jv4rheosWf/1B4F2XEbD7aDWh+2WmqGtPF9x5l1zttY2Ci2Y2/)

```
var clones = 24
var angle = 360/clones
var strokeWidth = 2

for (var i = 0; i < clones; i++){    
    var ellipse = new Path.Ellipse({
        size: [66, 337],
        strokeColor: 'black',
        strokeWidth: strokeWidth,
        position: view.center + [94, 0],
    })
    
    ellipse.rotate(angle * i, view.center)
}
```

The fun of the code is that you can tweak any number to get fun and interesting results.

![](images/2.jpg)


### Adding dials

For the dials, we need to write a simple function that creates rectangles based on the parameters of the function. We will use this function twice: to create 12 and 24 dials.

Try yourself: [Sketch](http://sketch.paperjs.org/#V/0.12.15/S/jVNNT8MwDP0rUS+0LOq67gNR4DTgjODAodshy7I1apZMSdgkqv134nRl7ZgAS60TPzux32urQJINC7LgrWSWFgEOqFrCfkc0okJJZtADSkczPZMQInItmIsMJ0m/hhvEWK1K9s6XtoAKCMOzUhqFgHMXTe6cuz+e69a9XlQhZ5AIHvKYEHxr4A7J9uiF2CJ+qkNh1eSBGf7JMpRPJhgNhzdz3MF8L1MllM7Q1UIQWl5dSPDNZu1NJ2mrDLdcyQztONvHlEnLNOqh/HaEUXK68RA1q8YfZ4i1ssSysCbtGnHcPslXHb55+pAULkNUM1fzyIkwYU0U9rNGVZulyzo06JIbSyRlz1ptpnXbTpLBuMn5U5Q2DZCnGbVtRV7d3rfQ1eSkC7zxObTiQvwiClhNjdPVEwWnxHsQpp8eufOhgvF1YfupE+PnqN1P4SQOGMzxD1V8YUeetirpyFWNMcpTPEjm0Tk8cK3mYw+532nhkHKruLQmyPL54Qs=)

```
var clones = 24
var angle = 360/clones
var strokeWidth = 2

for (var i = 0; i < clones; i++){    
    var ellipse = new Path.Ellipse({
        size: [66, 337],
        strokeColor: 'black',
        strokeWidth: strokeWidth,
        position: view.center + [94, 0],
    })
    
    ellipse.rotate(angle * i, view.center)
}

function createDials(clones, size){
    var angle = 360/clones
    var distanceFromCenter = 215
    for (var i = 0; i < clones; i++){
        var rect = new Path.Rectangle({
            size: size,
            fillColor: 'black',
            center: [view.size.width/2, view.size.height/2 + distanceFromCenter],
        })
        rect.rotate(angle * i, view.center)
    }
}

createDials(24 * 5, [2,10])
createDials(12, [5,10])
```

In the right corner of the sketch, tap the "Save as SVG" button to open it in any vector editing tool.

![](images/3.jpg)