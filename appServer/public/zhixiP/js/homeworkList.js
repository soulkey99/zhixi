/**
 * Created by hjy on 2016/11/11 0011.
 */

function loadHomeworkQuestions(){
    var url = "/rest/p/homework/"+ swork_id, data = {};
    $.ajax(
        {
            type : "GET",
            async : true,
            url : url,
            dataType : 'json',
            data : data,
            beforeSend: function(request) {
                request.setRequestHeader("auth", window.btoa("access_token="+ sessionStorage.getItem("access_token")));
            },
            success : function(data, textStatus, jqXHR) {
                vm.homeworkQuestions(data.info.list);
                vm.swork_id(data.info.swork_id);
                MathJax.Hub.Queue(["Typeset",MathJax.Hub, "main"],function(){
                    $(".main").css("display","block");
                });
            },
            error : function(jqXHR, textStatus, errorThrown) {
                util.errorCodeApi(jqXHR.responseJSON);
            }
        }
    );
}
function wxLogin(){
    $.ajax({
        type: 'GET',
        async: true,
        url: '/rest/p/wx/oauth?code=' + vm.code(),
        dataType: 'json',
        success: function (data) {
            if (data.code == 900) {
                console.log(JSON.stringify(data.info));
                sessionStorage.setItem('access_token', data.info.access_token);
                initWX();
            } else if (data.code == 914) {
                window.location.href = data.url;
            } else {
                console.log(data.msg);
            }
        },
        error: function (xhr, statusText, error) {
            if (xhr.status == 301 || xhr.status == 302) {
                window.location.href = '';
            }
        }
    });
}
function initWX(){
    $.ajax({
        type: 'GET',
        async: true,
        url: '/rest/p/wx/js_config',
        dataType: 'json',
        success: function (data) {
            if (data.code == 900) {
                window.app_id = data.appId;
                window.auth_url = data.auth_url;
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.appId, // 必填，公众号的唯一标识
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                    signature: data.signature,// 必填，签名，见附录1
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'translateVoice', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard',] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                vm.auth_url(window.auth_url);
                if(vm.code()==null || vm.code()==""){
                    window.location.href = vm.auth_url();
                }
            }
        },
        error: function (jqXHR) {
            console.log('fetch config err: ' + jqXHR.responseJSON);
        }
    });
}
function parseQuery(search, key) {
    var re = new RegExp('(?:\\?|&)' + key + '=(.*?)(?=&|$)', 'gi');
    var r = [], m;
    while ((m = re.exec(search)) != null) r.push(m[1]);
    return r[0];
}
function getQueryString(key){
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
}
function getQueryString(key){
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
}
var viewModel = function() {
    this.homeworkQuestions = ko.observableArray();
    this.swork_id = ko.observable("");
    this.code = ko.observable(getQueryString("code"));
};
wx.ready(function () {
    loadHomeworkQuestions();
});
var vm = new viewModel()
    ,swork_id = getQueryString("swork_id");
$(document).ready(function(){
    SwiftClick.attach(document.body);
    ko.applyBindings(vm);
    MathJax.Hub.Config({
        extensions: ["tex2jax.js"],
        jax: ["input/TeX","output/HTML-CSS"],
        tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]},
        messageStyle: "none",
        showMathMenu: false,
        showMathMenuMSIE: false
    });
    if(vm.code()!=null && vm.code()!=""){
        wxLogin();
    }else{
        initWX();
    }
});