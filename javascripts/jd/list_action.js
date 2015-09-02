var init = new Init();
messageListener();
setTimeout(function(){
    init.sendMessage('cookies');
},3000);

function messageListener(){
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
        if(message.cmd === 'cookies'){
            init.listAction();
        }
    });
}
