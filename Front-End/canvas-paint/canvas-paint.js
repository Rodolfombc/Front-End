function CanvasPaint() {
    var paintObj = new Object();

    var canvasParent = null,
        canvas = null,
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
        //Element which will hold the canvas and its menu
        canvasParent = document.getElementById('canvasPaint');
        console.log(canvasParent.clientWidth);

        //Menu element
        menu = document.createElement("DIV");
        menu.className = "menu";
        canvasParent.appendChild(menu);
        createAllMenuButtons();

        //Creating and adding the canvas element to the DOM
        canvas = document.createElement("CANVAS");
        canvasParent.appendChild(canvas);
        //Setting canvas context
        updateCanvasContext();

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
        var canvasStyle = window.getComputedStyle(canvas);
        setCanvasDimensions(canvasStyle.getPropertyValue("width"),
                            canvasStyle.getPropertyValue("height"));
        canvasContext = canvas.getContext("2d");
    }

    /**
     * Returns current width and height of the canvas
     */
    function getCanvasDimensions()
    {
        var canvasStyle = window.getComputedStyle(canvas);
        var dimensions = [canvasStyle.getPropertyValue("width"),
                          canvasStyle.getPropertyValue("height")];
        return dimensions;
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
    /**
     * Creates and styles the buttons that will be inside the menu
     */
    function createAllMenuButtons()
    {
        //Button responsible for setting the brush mode
        createMenuButton("Brush tool", "brush", setBrushMode);

        //Button responsible for setting the eraser mode
        createMenuButton("Eraser tool", "eraser", setEraserMode);

        //Button responsible for clearing the whole canvas
        createMenuButton("Clear canvas", "clear", clearCanvas);

        //Button responsible for setting the color of the brush
        createMenuButton("Choose brush color", "color", setBrushColor);

        //Button responsible for setting the size of the brush
        createMenuButton("Brush size", "size", setBrushSize);
    }

    /**
     * Creates a button for the canvas menu
     */
    function createMenuButton(tooltip, role, fn)
    {
        //Button element
        var button = document.createElement("DIV");
        button.className = "menuButton";
        button.title = tooltip;

        if(role==="size")
        {
            button.innerHTML = "<p>"+brushLineWidth+"px</p>";
        }
        else
        {
            var imgSrc = 'img/'+role+'-icon.png';
            button.innerHTML = "<img src="+imgSrc+" alt='The Image' />";
        }

        //Adding a particular behavior when the button is clicked
        addEvent(button.firstChild, "mousedown", fn);

        //Appending the button element to the menu
        menu.appendChild(button);
    }

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
            canvasParent.appendChild(modal);

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
     * Define the color of the brush
     */
    function setBrushColor()
    {
        brushColor = this.value;
    }

    /**
     * Define the size of the brush
     */
    function setBrushSize()
    {
        //Reference for the button that calls this function
        var menuButton = this;

        console.log(this.innerHTML);

        //Checking if the sliderElem already exists on DOM
        var sliderElem = document.getElementById("brushSizeSlider");
        if(sliderElem)
        {
            sliderElem.style.display = "block";
        }
        else
        {
            //Left = Menu's left position + menu's width
            var sliderDivLeft = this.parentNode.parentNode.offsetLeft + parseInt(window.getComputedStyle(this.parentNode.parentNode).width);
            //Top = Menu button's top + 1/4 height of menu button's height
            var sliderDivTop = this.parentNode.offsetTop+8;

            //Creating the div that will contain the slider
            var sizeSlider = document.createElement("DIV");
            sizeSlider.id = "brushSizeSlider";
            sizeSlider.style.width = "100px";
            sizeSlider.style.height = "20px";
            sizeSlider.style.backgroundColor = window.getComputedStyle(this.parentNode.parentNode).backgroundColor;
            sizeSlider.style.position = "absolute";
            sizeSlider.style.left = sliderDivLeft+"px";
            sizeSlider.style.top = sliderDivTop+"px";
            sizeSlider.style.borderRadius = "10px";

            var mouseDown = false;
            addEvent(sizeSlider, "mousedown", function(evt) {
                mouseDown = true;

                //sliderValue = mouse X position - sliderDiv left position
                var sliderValue = evt.clientX - parseInt(sizeSlider.style.left);

                //Updating the brush size and the menu button's text
                brushLineWidth = sliderValue;
                menuButton.innerHTML = brushLineWidth+"px";
            });

            addEvent(sizeSlider, "mouseup", function(evt) {
                mouseDown = false;
            });

            addEvent(sizeSlider, "mouseout", function(evt) {
                mouseDown = false;
                sizeSlider.style.display = "none";
            });

            addEvent(sizeSlider, "mousemove", function(evt) {
                if(mouseDown)
                {
                    //sliderValue = mouse X position - sliderDiv left position
                    var sliderValue = evt.clientX - parseInt(sizeSlider.style.left);

                    //Updating the brush size and the menu button's text
                    brushLineWidth = sliderValue;
                    menuButton.innerHTML = brushLineWidth+"px";
                }
            });

            //Adding the slider div to the DOM
            this.parentNode.appendChild(sizeSlider);
        }
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
