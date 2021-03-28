
//alert('background starting'); //initialize at start (script injection)

chrome.runtime.onMessage.addListener(onMessageEvent);

chrome.runtime.onMessageExternal.addListener(onMessageEvent);//for cross-extension messaging (means from webpage to background)

//--------------------------------------
// 2 IMPORTANT EVENTS
//  - onMessageEvent
//  - onMessageReceived
//--------------------------------------

function onMessageEvent(request, sender, sendResponse)
{
    var NATIVE_HOST_NAME = 'native.message.host';

    console.log('content_script: onMessageEvent starting: ' + NATIVE_HOST_NAME);

    //alert('starting');

    //alert("onMessageEvent:" + request.todo);
    // Send message to the host
    //if (request.todo == 'showPageAction')
	if (request.command == 'barcode-print')
    {
        //alert(sender.tab.id);
        //chrome.pageAction.hide(tabs[0].id);
        //chrome.tabs.query({ active:true, currentWindow:true}, function(tabs){ enableExtension(tabs); });

        //alert('request value:' + request.value);

        var port = chrome.runtime.connectNative(NATIVE_HOST_NAME);

        console.log('post to native host connection');

        //port.postMessage(request.value); // THIS IS WORKING FUNCTION
		
		port.postMessage({ command: request.command, data: request.value});//THIS IS TEST FUNCTION
		
        //port.postMessage("{\"text\":\"#STOP#\"}");
        //port.postMessage({text: "#STOP#"});
        
        //port.sendNativeMessage(request.value);

        port.onMessage.addListener(onMessageReceived);
    
        port.onDisconnect.addListener(onDisconnectOccur);
    }
}

function enableExtension(pTabs)
{
    //alert(pTabs[0].id);
    //chrome.pageAction.hide(pTabs[0].id);
}

function onMessageReceived(message)
{
    //alert('message received:' + JSON.stringify(message));
}

function onDisconnectOccur(error)
{
    //alert('connection closed');

    //console.log to write on browser log
}

