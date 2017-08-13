/**
 * Created by hjy on 2016/9/26 0026.
 */

var util = function() {};

//错误返回代码提示
util.errorCodeApi = function(errorData){
    switch(errorData.code){
        case 899: //token invalid
            window.location.href = "/setLoginSession";
            break;
        default:
            alert(errorData.code + "-" + errorData.msg);
            break;
    }
}

//获取URL中的参数解决中文乱码问题
util.getQueryString = function(key){
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
}

//app端调用的设置登录状态接口
util.setLoginSession = function(access_token){
    sessionStorage.setItem("access_token",access_token);
    window.location.href = window.location.href;
}

//调用app端登陆页面
util.js2Phone = function(){
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
        javascript:callcall.jsCallback('signin', {});
    } else if (u.indexOf('iPhone') > -1) {//苹果手机
        window.location = "/login";
        //window.href = "/login"
    } else if (u.indexOf('Windows Phone') > -1) {//winphone手机
        alert("winphone手机");
    } else if(u.indexOf('Windows') > -1){
        window.location.href = "about:blank"; //Windows
    } else if(u.indexOf('Macintosh') > -1){
        window.location.href = "about:blank"; //Mac OS
    }
}

util.u = navigator.userAgent;