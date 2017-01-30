function CanvasPaint() {
    var paintObj = new Object();

    var canvas = null,
        canvasContext = null,
        isMouseDown = false,
        prevMouseX = 0,
        currMouseX = 0,
        prevMouseY = 0,
        currMouseY = 0;

    var brushColor = "black",
        brushLineWidth = 2;

    function init()
    {
        //Getting the available width and height of the parent div to fit the canvas element into it
        var canvasParent = document.getElementById('canvasPaint');
        var canvasWidth = canvasParent.getBoundingClientRect().width;
        var canvasHeight = canvasParent.getBoundingClientRect().height;

        //Creating, configuring and adding the canvas element to the DOM
        canvas = document.createElement("CANVAS");
        setCanvasDimensions(canvasWidth,canvasHeight);
        canvasContext = canvas.getContext("2d");
        canvasParent.appendChild(canvas);

    //***************************************************************************//
    //                     ADDING MOUSE DETECTION EVENTS
    //***************************************************************************//
        addEvent(canvas, "mousedown", canvasMouseDownHandler);
        addEvent(canvas, "mouseup",   canvasMouseUpHandler);
        addEvent(canvas, "mousemove", canvasMouseMoveHandler);
        addEvent(canvas, "mouseout",  canvasMouseOutHandler);

    //***************************************************************************//
    //                     ADDING RESIZE DETECTION EVENT
    //***************************************************************************//
        window.onresize = function(event)
        {
            // //Saving current canvas drawings
            // var oldImageData = canvasContext.getImageData(0, 0, canvasWidth, canvasHeight);
            //
            // //Saving old width and height for Redrawing
            // var oldWidth = canvasWidth;
            // var oldHeight = canvasHeight;
            //
            // //Setting the new width and height for the canvas element
            // canvasParent = document.getElementById('canvasPaint');
            // canvasWidth = canvasParent.getBoundingClientRect().width;
            // canvasHeight = canvasParent.getBoundingClientRect().height;
            // setCanvasDimensions(canvasWidth,canvasHeight);
            //
            // //Scaling the canvas for the old drawings to stay with same aspect ratio
            // var scaleX = canvasWidth/oldWidth;
            // var scaleY = canvasHeight/oldHeight;
            // canvasContext.scale(scaleX, scaleY);
            //
            // //Redrawing old canvas drawings to new canvas
            // canvasContext.putImageData(oldImageData,0,0);
        };
    }

    /**
     * Define the color of the brush
     * @param {jsColor} colorPicker - Colorpicker from jscolor library (http://jscolor.com/)
     */
    function setBrushColor(colorPicker)
    {
        brushColor = colorPicker.toHEXString();
    }

    /**
     * Defines the new width and new height of the canvas
     * @param {Number} w - New width to be set for the canvas
     * @param {Number} h - New height to be set for the canvas
     */
    function setCanvasDimensions(w,h)
    {
        canvas.setAttribute('width', w);
        canvas.setAttribute('height', h);
    }

    function draw()
    {
        canvasContext.beginPath();
        canvasContext.moveTo(prevMouseX, prevMouseY);
        canvasContext.lineTo(currMouseX, currMouseY);
        canvasContext.strokeStyle = brushColor;
        canvasContext.lineWidth = brushLineWidth;
        canvasContext.stroke();
        canvasContext.closePath();
    }

    /**
     * Clears the whole canvas (all paintings)
     */
    function clearCanvas()
    {
        var m = confirm("Want to clear");
        if (m) {
            canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
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
        canvasContext.beginPath();
        canvasContext.fillStyle = brushColor;
        canvasContext.fillRect(currMouseX, currMouseY, brushLineWidth, brushLineWidth);
        canvasContext.closePath();
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

    //***************************************************************************//
    //            DEFINING FUNCTIONS THAT CAN BE ACCESSED FROM OUTSIDE
    //***************************************************************************//
    paintObj.init = init;
    paintObj.setBrushColor = setBrushColor;
    paintObj.clearCanvas = clearCanvas;

    return paintObj;
}

var canvasPaint = CanvasPaint();
window.onload = function() {
    canvasPaint.init();
};
