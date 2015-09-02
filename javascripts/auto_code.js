
function AutoCode() {
    this.username = 'koubei1';
    this.password = 'koubei123';
    this.appid = 898;//软件id 898
    this.appkey = '4fecbf509a2eab0d8973b8de7f997820';//软件key
    this.sendUrl = 'http://api.yundama.com/api.php';//接口地址
    this.codeLen = 4;

    this.codetype = 1004;//验证码类型 1004 英文数字4位
    this.timeout = 30;//打码时长s
    this.flag = 0;//报错接口 正确1错误0

    this.xhr = new XMLHttpRequest();
}

AutoCode.prototype = {
    getImg: function(imgsrc,success,error){
        var a =this;
        var xhr = a.xhr;
        xhr.open('GET', imgsrc, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
            if (this.readyState==4){
                if (this.status == 200) {
                    a.submitImg(this.response,success,error);
                }else{
                    console.warn('get img result error',this.response);
                    error && error();
                }
            }else{
                console.warn('get img error',this);
                error && error();
            }
        };
        xhr.send();
    },

    submitImg: function(file,success,error){
        var formData = new FormData();
        var a =this;
        formData.append('username', this.username);
        formData.append('password', this.password);
        formData.append('codetype', this.codetype);
        formData.append('appid', this.appid);
        formData.append('appkey', this.appkey);
        formData.append('timeout', this.timeout);
        formData.append('method', 'upload');
        formData.append('file', file);
        var xhr = a.xhr;
        xhr.open('POST', this.sendUrl, true);
        xhr.onload = function(e) {
            if (this.readyState==4){
                if (this.status == 200) {
                    var result = $.parseJSON(this.response);
                    if(result.ret == '0'){
                        console.log('submit img successfully');
                        a.getCode(result.cid,success,error);
                    }else{
                        //提交打码错误
                        console.warn('submit img result error',result);
                        error && error();
                    }
                }else{
                    //提交打码未成功
                    console.warn('submit img error',this);
                    error && error();
                }
            }else{
                console.warn('submit img error',this);
                error && error();
            }
        };

        xhr.send(formData);
    },

    getCode: function(cid,success,error){
        var data = {
            cid: cid,
            method: 'result'
        };
        var a =this;
        $.ajax(this.sendUrl,{type: 'GET', data: data, dataType: 'JSON'}).success(function(result){
            if(result.ret == 0){//打码结果
                if(result.text.length == a.codeLen){
                    console.log('get code successfully');
                    //验证码正常使用
                    setTimeout(function(){
                        success && success(cid,result.text);
                    },3000);

                }else{
                    //验证码长度错误
                    console.warn('get code result text length error',result);
                    error && error();
                }
            }else if(result.ret == -3002){//正在识别 ，继续请求
                a.getCode(cid,success,error);
            }else{
                console.warn('get code result error',result);
                AutoCode.reportError(cid,function(){
                    error && error();
                });
            }
        }).error(function(Request){
            console.warn('get code error',Request);
            error && error();
        });
    },

    reportError: function(cid,callback){
        var data = {
            username: this.username,
            password: this.password,
            appid: this.appid,
            appkey: this.appkey,
            cid: this.cid,
            flag: this.flag,
            method: 'report'
        };
        $.ajax(this.sendUrl,{type: 'POST', data: data, dataType: 'JSON'}).success(function(result){
            if(result.ret == 0){
                console.log('report successfully');
                setTimeout(function(){
                    callback && callback();
                },3000);
            }else{
                console.warn('report result error',result);
            }
        }).error(function(Request){
            console.warn('report error',Request);
        });
    },

    submit: function(imgsrc,success,error){
        this.getImg(imgsrc,success,error);
    }
};
