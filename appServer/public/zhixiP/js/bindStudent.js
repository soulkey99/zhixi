/**
 * Created by hjy on 2016/11/10 0010.
 */

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
function wxScan(){
    $(".scan").find("img").attr("src","images/startScan.png");
    $(".scan").find("img").bind("click",wxScan);
    wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
            if(res.errMsg == 'scanQRCode:ok'){
                var url = parseUrl(res.resultStr);
                var action = parseQuery(url.query, 'action');
                var s_id = parseQuery(url.query, 's_id');
                sessionStorage.setItem("action", action);
                sessionStorage.setItem("s_id", s_id);
                if(action == "bind_parents"){
                    $.ajax({
                        type: 'GET',
                        async: true,
                        url: '/rest/p/student/' + s_id + '/info',
                        beforeSend: function (request) {
                            request.setRequestHeader("auth", window.btoa("access_token=" + sessionStorage.getItem("access_token")));
                        },
                        dataType: 'json',
                        success: function (data) {
                            $(".scan").hide();
                            if (data.code == 900) {
                                $(".header").find("img").attr("src", data.info.avatar);
                                $(".nick").text(data.info.nick);
                            } else if (data.code == 914) {
                                window.location.href = data.url;
                            } else {
                                console.log(data.msg);
                            }
                        },
                        error: function (xhr, statusText, error) {
                            alert(xhr.responseJSON.code);
                            alert(xhr.responseJSON.msg);
                            if (xhr.status == 301 || xhr.status == 302) {
                                window.location.href = '';
                            }
                        }
                    })
                }else{
                    $(".scan").find("img").attr("src","images/startScan.png");
                    $(".scan").find("img").bind("click",wxScan);
                    alert("请扫描正确的二维码");
                }
            } else {
                alert('scan error.');
            }
        }
    });
}
function bindStudent(){
    $.ajax({
        type: 'POST',
        async: true,
        url: '/rest/p/student/' + sessionStorage.getItem("s_id") + '/bind',
        beforeSend: function (request) {
            request.setRequestHeader("auth", window.btoa("access_token=" + sessionStorage.getItem("access_token")));
        },
        data: {},
        dataType: 'json',
        success: function (data) {
            if (data.code == 900) {
                wx.closeWindow();
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
function parseUrl(url) {
    var a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function () {
            var ret = {},
                seg = a.search.replace(/^\?/, '').split('&'),
                len = seg.length, i = 0, s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };
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
function pushHistory() {
    var state = {
        title: "title",
        url: "#"
    };
    window.history.pushState(state, "title", "#");
}
wx.ready(function () {
    if(vm.code()!=null && vm.code()!=""){
        wxScan();
    }
});
var viewModel = function() {
    this.auth_url = ko.observable();
    this.s_id = ko.observable();
    this.code = ko.observable(getQueryString("code"));
};
var vm = new viewModel();
$(document).ready(function(){
    SwiftClick.attach(document.body);
    ko.applyBindings(vm);
    if(vm.code()!=null && vm.code()!=""){
        wxLogin();
    }else{
        initWX();
    }
    pushHistory();
    window.addEventListener("popstate", function(e) {
        wx.closeWindow();
    }, false);
});