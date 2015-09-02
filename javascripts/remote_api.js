function RemoteApi(settings) {
  settings.env = settings.env ? settings.env : 'pro';
  if(settings.env == 'pro'){
    this.server_host = "https://disi.se";
  }else if(settings.env == 'dev'){
    this.server_host = "http://192.168.3.88:8080";
  }else if(settings.env == 'test'){
    this.server_host = "http://b22.poptop.cc/";
  }else{
    this.server_host = "";
  }
  this.client_id = settings.computer_name;
  this.app_secret = 'F$~((kb~AjO*xgn~';
}

RemoteApi.prototype = {
  getTask: function(done_callback, fail_callback) {
    var url = this.server_host + "/index.php/Admin/AccountResetPasswordTaskApi/get_account";
    var request_data = {
      host_id: this.client_id,
      version: chrome.runtime.getManifest().version,
      app_secret: this.app_secret,
    };

    $.getJSON(url, request_data, function(data, textStatus, jqXHR) {
      done_callback && done_callback(data);
    }).fail(function(jqXHR, textStatus, errorThrown) {
      fail_callback && fail_callback();
    });
  },

  reportPassword:function(account_id,password,done_callback,fail_callback){
    var url = this.server_host + "/index.php/Admin/AccountResetPasswordTaskApi/password_reset";
    var post_data = {
      host_id: this.client_id,
      app_secret: this.app_secret,
      version: chrome.runtime.getManifest().version,
      account_id: account_id,
      password: password
    };
    $.post(url, post_data, function(data, textStatus, jqXHR) {
      done_callback && done_callback(data);
    },'Json').fail(function(jqXHR, textStatus, errorThrown) {
      fail_callback && fail_callback();
    });
  },

  reportPayPassword:function(account_id,pay_password,done_callback,fail_callback){
    var url = this.server_host + "/index.php/Admin/AccountResetPasswordTaskApi/payment_password_reset";
    var post_data = {
      host_id: this.client_id,
      app_secret: this.app_secret,
      version: chrome.runtime.getManifest().version,
      account_id: account_id,
      pay_password: pay_password
    };
    $.post(url, post_data, function(data, textStatus, jqXHR) {
      done_callback && done_callback(data);
    },'Json').fail(function(jqXHR, textStatus, errorThrown) {
      fail_callback && fail_callback();
    });
  },

  reportFail: function(account_id,message,done_callback,fail_callback){
    var url = this.server_host + "/index.php/Admin/AccountResetPasswordTaskApi/reset_password_fail";
    var post_data = {
      host_id: this.client_id,
      app_secret: this.app_secret,
      version: chrome.runtime.getManifest().version,
      account_id: account_id,
      message: message
    };
    $.post(url, post_data, function(data) {
      done_callback && done_callback(data);
    },'Json').fail(function(jqXHR, textStatus, errorThrown) {
      fail_callback && fail_callback();
    });
  },

  reportDisable: function(account_name,slug,message,done_callback,fail_callback){
    var url = this.server_host + "/index.php/Admin/ClientApi/disabled_account";
    var post_data = {
      host_id: this.client_id,
      app_secret: this.app_secret,
      version: chrome.runtime.getManifest().version,
      username: account_name,
      slug: slug,
      locked_type: 4,
      locked_remark: message
    };
    if(message){
      $.post(url, post_data, function(data) {
        done_callback && done_callback(data);
      },'Json').fail(function(jqXHR, textStatus, errorThrown) {
        fail_callback && fail_callback();
      });
    }else{
      fail_callback && fail_callback();
    }

  },

  reportTask: function(type, order_id, delay, message, done_callback, fail_callback) {
    var url = this.server_host + "/index.php/Admin/ClientApi/report_status";

    var post_data = {
      client_id: this.client_id, 
      app_secret: this.app_secret,
      version: chrome.runtime.getManifest().version,
      cmd: type,
      order_id: order_id,
      delay: delay,
      message: message
    };

    $.post(url, post_data, function(data) {
      done_callback && done_callback(data);
    },'Json').fail(function(jqXHR, textStatus, errorThrown) {
      fail_callback && fail_callback();
    });
  },

  reportCookie:function(account_id,cookies,done_callback, fail_callback){
    var url = this.server_host + "/index.php/Admin/ClientApi/business_account_cookies_save";

    var post_data = {
      app_secret: this.app_secret,
      cookies: cookies,
      account_id:account_id
    };

    $.post(url, post_data, function(data) {
      done_callback && done_callback(data);
    },'Json').fail(function(jqXHR, textStatus, errorThrown) {
      fail_callback && fail_callback();
    })
  }
	
};