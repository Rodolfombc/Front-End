
//Selectors
var rowHeaderSelector = ".row-header";
var rowContentSelector = ".row-content";
var flexibleMenuSelector = ".flexible-menu";

var rowOptionSelector = ".row-option";

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
	
	$(".row-option:first").click();
});

$(rowOptionSelector).on("click", function()
{
	//unchecking all radio buttons
	$(rowOptionSelector).each(function( index ) 
	{
		//console.log( index + ": " + $( this ).val() );
		$(this).prop('checked', false); 
	});
	//checking the radio button the user chose
	$(this).prop('checked', true); 
	
	//Set number of rows according to chosen case
	setRows(parseInt($(this).val()));	
	
	//console.log($(this).val());
});


function setRows(numRows) 
{	
	//Removing all children (rows) from flexible-menu
	$(flexibleMenuSelector).empty();
	
	var totalUsedHeight = 0;
	for(var i = 0; i < numRows; i++)
	{		
		if(numRows>1)
		{
			//The last row we apply a different height for the content section
			//to fill the rest of the menu available height
			if(i>numRows-2)
			{
				//console.log("last row");
				totalUsedHeight += getRowHeaderHeight();
				
				var fillUpHeight = getMenuAvailableHeight() - totalUsedHeight;
				
				var htmlRow = '<div class="menu-row">'+
							'<div class="row-header">Row '+(i+1)+'</div>'+
							'<div class="row-content" style="height:'+fillUpHeight+'px"></div>'+
							'</div>';
				
				$(flexibleMenuSelector).append(htmlRow);
			}
			else
			{
				var htmlRow = '<div class="menu-row">'+
							'<div class="row-header">Row '+(i+1)+'</div>'+
							'<div class="row-content"></div>'+
							'</div>';
							
				$(flexibleMenuSelector).append(htmlRow);
				
				totalUsedHeight += getRowHeight();
			}
		}
		//The case where the only row need to have its content fill up all of the available height
		else
		{
			totalUsedHeight += getRowHeaderHeight();
				
			var fillUpHeight = getMenuAvailableHeight() - totalUsedHeight;
			
			var htmlRow = '<div class="menu-row">'+
						'<div class="row-header">Row '+(i+1)+'</div>'+
						'<div class="row-content" style="height:'+fillUpHeight+'px"></div>'+
						'</div>';
			
			$(flexibleMenuSelector).append(htmlRow);
		}
	}
	
	
}

/*
 * Get flexible-menu height. (flexible-menu height is based on browser height)
 */
function getMenuAvailableHeight()
{
	return parseInt($(flexibleMenuSelector).css("height"));
}

/*
 * Get row header height
 */
function getRowHeaderHeight()
{	
	return 50;
}

/*
 * Get row content height
 */
function getRowContentHeight()
{	
	return 200;
}

/*
 * Get row height. (A row has a header section and a content section)
 */
function getRowHeight()
{
	var headerHeight = getRowHeaderHeight();
	var contentHeight = getRowContentHeight();
	var rowHeight = headerHeight + contentHeight;
	
	return rowHeight;
}

/*
 * Get the maximum number of rows that can fit into flexible-menu
 * according to its height
 */
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
