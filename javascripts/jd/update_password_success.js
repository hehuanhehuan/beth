var init = new Init();
messageListener();
setTimeout(function(){
    console.log('updatePasswordSuccess');
    init.updatePasswordSuccess(function(){
        var success = true ;
        if(success){
            updateSuccess();
        }else{

        }
    });
},3000);

function updateSuccess(){
    console.log('updateSuccess');
    init.sendMessage('password');
}

function messageListener(){
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
        if(message.cmd === 'password'){
            window.location.href = 'http://order.jd.com/center/list.action';
        }
    });
}
