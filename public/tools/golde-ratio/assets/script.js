$(document).ready(function () {

    // MAIN INPUT

    numberInput.oninput = function (event) {
        fillTableWithIncreasingNumbers(this.value)
        fillTableWithDecreasingNumbers(this.value)
    }

    var goldenRati0Formula = (1 + Math.sqrt(5)) / 2 - 1
    var increasingUL = document.getElementById("increasingUL")
    var decreasingUL = document.getElementById("decreasingUL")

    function fillTableWithIncreasingNumbers(value) {
        var array = [];
        var i = value
        var count = 1

        do {
            count += 1
            i = i / goldenRati0Formula
            array.push(i.toFixed(3))

        } while (count <= increasingUL.children.length)

        for (var i = 0; i < array.length; i++) {
            var li = increasingUL.children[i].children[0]
            li.innerHTML = array[i]
        }

    }

    function fillTableWithDecreasingNumbers(value) {
        var array = [];
        var i = value
        var count = 1

        do {
            count += 1

            i = i * goldenRati0Formula
            array.push(i.toFixed(3))

        } while (count <= decreasingUL.children.length)

        for (var i = 0; i < array.length; i++) {
            var li = decreasingUL.children[i].children[0]
            li.innerHTML = array[i]
        }
    }



    // MULTIPLY CANVAS SETUP

    var strokeColor = "#E15635"
    var strokeColorGoldenRatio = "#FFA692"
    var strokeWidth = 2

    var scope = new paper.PaperScope();
    var scope2 = new paper.PaperScope();
    var scope3 = new paper.PaperScope();
    var scope4 = new paper.PaperScope();

    var canvas_1 = document.getElementById('canvas_1');
    scope.setup(canvas_1)
    var canvas_2 = document.getElementById('canvas_2');
    scope2.setup(canvas_2)
    var canvas_3 = document.getElementById('canvas_3');
    scope3.setup(canvas_3)
    var canvas_4 = document.getElementById('canvas_4');
    scope4.setup(canvas_4)


    // LINEAR GRID CANVAS

    scope.activate();
    linesMaxValue = linesInput.max
    linesCurrentValue = linesInput.value
    var linesGridDescription = document.getElementById("linesCenter").getElementsByTagName("h3")[0].getElementsByTagName("span")[0]
    var linesGroup = new scope.Group()

    linesInput.oninput = function () {
        createLines(1, this.value)

        linesGridDescription.innerHTML = this.value
    }

    var linesWidth = 50
    var linesHeight = 12.985 / 1.618

    function createLines(linesStartValue, linesMaxValue) {
        linesGroup.removeChildren()

        var i = linesStartValue
        var count = 0

        do {
            count += 1
            i = i * 0.618

            var line = new scope.Path.Rectangle({
                size: [linesWidth, linesHeight],
                position: scope.center,
                strokeColor: strokeColor,
                strokeWidth: strokeWidth,
                parent: linesGroup,
                // opacity: 0.6,
            })

            if (count % 3 == 0) {
                line.strokeColor = strokeColorGoldenRatio
                line.sendToBack()
            }

            line.scale(i, 1)
            line.position.x = -i * linesWidth / 2

        } while (count < linesMaxValue)

        linesGroup.fitBounds(scope.view.bounds.scale(0.8))
    }

    createLines(1, linesCurrentValue)


    // DOWNLOAD LINES
    downloadLines.onclick = function () {
        var currentDate = new Date()
        var fileName = "golden-ratio-svg.com - " + currentDate.toLocaleString() + ".svg"
        var url = "data:image/svg+xml;utf8," + encodeURIComponent(scope.project.exportSVG({ asString: true }))
        var link = document.createElement("a")
        link.download = fileName
        link.href = url
        link.click()
    }


    // RADIAL GRID CANVAS
    scope2.activate();
    var group, currentValue, radialGridDescription;
    group = new scope2.Group()
    radialMaxValue = radialInput.max
    currentValue = radialInput.value
    radialGridDescription = document.getElementById("radialCenter").getElementsByTagName("h3")[0].getElementsByTagName("span")[0]
    radialGridDescription.innerHTML = radialInput.value

    radialInput.oninput = function () {
        createCircles(1, this.value)

        radialGridDescription.innerHTML = this.value
    }

    function createCircles(startValue, radialMaxValue) {
        group.removeChildren()
        var i = startValue
        var count = 1
        do {
            count += 1
            i = i * 0.618

            var circle = new scope2.Path.Circle({
                radius: i * (scope2.view.size.width),
                strokeColor: strokeColor,
                strokeWidth: strokeWidth,
                position: scope2.view.center,
                parent: group
            })

            if (count % 3 == 0) {
                circle.strokeColor = strokeColorGoldenRatio
            }

        } while (count <= radialMaxValue)
        group.position.y = scope2.view.center.y
        group.fitBounds(scope2.view.bounds.scale(0.85))
    }

    createCircles(1, currentValue)

    scope2.view.onResize = function (event) {
        group.position.x = scope2.view.center.x
    }


    // DOWNLOAD CIRCLES
    downloadCircles.onclick = function () {
        var currentDate = new Date()
        var fileName = "golden-ratio-svg.com - " + currentDate.toLocaleString() + ".svg"
        var url = "data:image/svg+xml;utf8," + encodeURIComponent(scope2.project.exportSVG({ asString: true }))
        var link = document.createElement("a")
        link.download = fileName
        link.href = url
        link.click()
    }


    // RECTS GRID CANVAS
    scope3.activate();
    var pathRect = scope3.project.importSVG(document.getElementById('rectanglesSVG'));
    var rectsGroup = new scope3.Group()
    pathRect.fitBounds(scope3.view.bounds.scale(0.8))
    pathRect.visible = false

    function createRects(amount) {
        rectsGroup.removeChildren()
        var maxAmount = pathRect.children.length

        for (var i = 1; i < amount; i++) {
            var rect = new scope3.Path.Rectangle({
                size: pathRect.children[i].bounds,
                strokeColor: strokeColor,
                strokeWidth: strokeWidth,
                position: pathRect.children[i].position,
                parent: rectsGroup
            })
        }

        for (var i = 0; i < rectsGroup.children.length; i++) {
            if (i % 2 == 0) {
                rectsGroup.children[i].strokeColor = strokeColorGoldenRatio
            }
        }

    }



    createRects(rectanglesInput.value)


    var rectanglesGridDescription = document.getElementById("rectanglesGoldenRatio").getElementsByTagName("h3")[0].getElementsByTagName("span")[0]
    rectanglesInput.oninput = function (event) {
        createRects(this.value)
        rectanglesGridDescription.innerHTML = this.value - 1
    }

    // DOWNLOAD CIRCLES
    downloadRectangles.onclick = function () {
        pathRect.remove()
        var currentDate = new Date()
        var fileName = "golden-ratio-svg.com - " + currentDate.toLocaleString() + ".svg"
        var url = "data:image/svg+xml;utf8," + encodeURIComponent(scope3.project.exportSVG({ asString: true }))
        var link = document.createElement("a")
        link.download = fileName
        link.href = url
        link.click()
    }


    // TRIANGLES GRID CANVAS

    scope4.activate();
    var pathTriangle = scope4.project.importSVG(document.getElementById('trianglesSVG'));
    var trianglesGroup = new scope4.Group()
    pathTriangle.fitBounds(scope4.view.bounds.scale(0.8))
    pathTriangle.visible = false


    function createTriangle(amount) {
        trianglesGroup.removeChildren()

        for (var i = 1; i < pathTriangle.children.length; i++) {

            if (i <= amount) {
                var triangle = new scope4.Path()
                triangle.strokeColor = strokeColor
                if (i % 2 == 0) {
                    triangle.strokeColor = strokeColorGoldenRatio
                }
                triangle.strokeWidth = strokeWidth
                triangle.add(pathTriangle.children[i].segments[0].point)
                triangle.add(pathTriangle.children[i].segments[1].point)
                triangle.add(pathTriangle.children[i].segments[2].point)
                triangle.closePath()
                triangle.strokeJoin = 'round'
                trianglesGroup.addChild(triangle)
            }


        }

        trianglesGroup.fitBounds(scope4.view.bounds.scale(0.8))

    }

    var trianglesGridDescription = document.getElementById("trianglesGoldenRatio").getElementsByTagName("h3")[0].getElementsByTagName("span")[0]
    trianglesInput.oninput = function () {
        createTriangle(this.value)
        trianglesGridDescription.innerHTML = this.value
    }

    createTriangle(trianglesInput.value)

    // DOWNLOAD TRIANGLES
    downloadTriangles.onclick = function () {
        pathTriangle.remove()
        var currentDate = new Date()
        var fileName = "golden-ratio-svg.com - " + currentDate.toLocaleString() + ".svg"
        var url = "data:image/svg+xml;utf8," + encodeURIComponent(scope4.project.exportSVG({ asString: true }))
        var link = document.createElement("a")
        link.download = fileName
        link.href = url
        link.click()
    }


    // COPY RESULT NUMBERS ON TAP
    var incListUL = document.getElementById("increasingUL")
    incListUL.addEventListener("click", copyLiValue, false)
    var decListUL = document.getElementById("decreasingUL")
    decListUL.addEventListener("click", copyLiValue, false)

    function copyLiValue(event) {
        event.preventDefault
        event.target.children[0].classList.remove("pulsingAnimation")
        event.target.children[1].classList.remove("pulsingAnimation")
        void event.target.children[0].offsetWidth;
        void event.target.children[1].offsetWidth;
        event.target.children[0].classList.add("pulsingAnimation")
        event.target.children[1].classList.add("pulsingAnimation")
        var liText = event.target.children[0].innerHTML
        navigator.clipboard.writeText(liText)
    }

})



