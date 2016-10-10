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
var transitionEvent = whichTransitionEvent();

//
//Method to detect when the Document Object Model (DOM) is ready for JavaScript code to execute
//
$(document).ready(function() 
{
	
});

function getWindowWidth()
{
	return Math.max(document.documentElement.clientWidth, window.innerWidth, window.outerHeight || 0);
}

function getWindowHeight()
{
	return Math.max(document.documentElement.clientHeight, window.innerHeight, window.outerHeight || 0);
}
