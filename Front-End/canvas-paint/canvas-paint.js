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

    var menu;

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
    //                ADDING MOUSE DETECTION EVENTS FOR THE CANVAS
    //***************************************************************************//
        addEvent(canvas, "mousedown", canvasMouseDownHandler);
        addEvent(canvas, "mouseup",   canvasMouseUpHandler);
        addEvent(canvas, "mousemove", canvasMouseMoveHandler);
        addEvent(canvas, "mouseout",  canvasMouseOutHandler);

    //***************************************************************************//
    //               ADDING RESIZE DETECTION EVENT FOR THE WINDOW
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

        //Button that shows/hides the menu options
        menu = document.createElement("DIV");
        menu.className = "menu menuMinimized";
        menu.style.position = "absolute";
        menu.style.left = "10px";
        menu.style.top = "10px";
        canvasParent.appendChild(menu);

        createMinimizedMenu();
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

    function canvasMouseMoveHandler(event)
    {
        //Setting mouse cursor for draw mode
        canvas.style.cursor = "crosshair";

        if (isMouseDown) {
            prevMouseX = currMouseX;
            prevMouseY = currMouseY;
            currMouseX = event.clientX - canvas.offsetLeft;
            currMouseY = event.clientY - canvas.offsetTop;
            draw();
        }
    }

    function canvasMouseUpHandler(event){   isMouseDown = false;    }
    function canvasMouseOutHandler(event){   isMouseDown = false;   }

    //***************************************************************************//
    //                          MENU RELATED FUNCTIONS
    //***************************************************************************//

    /**
     * Removes all menu children DOM elements
     */
    function clearMenuDOM()
    {
        while(menu.firstChild) {
            menu.removeChild(menu.firstChild);
        }
    }

    /**
     * Creates the buttons that will be inside the minimized menu
     */
    function createMinimizedMenu()
    {
        //Button to maximize menu
        var maximizeMenuButton = document.createElement("DIV");
        maximizeMenuButton.className = "minimizedMenuButton";
        maximizeMenuButton.innerHTML = "Menu";
        menu.appendChild(maximizeMenuButton);
        addEvent(maximizeMenuButton, "mousedown", maximizeMenu);
    }

    /**
     * Creates the buttons that will be inside the maximized menu
     */
    function createMaximizedMenu()
    {
        //Button to minimize menu
        var minimizeMenuButton = document.createElement("DIV");
        minimizeMenuButton.className = "maximizedMenuButton";
        minimizeMenuButton.innerHTML = "Min";
        menu.appendChild(minimizeMenuButton);
        addEvent(minimizeMenuButton, "mousedown", minimizeMenu);

        //Button responsible for setting the color of the brush
        var colorPickerMenuButton = document.createElement("DIV");
        colorPickerMenuButton.className = "maximizedMenuButton";
    }

    function maximizeMenu(event)
    {
        clearMenuDOM();

        menu.className = "menu menuMaximized";

        createMaximizedMenu();
    }

    function minimizeMenu(event)
    {
        clearMenuDOM();

        menu.className = "menu menuMinimized";

        createMinimizedMenu();
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
