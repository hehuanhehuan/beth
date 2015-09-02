var init = new Init();
var task = null;
var settings = null;
var reset = null;
messageListener();
setTimeout(function(){
    init.updatePayPassword(function(){
        init.sendMessage('settings');
    });
},3000);

function checkPayPassword(){
    console.log('checkPayPassword');
    if(settings.running){
        var pay_pwd = $('#payPwd');
        if(pay_pwd.length > 0){
            setTimeout(function(){
                init.watchDog();
                $('#payPwd').val(task.pay_password);
                autoCode('checkPayPassword');
            },2000);
        }else{
            init.updatePayPassword(function(){
                init.sendMessage('settings');
            });
        }
    }
}

function updatePayPassword(){
    console.log('updatePayPassword');
    setTimeout(function(){
        init.watchDog();
        $('#payPwd').val(reset.pay_password);
        setTimeout(function(){
            init.watchDog();
            $('#rePayPwd').val(reset.pay_password);
            autoCode('updatePayPassword');
        },3000);
    },3000);
}

function autoCode(type){
    console.log('autoCode');
    var dama = new DaMa();
    var img = null;
    if(type == 'checkPayPassword'){
        img = $('#JD_Verification1').attr('src');
        dama.submit(img,function(cid,text){
            console.log(cid);
            console.log(text);
            $('#authCode').val(text);
            var submit = $('#payPwda');
            if(submit.length > 0){
                console.log('submit');
                submit[0].click();
            }else{
                setTimeout(function(){
                    window.location.reload(true);
                },3000);
            }
        },function(){
            setTimeout(function(){
                window.location.reload(true);
            },3000);
        });
    }else if(type == 'updatePayPassword'){
        img = $('#JD_Verification1').attr('src');
        dama.submit(img,function(cid,text){
            console.log(cid);
            console.log(text);
            $('#authCode').val(text);
            var submit = $('a.btn-5');
            if(submit.length > 0){
                console.log('submit');
                submit[0].click();
            }else{
                setTimeout(function(){
                    window.location.reload(true);
                },3000);
            }
        },function(){
            setTimeout(function(){
                window.location.reload(true);
            },3000);
        });
    }
}

function messageListener(){
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
        if(message.cmd === 'task'){
            task = message.task;
            console.log(task);
            checkPayPassword();
        }
        if(message.cmd === 'settings'){
            settings = message.settings;
            console.log(settings);
            if(settings.running){
                if($('#rePayPwd').length > 0){
                    init.sendMessage('reset');
                }else{
                    init.sendMessage('task');
                }
            }
        }
        if(message.cmd === 'reset'){
            reset = message.reset;
            console.log(reset);
            updatePayPassword();
        }
    });
}

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        console.log(mutation.type);
        console.log(mutation);
        if(mutation.type == 'childList'){
            if(mutation.target.className == 'msg-error' && mutation.addedNodes.length > 0){
                var text = mutation.target.innerText;
                if(mutation.target.id == 'authCode_error'){
                    if(text){
                        if(text.indexOf('验证码错误')!=-1){
                            setTimeout(function(){
                                init.watchDog();
                                window.location.reload(true);
                            },3000);
                        }
                    }
                }else if(mutation.target.id == 'payPwd_error'){
                    if(text){
                        init.watchDog();
                        chrome.extension.sendMessage({cmd: 'disable',message: text});
                    }
                }else{

                }
            }
        }
    })
});
observer.observe(document.body, {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
    attributeOldValue: true
});
