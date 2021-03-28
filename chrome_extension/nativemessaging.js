var port = chrome.runtime.connectNative('nativemessaginghost');

port.onMessage.addListener(function(msg) 
    {
    console.log("Received" + msg);
    });

port.onDisconnect.addListener(function() 
    {
    console.log("Disconnected");
    });

port.postMessage({ text: "Hello, my_application" });