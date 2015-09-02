var init = new Init();
var task = null;
var settings = null;
var reset = null;
messageListener();
setTimeout(function(){
    init.watchDog();
    init.sendMessage('settings');
},3000);

function messageListener(){
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
        if(message.cmd === 'task'){
            task = message.task;
            console.log(task);
            init.sendMessage('reset');
        }
        if(message.cmd === 'settings'){
            settings = message.settings;
            console.log(settings);
            if(settings.running){
                init.sendMessage('task');
            }
        }
        if(message.cmd === 'reset'){
            reset = message.reset;
            console.log(reset);
            if(reset.account_id == task.account_id){
                console.log('reset.account_id == task.account_id');
                if(reset.password != task.password){
                    console.log('reset.password != task.password');
                    console.log('password');
                    init.safeCenter('password');
                }else{
                    console.log('reset.password == task.password');
                    if(reset.pay_password != task.pay_password){
                        console.log('reset.pay_password != task.pay_password');
                        console.log('pay_password');
                        init.safeCenter('pay_password');
                    }else{
                        init.sendMessage('task_done');
                    }
                }
            }else{

            }
        }
    });
}
