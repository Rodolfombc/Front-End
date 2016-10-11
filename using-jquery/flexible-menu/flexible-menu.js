
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
	$(".column-option:first").click();

});

$(".column-option").on("click", function()
{
	//unchecking all radio buttons
	$(".column-option").each(function( index ) 
	{
		//console.log( index + ": " + $( this ).val() );
		$(this).prop('checked', false); 
	});
	$(this).prop('checked', true); //checking the radio button the user chose
	
	//Cheking which case was chosen
	verifyOption($(this).val());	
	
	//console.log($(this).val());
});


$(".row-option").on("click", function()
{
	//unchecking all radio buttons
	$(".row-option").each(function( index ) 
	{
		//console.log( index + ": " + $( this ).val() );
		$(this).prop('checked', false); 
	});
	$(this).prop('checked', true); //checking the radio button the user chose
	
	//Cheking which case was chosen
	verifyOption($(this).val());	
	
	//console.log($(this).val());
});


function verifyOption(radioOption) 
{
	switch(radioOption)
	{
		case "1row":
			console.log("set 1 row");
			break;
		case "2rows":
			console.log("set 2 rows");
			break;
		case "3rows":
			console.log("set 3 rows");
			break;
		case "1column":
			console.log("set 1 column");
			break;
		case "2columns":
			console.log("set 2 columns");
			break;
		case "3columns":
			console.log("set 3 columns");
			break;
	}
}


function getWindowWidth()
{
	return Math.max(document.documentElement.clientWidth, window.innerWidth, window.outerHeight || 0);
}

function getWindowHeight()
{
	return Math.max(document.documentElement.clientHeight, window.innerHeight, window.outerHeight || 0);
}
