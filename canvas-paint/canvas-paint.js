function CanvasPaint() {
    var paintObj = new Object();

    var canvas = null,
        canvasContext = null,
        isMouseDown = false,
        prevMouseX = 0,
        currMouseX = 0,
        prevMouseY = 0,
        currMouseY = 0;

    var brushColor = $("#colorPicker").val(),
        brushLineWidth = $(".brushSizeSlider").val();

    var menu;

    function init()
    {
        menu = $("#canvasMenu")[0];
        canvas = $("#canvasPaint")[0];
        updateCanvasContext();

        $("#brushToolButton").mousedown(function() {
            setBrushMode();
        });
        $("#eraserToolButton").mousedown(function() {
            setEraserMode();
        });
        $("#clearToolButton").mousedown(function() {
            clearCanvas();
        });
        $("#brushSizeButton p").mousedown(function() {
            toggleRangeSlider();
        });
        $("#colorPicker").change(function(){
            brushColor = $(this).val();
        });
        $(".brushSizeSlider").change(function(){
            brushLineWidth = $(this).val();
            $("#brushSizeButton p").html($(this).val()+"px");
        });

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
            updateCanvasContext();
            // //Saving current canvas drawings
            // var oldImageData = canvasContext.getImageData(0, 0, canvasWidth, canvasHeight);
            //
            // //Saving old width and height for Redrawing
            // var oldWidth = canvasWidth;
            // var oldHeight = canvasHeight;
            //
            // //Setting the new width and height for the canvas element
            // canvas = document.getElementById('canvasPaint');
            // canvasWidth = canvas.getBoundingClientRect().width;
            // canvasHeight = canvas.getBoundingClientRect().height;
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

    function draw()
    {
        //Line properties
        canvasContext.strokeStyle = brushColor;
        canvasContext.lineJoin = "round";
        canvasContext.lineWidth = brushLineWidth;

        //Line drawing
        canvasContext.beginPath();
        canvasContext.moveTo(prevMouseX, prevMouseY);
        canvasContext.lineTo(currMouseX, currMouseY);
        canvasContext.closePath();
        canvasContext.stroke();
    }

    /**
     * Updates the context of the canvas (needed when the canvas is resized)
     */
    function updateCanvasContext()
    {
        setCanvasDimensions($("#canvasPaint").outerWidth(),
                            $("#canvasPaint").outerHeight());
        canvasContext = canvas.getContext("2d");
    }

    function getCanvasDimensions()
    {
        return [$("#canvasPaint").outerWidth(), $("#canvasPaint").outerHeight()];
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

    function canvasMouseDownHandler(event)
    {
        prevMouseX = currMouseX;
        prevMouseY = currMouseY;
        currMouseX = event.clientX - canvas.offsetLeft;
        currMouseY = event.clientY - canvas.offsetTop;

        isMouseDown = true;

        //Drawing the point in case when the user only clicks and doesn't move the mouse
        canvasContext.strokeStyle = brushColor;
        canvasContext.lineJoin = "round";
        canvasContext.lineWidth = brushLineWidth;
        canvasContext.beginPath();
        canvasContext.moveTo(currMouseX-0.1, currMouseY-0.1);
        canvasContext.lineTo(currMouseX, currMouseY);
        canvasContext.closePath();
        canvasContext.stroke();
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
    function createModal(titleText, bodyText, customFn)
    {
        var modalElem = document.getElementById("customModal");
        if(modalElem) modalElem.style.display = "block";
        else
        {
            //Parent div that will hold the modal
            var modal = document.createElement("DIV");
            modal.id="customModal"

            //Modal content (holds modal header and body)
            var modalContent = document.createElement("DIV");
            modalContent.className = "modal-content";

            //Modal header and its text
            var modalHeader = document.createElement("DIV");
            modalHeader.className = "modal-header";
            var headerText = document.createElement("H2");
            headerText.innerHTML = titleText;
            modalHeader.appendChild(headerText);

            //Modal body and its text and buttons
            var modalBody = document.createElement("DIV");
            modalBody.className = "modal-body";
            modalBody.innerHTML = bodyText;
            var yesButton = document.createElement("BUTTON");
            yesButton.innerHTML = "Yes";
            var noButton = document.createElement("BUTTON");
            noButton.innerHTML = "No";
            //Adding the buttons to the modal body
            modalBody.appendChild(yesButton);
            modalBody.appendChild(noButton);

            //Buttons functionalities
            addEvent(yesButton, "mousedown", customFn);
            addEvent(yesButton, "mousedown", function() {
                modal.style.display = "none";
            });
            addEvent(noButton, "mousedown", function() {
                modal.style.display = "none";
            });

            //Connecting the modal parts
            modalContent.appendChild(modalHeader);
            modalContent.appendChild(modalBody);
            modal.appendChild(modalContent);

            //Adding the complete modal to the canvas parent dom element
            $(".fullHeightContainer").append(modal);

            //Showing the modal
            modal.style.display = "block";
        }
    }

    /**
     * Clears the whole canvas (all paintings)
     */
    function clearCanvas()
    {
        var func = function() {
            var dimensions = getCanvasDimensions();
            canvasContext.clearRect(0, 0, parseFloat(dimensions[0]), parseFloat(dimensions[1]));
        }

        createModal("Clear Canvas", "Do you want to clear the canvas?", func);
    }

    /**
     * Define the size of the brush
     */
    function toggleRangeSlider()
    {
        $(".brushSizeSlider").toggle();
    }

    /**
     * Defines the paint mode as a brush mode
     */
    function setBrushMode()
    {
        canvasContext.globalCompositeOperation = "source-over";
    }

    /**
     * Defines the paint mode as an eraser mode
     */
    function setEraserMode()
    {
        canvasContext.globalCompositeOperation = "destination-out";
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

    return paintObj;
}

var canvasPaint = CanvasPaint();
window.onload = function() {
    canvasPaint.init();
};
