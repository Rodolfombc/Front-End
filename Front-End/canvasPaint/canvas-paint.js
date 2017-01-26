function CanvasPaint() {
    var paintObj = new Object();

    var canvas = null,
        ctx2d = null,
        isMouseDown = false,
        prevMouseX = 0,
        currMouseX = 0,
        prevMouseY = 0,
        currMouseY = 0;

    var brushColor = "black",
        brushLineWidth = 2;

    function init()
    {
        canvas = document.getElementById('canvasPaint');
        ctx2d = canvas.getContext("2d");
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;

    //-----------------------------------------------------------------------//
    //                    ADDING MOUSE DETECTION EVENTS
    //-----------------------------------------------------------------------//
        addEvent(canvas, "mousedown", canvasMouseDownHandler);
        addEvent(canvas, "mouseup", canvasMouseUpHandler);
        addEvent(canvas, "mousemove", canvasMouseMoveHandler);
        addEvent(canvas, "mouseout", canvasMouseOutHandler);
    }

    /**
     * Define the color of the brush
     * @param {jsColor} colorPicker - Colorpicker from jscolor library (http://jscolor.com/)
     */
    function setBrushColor(colorPicker) {
        brushColor = colorPicker.toHEXString();
    }

    function draw() {
        ctx2d.beginPath();
        ctx2d.moveTo(prevMouseX, prevMouseY);
        ctx2d.lineTo(currMouseX, currMouseY);
        ctx2d.strokeStyle = brushColor;
        ctx2d.lineWidth = brushLineWidth;
        ctx2d.stroke();
        ctx2d.closePath();
    }

    /**
     * Clears the whole canvas (all paintings)
     */
    function clearCanvas() {
        var m = confirm("Want to clear");
        if (m) {
            ctx2d.clearRect(0, 0, canvasWidth, canvasHeight);
        }
    }

    function canvasMouseDownHandler(event)
    {
        prevMouseX = currMouseX;
        prevMouseY = currMouseY;
        currMouseX = event.clientX - canvas.offsetLeft;
        currMouseY = event.clientY - canvas.offsetTop;

        isMouseDown = true;

        //Drawing the point in case when the user only clicks and doesn't move the mouse
        ctx2d.beginPath();
        ctx2d.fillStyle = brushColor;
        ctx2d.fillRect(currMouseX, currMouseY, brushLineWidth, brushLineWidth);
        ctx2d.closePath();
    }

    function canvasMouseUpHandler(event)
    {
        isMouseDown = false;
    }

    function canvasMouseMoveHandler(event)
    {
        if (isMouseDown) {
            prevMouseX = currMouseX;
            prevMouseY = currMouseY;
            currMouseX = event.clientX - canvas.offsetLeft;
            currMouseY = event.clientY - canvas.offsetTop;
            draw();
        }
    }

    function canvasMouseOutHandler(event)
    {
        isMouseDown = false;
    }

    function addEvent(elem,event,func)
    {
        if(elem.addEventListener) elem.addEventListener(event,func,false);
        else if(elem.attachEvent) elem.attachEvent("on"+event,func);
    }

    //*********************************************************//
    //Defining the functions that can be accessed from outside
    //*********************************************************//
    paintObj.init = init;
    paintObj.setBrushColor = setBrushColor;
    paintObj.clearCanvas = clearCanvas;

    return paintObj;
}
var canvasPaint = CanvasPaint();
