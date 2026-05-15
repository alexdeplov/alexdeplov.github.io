$(document).ready(function () {
    paper.setup($('#canvas').get(0))

    var group, path, scale, size, rotate, radius, fillColor, strokeColor, strokeWidth;
    var scaleSlider, radiusSlider, rotateSlider, fillColorInput, strokeColorInput, strokeWidthInput, rotateSliderNumberInput, fillColorHEXInput, strokeColorHEXInput, strokeWidthNumberInput, radiusSliderNumberInput, scaleSliderLabel;
    var pressets_default, pressets_small, pressets_medium, pressets_large, pressets_ios, pressets_android, downloadSVG, closeFollowMeButton;
    var canvas;

    size = 120
    rotate = 0

    group = new paper.Group()

    scaleSlider = document.getElementById("scaleSlider")
    scaleSliderLabel = document.getElementById("scaleSliderLabel")

    radiusSlider = document.getElementById("radiusSlider")
    rotateSlider = document.getElementById("rotateSlider")
    radiusSliderNumberInput = document.getElementById("radiusSliderNumberInput")
    fillColorInput = document.getElementById("fillColorInput")
    fillColorHEXInput = document.getElementById("fillColorHEXInput")
    strokeColorInput = document.getElementById("strokeColorInput")
    strokeColorHEXInput = document.getElementById("strokeColorHEXInput")
    strokeWidthInput = document.getElementById("strokeWidthInput")
    rotateSliderNumberInput = document.getElementById("rotateSliderNumberInput")
    strokeWidthNumberInput = document.getElementById("strokeWidthNumberInput")

    // pressets_default = document.getElementById("pressets_default")
    // pressets_small = document.getElementById("pressets_small")
    // pressets_medium = document.getElementById("pressets_medium")
    // pressets_large = document.getElementById("pressets_large")
    // pressets_ios = document.getElementById("pressets_ios")
    // pressets_android = document.getElementById("pressets_android")

    canvas = document.getElementById("canvas")

    downloadSVG = document.getElementById("downloadSVG")
    closeFollowMeButton = document.getElementById("closeFollowMeButton")

    // pressets_default.onclick = function (event) {
    //     setPressetSettings(250)
    // }

    // pressets_small.onclick = function (event) {
    //     setPressetSettings(40, "#BA1619", "#F1252B", 10)
    // }

    // pressets_medium.onclick = function (event) {
    //     setPressetSettings(100, "#EB4A26", "#FF7B7B", 15)
    // }

    // pressets_large.onclick = function (event) {
    //     setPressetSettings(160, "#EE7B30", "#FFBB50", 25)
    // }

    // pressets_ios.onclick = function (event) {
    //     setPressetSettings(120)
    // }

    // pressets_android.onclick = function (event) {
    //     setPressetSettings(96)
    // }



    radius = radiusSlider.value
    radiusSliderNumberInput.innerHTML = radiusSlider.value

    fillColor = fillColorInput.value
    fillColorHEXInput.value = fillColorInput.value.toUpperCase()

    function setPressetSettings(scale, fillColor, strokeColor, strokeWidth) {

        fillColor = fillColor ?? '#F0D906'
        strokeColor = strokeColor ?? '#5801F9'

        scaleSlider.value = scale
        scaleSliderLabel.innerHTML = scale + '%'
        scale = scale
        path.bounds.width = 100
        path.bounds.height = 100
        path.position = paper.view.center
        path.scaling = scale
        path.scaling = 1 / (120 / scale)
        rotate = 0
        rotateSlider.value = rotate
        path.rotation = rotate
        rotateSliderNumberInput.value = rotate



        fillColorHEXInput.value = fillColor
        fillColorInput.value = fillColor
        path.fillColor = fillColor



        path.strokeColor = strokeColor

        strokeWidth = strokeWidth
        path.strokeWidth = strokeWidth
        strokeWidthNumberInput.value = strokeWidth
        strokeWidthInput.value = strokeWidth

        if (group.children[0]) {
            group.children[0].remove()

            path = new paper.Path.Rectangle({
                center: paper.view.center,
                fillColor: fillColor ?? 'blue',
                strokeColor: strokeColor ?? 'blue',
                strokeWidth: strokeWidth ?? 0,
                size: size,
                parent: group
            })

            path.applyMatrix = false
            path.scaling = 1 / (size / scaleSlider.value)
            path.rotate(rotate)
            radius = 35
            roundCorners(path, radius)
            radiusSliderNumberInput.innerHTML = radius
        }

        canvas.style.backgroundColor = "transparent"

    }

    strokeColor = strokeColorInput.value
    strokeColorHEXInput.value = strokeColorInput.value
    strokeWidth = strokeWidthInput.value
    strokeWidthNumberInput.value = strokeWidthInput.value

    path = new paper.Path.Rectangle({
        center: paper.view.center,
        fillColor: fillColor ?? 'blue',
        strokeColor: strokeColor ?? 'blue',
        strokeWidth: strokeWidth ?? 0,
        size: size,
        parent: group
    })
    setGroupTocenter()
    roundCorners(path, radius)
    path.applyMatrix = false

    scale = scaleSlider.value
    path.scaling = 1 / (120 / scale)

    strokeWidthInput.oninput = function () {
        strokeWidth = this.value
        path.strokeWidth = strokeWidth
        strokeWidthNumberInput.value = strokeWidth
    }
    strokeWidthNumberInput.onchange = function () {
        strokeWidth = this.value
        path.strokeWidth = strokeWidth
        strokeWidthInput.value = strokeWidth
    }

    strokeColorInput.oninput = function () {
        strokeColor = this.value
        path.strokeColor = strokeColor
        strokeColorHEXInput.value = this.value.toUpperCase()
    }

    fillColorInput.oninput = function () {
        fillColor = this.value
        path.fillColor = fillColor
        fillColorHEXInput.value = this.value.toUpperCase()
        console.log(this.value)

        if (this.value === "#ffffff") {
            canvas.style.backgroundColor = 'rgba(240, 240, 235, 0.8)'
        } else {
            canvas.style.backgroundColor = "transparent"
        }
    }

    fillColorHEXInput.onpaste = function () {
        fillColor = this.value
        fillColorInput.value = fillColor
        path.fillColor = fillColor
    }
    fillColorHEXInput.oninput = function () {
        fillColor = this.value.toUpperCase()
        fillColorInput.value = fillColor
        path.fillColor = fillColor
    }

    rotateSlider.oninput = function () {
        rotate = this.value
        path.rotation = rotate
        rotateSliderNumberInput.value = rotate.toString()
    }
    rotateSliderNumberInput.onchange = function () {
        rotate = this.value
        rotateSlider.value = rotate
        path.rotation = rotate
    }

    scaleSlider.oninput = function () {
        path.applyMatrix = false
        path.scaling = 1 / (120 / this.value)
        scaleSliderLabel.innerHTML = this.value + "%"

    }

    radiusSlider.oninput = function () {
        if (group.children[0]) {
            group.children[0].remove()

            path = new paper.Path.Rectangle({
                center: paper.view.center,
                fillColor: fillColor ?? 'blue',
                strokeColor: strokeColor ?? 'blue',
                strokeWidth: strokeWidth ?? 0,
                size: size,
                parent: group
            })

            path.applyMatrix = false
            path.scaling = 1 / (size / scaleSlider.value)
            path.rotate(rotate)
            radius = this.value
            roundCorners(path, radius)
            radiusSliderNumberInput.innerHTML = radius
        }
    }

    function roundCorners(path, radius) {

        var segments = path.segments.slice(0);
        path.removeSegments();

        for (var i = 0, l = segments.length; i < l; i++) {
            var curPoint = segments[i].point;
            var nextPoint = segments[i + 1 == l ? 0 : i + 1].point;
            var prevPoint = segments[i - 1 < 0 ? segments.length - 1 : i - 1].point;
            var nextDelta = curPoint.subtract(nextPoint);
            var prevDelta = curPoint.subtract(prevPoint);

            nextDelta.length = radius;
            prevDelta.length = radius;

            path.add(
                new paper.Segment(
                    curPoint.subtract(prevDelta),
                    null,
                    prevDelta.divide(1.5)
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
        setGroupTocenter();
        return path;
    }

    paper.view.onResize = function (event) {
        setGroupTocenter()
    }

    function setGroupTocenter() {
        group.position = paper.view.center
    }

    downloadSVG.onclick = function (event) {
        var currentDate = new Date();
        var fileName = "squircle-svg.com - " + currentDate.toLocaleString() + ".svg"
        var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({ asString: true }));
        var link = document.createElement("a");
        link.download = fileName;
        link.href = url;
        link.click();
        showPopup();
    }

    closeFollowMeButton.onclick = function (event) {
        var popup = document.getElementById("followMe");
        popup.style.display = 'none';
    }

    function showPopup() {
        if (getCookie("followMe") == undefined) {
            var popup = document.getElementById("followMe");
            popup.style.display = 'block';
        }
        setCookie("followMe", 1, 7);
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

})


