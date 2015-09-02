function Init() {
  chrome.extension.sendMessage({cmd: 'watchdog'});
}

Init.prototype = {
  watchDog: function() {
    chrome.extension.sendMessage({cmd: 'watchdog'});
  },

  sendMessage: function(type){
    chrome.extension.sendMessage({cmd: type});
  },

  messageListener: function(){

  },

  accountDisable: function(callback){
    callback && callback();
  },
  listAction: function() {
    var my_jd_info = $('#_MYJD_info a');
    if(my_jd_info.length > 0){
      my_jd_info[0].click();
    }else{
      window.location.href = 'http://i.jd.com/user/info';
    }
  },

  userInfo: function() {
    var my_jd_safe = $('#_MYJD_safe a');
    if(my_jd_safe.length > 0){
      my_jd_safe[0].click();
    }else{
      window.location.href = 'http://safe.jd.com/user/paymentpassword/safetyCenter.action';
    }
  },

  safeCenter: function(type) {
    if(type == 'password'){
      var login_passwd = $('.safe-item:visible').find('.fore1 strong').filter(':contains("登录密码")');
      if(login_passwd.length > 0){
        var update_passwd = $('.safe-item:visible').find('.fore1 strong').filter(':contains("登录密码")').parents('.safe-item').find('.fore3 a');
        if(update_passwd.length > 0){
          update_passwd[0].click();
        }else{
          window.location.href = 'http://safe.jd.com/validate/updatePassword';
        }
      }else{
        window.location.href = 'http://safe.jd.com/validate/updatePassword';
      }
    }
    if(type == 'pay_password'){
      var pay_passwd = $('.safe-item:visible').find('.fore1 strong').filter(':contains("支付密码")');
      if(pay_passwd.length > 0){
        var update_pay_passwd = $('.safe-item:visible').find('.fore1 strong').filter(':contains("支付密码")').parents('.safe-item').find('.fore3 a');
        if(update_pay_passwd.length > 0){
          update_pay_passwd[0].click();
        }else{
          window.location.href = 'http://safe.jd.com/user/paymentpassword/findByPin.action';
        }
      }else{
        window.location.href = 'http://safe.jd.com/user/paymentpassword/findByPin.action';
      }
    }
  },

  updatePassword: function(callback){
    var password = $('#password');
    if(password.length > 0){
      callback && callback();
    }else{
      var mobile_span = $('#mobileSpan');
      var pay_pwd = null;
      if(mobile_span.length > 0){
        pay_pwd = mobile_span.next('a').filter(':contains("通过支付密码验证")');
        if(pay_pwd.length > 0){
          pay_pwd[0].click();
        }else{
          window.location.href = 'http://safe.jd.com/validate/password/updatePassword.action?type=payPwd';
        }
      }else{
        pay_pwd = $('#payPwd');
        if(pay_pwd.length > 0){
          callback && callback();
        }else{
          window.location.href = 'http://safe.jd.com/validate/password/updatePassword.action?type=payPwd';
        }
      }
    }
  },

  updatePasswordSuccess: function(callback){
    callback && callback();
  },

  updatePayPassword: function(callback){
    var re_pay_pwd = $('#rePayPwd');
    if(re_pay_pwd.length > 0){
      callback && callback();
    }else{
      var mobile_span = $('#mobileSpan');
      var pay_pwd = null;
      if(mobile_span.length > 0){
        pay_pwd = mobile_span.next('a').filter(':contains("通过支付密码验证")');
        if(pay_pwd.length > 0){
          pay_pwd[0].click();
        }else{
          window.location.href = 'http://safe.jd.com/validate/payPwd/updatePayPwd.action?type=payPwd';
        }
      }else{
        pay_pwd = $('#payPwd');
        if(pay_pwd.length > 0){
          callback && callback();
        }else{
          window.location.href = 'http://safe.jd.com/validate/payPwd/updatePayPwd.action?type=payPwd';
        }
      }
    }
  },

  updatePayPasswordSuccess: function(callback){
    callback && callback();
  }



};