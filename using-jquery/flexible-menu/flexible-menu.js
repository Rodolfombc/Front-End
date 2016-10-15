
var transitionEvent;

//
//Method to detect the cross-browser event name of the "transition animation" property 
//
function whichTransitionEvent(){
    var t,
        el = document.createElement("fakeelement");

    var transitions = {
        "transition"      : "transitionend",
        "OTransition"     : "oTransitionEnd",
        "MozTransition"   : "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
    }

    for (t in transitions){
        if (el.style[t] !== undefined){
            return transitions[t];
        }
    }
}
//Getting the current transition animation event name
transitionEvent = whichTransitionEvent();

//
//Method to detect when the Document Object Model (DOM) is ready for JavaScript code to execute
//
$(document).ready(function() 
{
	//console.log(transitionEvent);
	
	console.log(getMenuAvailableHeight());
	console.log($(".row-header").css("height"));
	console.log($(".row-content").css("height"));
	
	console.log(getRowHeight());
	console.log(getMaxNumberOfRows());
	
	$(".row-option:first").click();
});

$(".row-option").on("click", function()
{
	//unchecking all radio buttons
	$(".row-option").each(function( index ) 
	{
		//console.log( index + ": " + $( this ).val() );
		$(this).prop('checked', false); 
	});
	//checking the radio button the user chose
	$(this).prop('checked', true); 
	
	//Set number of rows according to chosen case
	setRows($(this).val());	
	
	//console.log($(this).val());
});


function setRows(numRows) 
{
	switch(numRows)
	{
		case "1":
			console.log("set 1 row");
			break;
		case "2":
			console.log("set 2 rows");
			break;
		case "3":
			console.log("set 3 rows");
			break;
	}
}


function getMenuAvailableHeight()
{
	return parseInt($(".flexible-menu").css("height"));
}

function getRowHeight()
{
	var headerHeight = parseInt($(".row-header").css("height"));
	var contentHeight = parseInt($(".row-content").css("height"));
	var rowHeight = headerHeight + contentHeight;
	
	return rowHeight;
}

function getMaxNumberOfRows()
{
	var availableHeight = getMenuAvailableHeight();
	var rowHeight = getRowHeight();
	var maxNumber = Math.round(availableHeight/rowHeight);
	
	return maxNumber;
}

function getWindowWidth()
{
	return Math.max(document.documentElement.clientWidth, window.innerWidth, window.outerHeight || 0);
}

function getWindowHeight()
{
	return Math.max(document.documentElement.clientHeight, window.innerHeight, window.outerHeight || 0);
}
