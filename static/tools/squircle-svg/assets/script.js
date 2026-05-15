$(document).ready(function () {
    paper.setup($('#canvas').get(0))

    var path;

    var fillColor, size, rotate, scale, cornerRadius, strokeWidth, strokeColor;

    fillColor = '#F0D906'
    size = 120
    rotate = 0
    scale = 250
    cornerRadius = 35
    strokeWidth = 0
    strokeColor = '#5801F9'

    function syncCanvasSliders() {
        if (!cnvScale) return
        cnvScale.value = scale
        cnvScaleLbl.textContent = scale + 'px'
        cnvCorner.value = cornerRadius
        cnvCornerLbl.textContent = cornerRadius
        cnvRotate.value = rotate
        cnvRotateLbl.textContent = rotate + '°'
        cnvStroke.value = strokeWidth
        cnvStrokeLbl.textContent = strokeWidth
    }

    function createPath() {

        if (path) {
            path.remove()
        }

        path = new paper.Path.Rectangle({
            center: paper.view.center,
            fillColor: fillColor,
            strokeColor: strokeColor,
            strokeWidth: strokeWidth,
            size: size
        })
        path.applyMatrix = false
        path.rotation = rotate
        path.scaling = 1 / (120 / scale)
        roundCorners(path, cornerRadius)

        syncCanvasSliders()

    }

    function roundCorners(path, radius) {

        var segments = path.segments.slice(0);
        path.removeSegments();

        for (var i = 0; i < segments.length; i++) {
            var curPoint = segments[i].point;
            var nextPoint = segments[i + 1 == segments.length ? 0 : i + 1].point;
            var prevPoint = segments[i - 1 < 0 ? segments.length - 1 : i - 1].point;
            var nextDelta = curPoint.subtract(nextPoint);
            var prevDelta = curPoint.subtract(prevPoint);

            nextDelta.length = radius;
            prevDelta.length = radius;

            path.add(
                new paper.Segment(
                    curPoint.subtract(prevDelta),
                    null,
                    prevDelta.divide(1.5) // fixed curviture, old was 1.5
                )
            );

            path.add(
                new paper.Segment(
                    curPoint.subtract(nextDelta),
                    nextDelta.divide(1.5),
                    null
                )
            );
        }
        path.closed = true;
        return path;
    }

    createPath()

    scaleSliderInput.oninput = function () {
        scale = this.value
        createPath()
        scaleSliderLabel.innerHTML = scale + ' px'
    }

    cornerRadiusInput.oninput = function () {
        cornerRadius = this.value
        createPath()
        cornerRadiusNumberLabel.innerHTML = cornerRadius
    }

    rotateSliderInput.oninput = function () {
        rotate = this.value
        createPath()
        rotateSliderNumberInput.value = rotate
    }
    rotateSliderNumberInput.onchange = function () {
        rotate = this.value
        createPath()
        rotateSliderInput.value = rotate
    }
    rotateSliderNumberInput.oninput = function () {
        rotate = this.value
        createPath()
        rotateSliderInput.value = rotate
    }

    fillColorInput.oninput = function () {
        fillColor = this.value
        createPath()
        fillColorHEXInput.value = fillColor
        if (this.value === "#ffffff") {
            canvas.style.backgroundColor = 'rgba(240, 240, 235, 0.8)'
        } else {
            canvas.style.backgroundColor = "transparent"
        }
    }
    fillColorHEXInput.onchange = function () {
        fillColor = this.value
        createPath()
        fillColorInput.value = fillColor
    }
    fillColorHEXInput.oninput = function () {
        fillColor = this.value
        createPath()
        fillColorInput.value = fillColor
    }

    strokeColorInput.oninput = function () {
        strokeColor = this.value
        createPath()
        strokeColorHEXInput.value = strokeColor
    }
    strokeColorHEXInput.onchange = function () {
        strokeColor = this.value
        createPath()
        strokeColorInput.value = strokeColor
    }
    strokeColorHEXInput.oninput = function () {
        strokeColor = this.value
        createPath()
        strokeColorInput.value = strokeColor
    }

    strokeWidthInput.oninput = function () {
        strokeWidth = this.value
        createPath()
        strokeWidthNumberInput.value = strokeWidth
    }
    strokeWidthNumberInput.oninput = function () {
        if (this.value <= 60) {
            strokeWidth = this.value
            createPath()
            strokeWidthInput.value = strokeWidth
        }
    }


    // CANVAS CONTROLS TOGGLE
    var cnvScale = document.getElementById('cnv-scale')
    var cnvCorner = document.getElementById('cnv-corner')
    var cnvRotate = document.getElementById('cnv-rotate')
    var cnvStroke = document.getElementById('cnv-stroke')
    var cnvScaleLbl = document.getElementById('cnv-scale-lbl')
    var cnvCornerLbl = document.getElementById('cnv-corner-lbl')
    var cnvRotateLbl = document.getElementById('cnv-rotate-lbl')
    var cnvStrokeLbl = document.getElementById('cnv-stroke-lbl')
    cnvScale.oninput = function () {
        scale = this.value
        createPath()
        scaleSliderInput.value = scale
        scaleSliderLabel.innerHTML = scale + ' px'
    }

    cnvCorner.oninput = function () {
        cornerRadius = this.value
        createPath()
        cornerRadiusInput.value = cornerRadius
        cornerRadiusNumberLabel.innerHTML = cornerRadius
    }

    cnvRotate.oninput = function () {
        rotate = this.value
        createPath()
        rotateSliderInput.value = rotate
        rotateSliderNumberInput.value = rotate
    }

    cnvStroke.oninput = function () {
        strokeWidth = this.value
        createPath()
        strokeWidthInput.value = strokeWidth
        strokeWidthNumberInput.value = strokeWidth
    }

    // PRESSETS
    pressets_default.onclick = function () {
        fillColor = '#F0D906'
        size = 120
        rotate = 0
        scale = 250
        cornerRadius = 35
        strokeWidth = 0
        strokeColor = '#5801F9'

        scaleSliderInput.value = scale
        scaleSliderLabel.innerHTML = scale + ' px'

        cornerRadiusInput.value = cornerRadius
        cornerRadiusNumberLabel.innerHTML = cornerRadius

        rotateSliderInput.value = rotate
        rotateSliderNumberInput.value = rotate

        fillColorInput.value = fillColor
        fillColorHEXInput.value = fillColor

        strokeColorInput.value = strokeColor
        strokeColorHEXInput.value = strokeColor

        strokeWidthInput.value = strokeWidth
        strokeWidthNumberInput.value = strokeWidth

        createPath()
    }

    pressets_ios.onclick = function () {
        fillColor = '#3E88ED'
        size = 120
        rotate = 0
        scale = 120
        cornerRadius = 26.7
        strokeWidth = 0
        strokeColor = '#203C9F'

        scaleSliderInput.value = scale
        scaleSliderLabel.innerHTML = scale + ' px'

        cornerRadiusInput.value = cornerRadius
        cornerRadiusNumberLabel.innerHTML = cornerRadius

        rotateSliderInput.value = rotate
        rotateSliderNumberInput.value = rotate

        fillColorInput.value = fillColor
        fillColorHEXInput.value = fillColor

        strokeColorInput.value = strokeColor
        strokeColorHEXInput.value = strokeColor

        strokeWidthInput.value = strokeWidth
        strokeWidthNumberInput.value = strokeWidth

        createPath()
    }

    pressets_android.onclick = function () {
        fillColor = '#A4C639'
        size = 120
        rotate = 0
        scale = 94
        cornerRadius = 35
        strokeWidth = 0
        strokeColor = '#036C4E'

        scaleSliderInput.value = scale
        scaleSliderLabel.innerHTML = scale + ' px'

        cornerRadiusInput.value = cornerRadius
        cornerRadiusNumberLabel.innerHTML = cornerRadius

        rotateSliderInput.value = rotate
        rotateSliderNumberInput.value = rotate

        fillColorInput.value = fillColor
        fillColorHEXInput.value = fillColor

        strokeColorInput.value = strokeColor
        strokeColorHEXInput.value = strokeColor

        strokeWidthInput.value = strokeWidth
        strokeWidthNumberInput.value = strokeWidth

        createPath()
    }

    pressets_macmini.onclick = function () {
        fillColor = '#6C6E78'
        size = 120
        rotate = 0
        scale = 250
        cornerRadius = 22
        strokeWidth = 3
        strokeColor = '#4C4E54'

        scaleSliderInput.value = scale
        scaleSliderLabel.innerHTML = scale + ' px'

        cornerRadiusInput.value = cornerRadius
        cornerRadiusNumberLabel.innerHTML = cornerRadius

        rotateSliderInput.value = rotate
        rotateSliderNumberInput.value = rotate

        fillColorInput.value = fillColor
        fillColorHEXInput.value = fillColor

        strokeColorInput.value = strokeColor
        strokeColorHEXInput.value = strokeColor

        strokeWidthInput.value = strokeWidth
        strokeWidthNumberInput.value = strokeWidth

        createPath()
    }

    pressets_clubhouse.onclick = function () {
        fillColor = '#F3EEE5'
        size = 120
        rotate = 0
        scale = 125
        cornerRadius = 58
        strokeWidth = 7
        strokeColor = '#FE6F2C'

        scaleSliderInput.value = scale
        scaleSliderLabel.innerHTML = scale + ' px'

        cornerRadiusInput.value = cornerRadius
        cornerRadiusNumberLabel.innerHTML = cornerRadius

        rotateSliderInput.value = rotate
        rotateSliderNumberInput.value = rotate

        fillColorInput.value = fillColor
        fillColorHEXInput.value = fillColor

        strokeColorInput.value = strokeColor
        strokeColorHEXInput.value = strokeColor

        strokeWidthInput.value = strokeWidth
        strokeWidthNumberInput.value = strokeWidth

        createPath()
    }

    // < li id = "pressets_default" class="pressetsButton" > Default</li >
    //                 <li id="pressets_ios" class="pressetsButton">iOS app icon</li>
    //                 <li id="pressets_android" class="pressetsButton">Android</li>
    //                 <li id="pressets_macmini" class="pressetsButton">Mac mini</li>
    //                 <li id="pressets_clubhouse" class="pressetsButton">Clubhouse avatar</li>

    // pressets_small.onclick = function () {
    //     fillColor = 'red'
    //     size = 120
    //     rotate = 0
    //     scale = 100
    //     cornerRadius = 25
    //     strokeWidth = 0
    //     strokeColor = 'red'
    //     createPath()
    // }

    // DOWNLOAD
    downloadSVG.onclick = function () {
        var currentDate = new Date()

        if (strokeWidth == 0) {
            path.strokeColor = null
        }
        var fileName = "squircle-svg.com - " + currentDate.toLocaleString() + ".svg"
        var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({ asString: true }))
        var link = document.createElement("a")
        link.download = fileName
        link.href = url
        link.click()
        showPopup()
    }
    function showPopup() {
        if (getCookie("followMe") == undefined) {
            var popup = document.getElementById("followMe");
            popup.style.display = 'block';
        }
        setCookie("followMe", 1, 7);
    }
    closeFollowMeButton.onclick = function (event) {
        var popup = document.getElementById("followMe");
        popup.style.display = 'none';
    }
    function setCookie(name, value, days) {
        var d = new Date;
        d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
        document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
    }
    function getCookie(name) {
        var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    }

    paper.view.onResize = function (event) {
        setPathTocenter()
    }

    function setPathTocenter() {
        path.position = paper.view.center
    }

})


