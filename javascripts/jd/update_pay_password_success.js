var init = new Init();
messageListener();
setTimeout(function(){
    console.log('updatePayPasswordSuccess');
    init.updatePayPasswordSuccess(function(){
        var success = true ;
        if(success){
            updateSuccess();
        }else{

        }
    });
},3000);

function updateSuccess(){
    console.log('updateSuccess');
    init.sendMessage('cookies');
}

function messageListener(){
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
        if(message.cmd === 'cookies'){
            init.sendMessage('pay_password');
        }
    });
}