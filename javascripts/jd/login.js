var task = null;
var settings = null;
var init = new Init();
var config = { attributes: true, childList: true, characterData: true, subtree: true, attributeOldValue: true };
messageListener();
init.sendMessage('settings');

function messageListener(){
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
        if(message.cmd == 'task'){
            task = message.task;
            console.log(task);
            if(!task.password || !task.pay_password){
                if(!task.password){
                    chrome.extension.sendMessage({cmd: 'disable',message: '密码为空'});
                }
                else if(!task.pay_password){
                    chrome.extension.sendMessage({cmd: 'disable',message: '支付密码为空'});
                }
            }else{
                login();
            }
        }
        else if(message.cmd == 'settings'){
            settings = message.settings;
            console.log(settings);
            init.sendMessage('task');
        }
        else if(message.cmd == 'autocode'){
            console.log('打码成功');
            var code = message.code;
            $('#authcode').val(code);
            login();
        }
    });
}

function login(){
    console.log('登录');
    var $loginname = $('#loginname');
    var $loginpwd = $('#nloginpwd');
    var $loginsubmit = $('#loginsubmit');
    //var $authcode = $('#authcode');
    if($loginname.length > 0 && $loginpwd.length > 0 && $loginsubmit.length > 0){
        $loginname.val(task.username);
        setTimeout(function(){
            $loginpwd.val(task.password);
            setTimeout(function() {
                chrome.extension.sendMessage({cmd: 'watchdog'});
                if($('#loginname').val() == task.username && $('#nloginpwd').val() == task.password){
                    $loginsubmit[0].click();
                }else{
                    window.location.reload(true);
                }
            }, 3000);
        },3000);
    }else{
        console.log("页面无 登陆 用户框 密码框 //刷新页面");
        setTimeout(function(){
            chrome.extension.sendMessage({cmd: 'watchdog'});
            window.location.reload(true);
        },3000);
    }
}

function getCodeImg(imgsrc){
    console.log('get img');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', imgsrc, true);
    xhr.responseType = 'blob';
    xhr.onload = function(e) {
        if (this.readyState==4){
            if (this.status == 200) {
                console.log(this.response);
                chrome.extension.sendMessage({cmd:'autocode', img:this.response});
            }else{

            }
        }else{

        }
    };
    xhr.send();
}

function autoCode(){
    console.log('打码');
    setTimeout(function(){
        chrome.extension.sendMessage({cmd: 'watchdog'});
        var img = $('#JD_Verification1').attr('src');
        if(img){
            console.log('background打码');
            getCodeImg(img);
        }else{
            window.location.reload(true);
        }
    },3000);

    //dama.submit(img,function(cid,text){
    //    console.log(cid);
    //    console.log(text);
    //    $('#authCode').val(text);
    //    setTimeout(function(){
    //        login();
    //    },3000);
    //},function(){
    //    setTimeout(function(){
    //        window.location.reload(true);
    //    },3000);
    //});
}

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if(settings.running){
            if(mutation.type === 'childList'){

                if(mutation.addedNodes.length > 0 && mutation.target.className == 'msg-wrap'){
                    console.log(mutation);
                    if(mutation.target.innerText.indexOf('账户名与密码不匹配，请重新输入') != -1){
                        console.log(mutation.target.innerText);
                        chrome.extension.sendMessage({cmd: 'disable',message: mutation.target.innerText});
                    }
                    if(mutation.target.innerText.indexOf('公共场所不建议自动登录，以防账号丢失') != -1){
                        console.log(mutation.target.innerText);
                    }
                    if(mutation.target.innerText.indexOf('请输入验证码') != -1){
                        console.log(mutation.target.innerText);
                        chrome.extension.sendMessage({cmd: 'start_task',message: mutation.target.innerText})
                    }
                    if(mutation.target.innerText.indexOf('验证码不正确') != -1 || mutation.target.innerText.indexOf('验证码已过期') != -1){
                        console.log(mutation.target.innerText);
                        //autoCode();
                    }
                    if(mutation.target.innerText.indexOf('你的账号因安全原因被暂时封锁，请将账号和联系方式发送到shensu@jd.com，等待处理') != -1){
                        console.log(mutation.target.innerText);
                        chrome.extension.sendMessage({cmd: 'disable',message: mutation.target.innerText});
                    }
                }
            }
            if(mutation.type === 'attributes'){

            }
        }
    });
});

observer.observe(document.body, config);
