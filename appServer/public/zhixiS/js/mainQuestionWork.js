/**
 * Created by hjy on 2016/9/13 0013.
 */

function loadMainQuestion(){
    $.ajax(
        {
            type : "GET",
            async : true,
            url : "/rest/s/homework/"+ sessionStorage.getItem("swork_id") +"/next",
            dataType : 'json',
            beforeSend: function(request) {
                request.setRequestHeader("auth", window.btoa("access_token="+ sessionStorage.getItem("access_token")));
            },
            success : function(data, textStatus, jqXHR) {
                if(data.info == {}){
                    alert("无作业");
                }else{
                    $(".content").html(data.info.content.replace(/\$\$/g,'\$'));
                    MathJax.Hub.Queue(["Typeset",MathJax.Hub, "content"]);
                    $(".header").find("img").attr("src","images/difficulty"+data.info.difficulty+".png");
                    vm.q_id(data.info.q_id);
                    sessionStorage.setItem("q_id",data.info.q_id);
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
    window.location.href = "subQuestionWork.html";
}

function changeBtnBg(color){
    $(".footer").css("backgroundColor",color);
}

var viewModel = function() {
    this.q_id = ko.observable("");
};
var vm = new viewModel()
    ,access_token = util.getQueryString("access_token")
    ,swork_id = util.getQueryString("swork_id");
//access_token = "8b264331138b2f47dbb7cb6f4bf2e47d89e8157e2568f95d";
//swork_id = "57ff46092ba2a6ac511137aa";
if(access_token!=null && swork_id!=null){
    sessionStorage.setItem("access_token",access_token);
    sessionStorage.setItem("swork_id",swork_id);
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
        $(".content").css("display","block");
        //MathJax.Hub.Queue(["Typeset",MathJax.Hub, "mathJax"]);
    });
    loadMainQuestion();
});