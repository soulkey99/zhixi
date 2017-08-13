/**
 * Created by hjy on 2016/9/26 0026.
 */

var util = function() {};

//���󷵻ش�����ʾ
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

//��ȡURL�еĲ������������������
util.getQueryString = function(key){
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
}

//app�˵��õ����õ�¼״̬�ӿ�
util.setLoginSession = function(access_token){
    sessionStorage.setItem("access_token",access_token);
    window.location.href = window.location.href;
}

//����app�˵�½ҳ��
util.js2Phone = function(){
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//��׿�ֻ�
        javascript:callcall.jsCallback('signin', {});
    } else if (u.indexOf('iPhone') > -1) {//ƻ���ֻ�
        window.location = "/login";
        //window.href = "/login"
    } else if (u.indexOf('Windows Phone') > -1) {//winphone�ֻ�
        alert("winphone�ֻ�");
    } else if(u.indexOf('Windows') > -1){
        window.location.href = "about:blank"; //Windows
    } else if(u.indexOf('Macintosh') > -1){
        window.location.href = "about:blank"; //Mac OS
    }
}

util.u = navigator.userAgent;