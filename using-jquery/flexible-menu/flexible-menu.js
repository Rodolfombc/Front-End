
//Selectors
var rowSelector = ".menu-row";
var rowHeaderSelector = ".row-header";
var rowContentSelector = ".row-content";
var flexibleMenuSelector = ".flexible-menu";
var rowOptionSelector = ".row-option";
var optionsSelector = ".options";


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
	
	setOptions();
	$(rowOptionSelector+":first").click();
});


/*
 * Detect when a menu's button is clicked
 */
$("body").on("click", rowOptionSelector, function() {
	
	//console.log($(this)[0].disabled);
	
	$(rowOptionSelector).each(function( index ) 
	{		
		//unchecking all radio buttons
		$(this).prop('checked', false); 
		//Enabling all readio buttons
		$(this)[0].disabled = false;
	});
	//checking the radio button the user chose
	$(this).prop('checked', true); 
	//Disabling the button the user chose
	$(this)[0].disabled = true;
	
	//Set number of rows according to chosen case
	setRows(parseInt($(this).val()));
});


/*
 * Detect when a row header is clicked
 */
$("body").on("click", rowHeaderSelector, function() {	
	
	//Accessing the row header respective row content
	var contentObj = $($(this).parent().children()[1]);
	//console.log(contentObj.css("height"));
	//console.log($(this).parent().children()[1]);
	
	reorganizeRows(contentObj);
});


/*
 * Create the radio buttons options containing all possible number of rows to add to the flexible-menu
 */
function setOptions()
{
	var numOptions = getMaxNumberOfRows();
	
	for(var i = 0; i < numOptions; i++)
	{		
		var htmlOption = '<input type="radio" class="row-option" value="'+(i+1)+'">'+(i+1);
					
		$(optionsSelector).append(htmlOption);
	}
}

/*
 * Add numRows rows to the flexible-menu. 
 */
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
							'<div class="row-content" style="height:'+getRowContentHeight()+'px"></div>'+
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
 * Reorganize the rows heights according to hidden/shown contents
 */
function reorganizeRows(contentObj)
{
	//console.log($(flexibleMenuSelector).children().length);
	//console.log(contentObj[0]===$(rowContentSelector+":last")[0]);
	
	var totalUsedHeight = 0;
	var fillUpHeight = 0;
	var numRows = $(rowSelector).length;
	$(rowSelector).each(function()
	{
		var $this = $(this);
		
		if(numRows > 1)
		{
			//Checking if the content to be hidden/shown is in the last row
			if(contentObj[0]===$(rowContentSelector+":last")[0])
			{
				//Checking if we will hide or show the content
				if(parseInt(contentObj.css("height")) > 0)
				{	
					//Hide the content
					contentObj.animate({
						height: '0px'
					});
				}
				else
				{	
					totalUsedHeight = (numRows-1)*getRowHeight()+getRowHeaderHeight();
					fillUpHeight = getMenuAvailableHeight() - totalUsedHeight;
					
					console.log(fillUpHeight);
				
					//Show the respective content
					contentObj.animate({
						height: fillUpHeight+'px'
					});
				}
			}
			else
			{				
				//console.log($this.children()[1]);
				//console.log($this.children()[1]===contentObj[0]);
				//console.log(numRows);
		
				//The last row have to fill up all of the available height
				if($this.index() > numRows-2)
				{
					//console.log("last row");
					
					totalUsedHeight += getRowHeaderHeight();
					
					var fillUpHeight = getMenuAvailableHeight() - totalUsedHeight;
					
					$(rowContentSelector+":last").animate({
						height: fillUpHeight+'px'
					});
				}
				else
				{									
					if($this.children()[1]===contentObj[0])
					{
						//Checking if we will hide or show the content
						if(parseInt(contentObj.css("height")) > 0)
						{	
							totalUsedHeight += getRowHeaderHeight();
							
							//Hide the content
							contentObj.animate({
								height: '0px'
							});
						}
						else
						{	
							totalUsedHeight += getRowHeight();
						
							//Show the respective content
							contentObj.animate({
								height: getRowContentHeight()+'px'
							});
						}
					}
					else
					{
						totalUsedHeight += getRowHeight();
					}
				}
			}
		}
		//The case where the content have to fill up all of the available height
		//because it is the only row shown
		else
		{
			//Checking if we will hide or show the content
			if(parseInt(contentObj.css("height")) > 0)
			{	
				//Hide the content
				contentObj.animate({
					height: '0px'
				});
			}
			else
			{	
				totalUsedHeight += getRowHeaderHeight();
				fillUpHeight = getMenuAvailableHeight() - totalUsedHeight;
			
				//Show the respective content
				contentObj.animate({
					height: fillUpHeight+'px'
				});
				
			}
		}
	});
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
	return 100;
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
