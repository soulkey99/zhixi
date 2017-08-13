/**
 * Created by hjy on 2016/9/13 0013.
 */
function loadMainQuestion(){
    $.ajax(
        {
            type : "GET",
            async : true,
            url : "/rest/s/study/section/"+ sessionStorage.getItem("sec_id") +"/next",
            dataType : 'json',
            beforeSend: function(request) {
                request.setRequestHeader("auth", window.btoa("access_token="+ sessionStorage.getItem("access_token")));
            },
            success : function(data, textStatus, jqXHR) {
                if(data.info == {}){
                    window.location.href = 'selectChapter.html';
                }else{
                    $(".content").html(data.info.content.replace(/\$\$/g,'\$'));
                    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"content"],function(){});
                    $(".header").find("img").attr("src","images/difficulty"+data.info.difficulty+".png");
                    vm.q_id(data.info.q_id);
                    sessionStorage.setItem("next_id",data.info.next);
                    sessionStorage.setItem("mainQuestion",data.info.content.replace(/\$\$/g,'\$'));
                }
            },
            error : function(jqXHR, textStatus, errorThrown) {
                util.errorCodeApi(jqXHR.responseJSON);
            }
        }
    );
}

function start(){
    $.ajax(
        {
            type : "POST",
            async : true,
            url : "/rest/s/study/exercise",
            dataType : 'json',
            data: {
                sec_id: sec_id,
                q_id: vm.q_id()
            },
            beforeSend: function(request) {
                request.setRequestHeader("auth", window.btoa("access_token="+access_token));
            },
            success : function(data, textStatus, jqXHR) {
                sessionStorage.setItem("e_id",data.e_id);
                window.location.href = "subQuestion.html";
            },
            error : function(jqXHR, textStatus, errorThrown) {
                util.errorCodeApi(jqXHR.responseJSON);
            }
        }
    );
}

function changeBtnBg(color){
    $(".footer").css("backgroundColor",color);
}

var viewModel = function() {
    this.q_id = ko.observable("");
};
var vm = new viewModel()
    ,access_token = sessionStorage.getItem("access_token")
    ,sec_id = sessionStorage.getItem("sec_id");
if(access_token!=null && sec_id!=null){
    sessionStorage.setItem("access_token",access_token);
    sessionStorage.setItem("sec_id",sec_id);
}
$(document).ready(function(){
    FastClick.attach(document.body);
    ko.applyBindings(vm);
    MathJax.Hub.Config({
        extensions: ["tex2jax.js"],
        jax: ["input/TeX","output/HTML-CSS"],
        tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]},
        messageStyle: "none"
    });
    MathJax.Hub.Queue(function(){
        //MathJax.Hub.Queue(["Typeset",MathJax.Hub, "mathJax"]);
    });
    loadMainQuestion();
    document.title = sessionStorage.getItem("sec_title");
});