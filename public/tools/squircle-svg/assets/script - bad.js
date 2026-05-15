$(document).ready(function () {
    paper.setup($('#canvas').get(0))

    var path, group;

    var defaultFillColor = "#F0D906"
    var defaultStrokeColor = "#5801F9"
    var defaultstrokeWidth = 0
    var defaultScale = 250
    var defaultCornerRadius = 35
    var defaultSize = 120

    var fillColor, strokeColor, strokeWidth, scale, cornerRadius, size, rotate;

    group = new paper.Group()


    // CREATE

    function createSquircle() {
        path = new paper.Path.Rectangle({
            center: paper.view.center,
            fillColor: fillColor ?? defaultFillColor, //paper.Color.random(),  //defaultFillColor
            strokeColor: strokeColor ?? defaultStrokeColor,
            strokeWidth: strokeWidth ?? defaultstrokeWidth,
            size: size ?? defaultSize,
            name: "squircle",
            position: paper.view.center
        })

        path.applyMatrix = false
        path.rotate(rotate ?? 0)
        path.scaling = 1 / (120 / (scale ?? defaultScale))
        roundCorners(path, cornerRadius ?? defaultCornerRadius)
        group.addChild(path)

        setGroupTocenter()

        fillColor = path.fillColor
        strokeColor = path.strokeColor
        strokeWidth = path.strokeWidth
        scale = path.scaling
        cornerRadius = cornerRadius ?? defaultCornerRadius
    }

    createSquircle()

    // UPDATE
    var fillColorInput, fillColorHEXInput, strokeColorInput, strokeColorHEXInput, scaleSliderInput, scaleSliderLabel, rotateSliderInput, rotateSliderNumberInput, strokeWidthInput, strokeWidthNumberInput, downloadSVG, cornerRadiusInput, cornerRadiusNumberLabel;

    fillColorInput = document.getElementById("fillColorInput")
    fillColorHEXInput = document.getElementById("fillColorHEXInput")
    strokeColorInput = document.getElementById("strokeColorInput")
    strokeColorHEXInput = document.getElementById("strokeColorHEXInput")
    scaleSliderInput = document.getElementById("scaleSliderInput")
    scaleSliderLabel = document.getElementById("scaleSliderLabel")
    rotateSliderInput = document.getElementById("rotateSliderInput")
    rotateSliderNumberInput = document.getElementById("rotateSliderNumberInput")
    strokeWidthInput = document.getElementById("strokeWidthInput")
    strokeWidthNumberInput = document.getElementById("strokeWidthNumberInput")
    downloadSVG = document.getElementById("downloadSVG")
    cornerRadiusInput = document.getElementById("cornerRadiusInput")
    cornerRadiusNumberLabel = document.getElementById("cornerRadiusNumberLabel")


    // CONTROLS 
    fillColorInput.oninput = function () {
        fillColor = this.value

        path.fillColor = fillColor
        fillColorHEXInput.value = fillColor
    }
    strokeColorInput.oninput = function () {
        strokeColor = this.value

        path.strokeColor = strokeColor
        strokeColorHEXInput.value = strokeColor
    }
    scaleSliderInput.oninput = function () {

        var scaleValue = 1 / (120 / this.value)

        scale = scaleValue

        path.applyMatrix = false
        path.scaling = scale
        scaleSliderLabel.innerHTML = this.value + "%"

    }
    rotateSliderInput.oninput = function () {
        rotate = this.value

        path.rotation = rotate
        rotateSliderNumberInput.value = rotate.toString()
    }
    strokeWidthInput.oninput = function () {
        strokeWidth = this.value

        path.strokeWidth = strokeWidth
        strokeWidthNumberInput.value = strokeWidth
        strokeWidthInput.value = strokeWidth
    }
    cornerRadiusInput.oninput = function () {
        roundCorners(path, this.value)
        //group.addChild(path)
    }

    // CORNERS
    function roundCorners(path, radius) {

        if (group.children[0]) {
            group.children[0].remove()
            console.log(1)
            path = new paper.Path.Rectangle({
                center: paper.view.center,
                fillColor: fillColor ?? 'blue',
                strokeColor: strokeColor ?? 'blue',
                strokeWidth: strokeWidth ?? 0,
                size: size ?? [120, 120],
            })


            path.applyMatrix = false
            path.scaling = scale ?? defaultScale
            path.rotation = rotate
            group.addChild(path)

            cornerRadius = radius
            cornerRadiusInput.value = cornerRadius
            cornerRadiusNumberLabel.innerHTML = cornerRadius


        }

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

    // PRESSETS
    var pressets_default, pressets_small;

    pressets_default = document.getElementById("pressets_default")
    pressets_small = document.getElementById("pressets_small")

    pressets_default.onclick = function () {
        fillColor = '#FF0A0A'
        path.fillColor = fillColor
        fillColorInput.value = fillColor
        fillColorHEXInput.value = fillColor

        rotate = 45
        path.rotation = rotate
        rotateSliderInput.value = rotate
        rotateSliderNumberInput.value = rotate

        cornerRadius = 43
        cornerRadiusInput.value = cornerRadius
        roundCorners(path, cornerRadius)

    }
    pressets_small.onclick = function () {
        fillColor = '#10F9B7'
        path.fillColor = fillColor
        fillColorInput.value = fillColor
        fillColorHEXInput.value = fillColor

        rotate = 25
        path.rotation = rotate
        rotateSliderInput.value = rotate
        rotateSliderNumberInput.value = rotate
    }

    // POSITION TO CENTER
    paper.view.onResize = function (event) {
        setGroupTocenter()
    }

    function setGroupTocenter() {
        group.position = paper.view.center
    }

    // DOWNLOAD BUTTON
    downloadSVG.onclick = function (event) {
        var currentDate = new Date();
        console.log(path.strokeWidth)
        if (strokeWidth === 0) {
            path.strokeColor = null
        }
        var fileName = "squircle-svg.com - " + currentDate.toLocaleString() + ".svg"
        var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({ asString: true }));
        var link = document.createElement("a");
        link.download = fileName;
        link.href = url;
        link.click();
        showPopup();
    }


    // FOLLOW ME
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


