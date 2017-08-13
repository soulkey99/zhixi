/**
 * Created by hjy on 2016/9/23 0023.
 */

function loadQuestions(){
    if(sessionStorage.getItem("sec_id") != null){
        $.ajax(
            {
                type : "GET",
                async : true,
                url : "/rest/t/study/section/"+ sessionStorage.getItem("sec_id") +"/question",
                dataType : 'json',
                data : {
                    start: vm.start()*vm.limit()+1,
                    limit: vm.limit()
                },
                beforeSend: function(request) {
                    request.setRequestHeader("auth", window.btoa("access_token="+ sessionStorage.getItem("access_token")));
                },
                success : function(data, textStatus, jqXHR) {
                    if(data.list.length <= 0){
                        $(".loadMore").remove();
                    }else{
                        vm.questions(vm.questions().concat(data.list));
                        MathJax.Hub.Queue(["Typeset",MathJax.Hub, "main"],function(){
                            $(".main").css("display","block");
                        });
                    }
                    if(sessionStorage.getItem("question_ids") != ""){
                        loadSelectedQuestions(sessionStorage.getItem("question_ids"));
                    }
                },
                error : function(jqXHR, textStatus, errorThrown) {
                    util.errorCodeApi(jqXHR.responseJSON);
                }
            }
        );
    }
}
function loadSelectedQuestions(ids){
    $.ajax(
        {
            type : "GET",
            async : true,
            url : "/rest/t/study/questions",
            dataType : 'json',
            data : {
                q_id: ids
            },
            beforeSend: function(request) {
                request.setRequestHeader("auth", window.btoa("access_token="+ sessionStorage.getItem("access_token")));
            },
            success : function(data, textStatus, jqXHR) {
                for(var i=0;i<data.list.length;i++){
                    //$("#"+data.list[i].q_id).hide();
                    $("#"+data.list[i].q_id).attr("src","images/del.png");
                }
                vm.selectedQuestions(data.list);
                MathJax.Hub.Queue(["Typeset",MathJax.Hub, "selectedQuestionList"],function(){});
            },
            error : function(jqXHR, textStatus, errorThrown) {
                util.errorCodeApi(jqXHR.responseJSON);
            }
        }
    );
}
function addQuestion(){
    //$("#"+this.q_id).hide();
    //$("#"+this.q_id).attr("src","images/del.png");
    //$("#"+this.q_id).unbind("click");
    //$("#"+this.q_id).bind("click",delQuestion);
    if(vm.selectedQuestions.indexOf(this) >= 0 && sessionStorage.getItem("question_ids").indexOf(this.q_id) >= 0){
        $("#"+this.q_id).attr("src","images/add.png");
        vm.selectedQuestions.splice(vm.selectedQuestions.indexOf(this),1);
        var q_id = [];
        for(var i=0;i<vm.selectedQuestions().length;i++){
            q_id.push(vm.selectedQuestions()[i].q_id);
        }
    }else{
        $("#"+this.q_id).attr("src","images/del.png");
        vm.selectedQuestions.push(this);
        $(".book").removeClass("animated swing");
        setTimeout(function(){$(".book").addClass("animated swing");},100);
        var q_id = [];
        for(var i=0;i<vm.selectedQuestions().length;i++){
            q_id.push(vm.selectedQuestions()[i].q_id);
        }
    }
    MathJax.Hub.Queue(["Typeset",MathJax.Hub, "selectedQuestionList"],function(){});
    sessionStorage.setItem("question_ids",q_id.join(","));

}
function delQuestion(){
    vm.selectedQuestions.splice(vm.selectedQuestions.indexOf(this),1);
    var q_id = [];
    for(var i=0;i<vm.selectedQuestions().length;i++){
        q_id.push(vm.selectedQuestions()[i].q_id);
    }
    MathJax.Hub.Queue(["Typeset",MathJax.Hub, "selectedQuestionList"],function(){});
    sessionStorage.setItem("question_ids",q_id.join(","));
    $("#"+this.q_id).attr("src","images/add.png");
    //$("#"+this.q_id).show();
    //$("#"+this.q_id).attr("src","images/add.png");
    //$("#"+this.q_id).unbind("click");
    //$("#"+this.q_id).bind("click",addQuestion);
}
function loadMore(){
    vm.start(vm.start()+1);
    loadQuestions();
}
function openSelected(){
    $(".selectedQuestionDiv").removeClass("closeSelected");
    $(".bg").css("display","block");
    $(".selectedQuestionDiv").addClass("openSelected");
}
function changeBg(obj,color){
    $(obj).css("backgroundColor",color);
}
function subQuestions(){
    if(sessionStorage.getItem("setHomeworkAgain")){
        $.ajax(
            {
                type : "POST",
                async : true,
                url : "/rest/t/schedule/"+ sessionStorage.getItem("schedule_id") +"/student/"+ sessionStorage.getItem("s_id") +"/homework/",
                dataType : 'json',
                data : {
                    q_id: sessionStorage.getItem("question_ids")
                },
                beforeSend: function(request) {
                    request.setRequestHeader("auth", window.btoa("access_token="+ access_token));
                },
                success : function(data, textStatus, jqXHR) {
                    if (util.u.indexOf('Android') >= 0) {//安卓手机
                        javascript:zhixi.jsCallback('setHomeworkAgainSuccess',{});
                    } else if (util.u.indexOf('iPhone') >= 0) {//苹果手机
                        window.location.href = "/setHomeworkAgainSuccess";
                    }
                    sessionStorage.setItem("question_ids","");
                    setTimeout(function(){
                        window.location.href = "personalStatistics.html?schedule_id="+ sessionStorage.getItem("schedule_id") +"&s_id="+ sessionStorage.getItem("s_id") +"&access_token="+ access_token;
                    },100);
                },
                error : function(jqXHR, textStatus, errorThrown) {
                    util.errorCodeApi(jqXHR.responseJSON);
                }
            }
        );
    }else{
        if (util.u.indexOf('Android') >= 0) {//安卓手机
            javascript:zhixi.jsCallback('selectQuestionCom', sessionStorage.getItem("question_ids"));
        } else if (util.u.indexOf('iPhone') >= 0) {//苹果手机
            window.location.href = "/selectQuestionCom";
        }
    }
}
function getQ_id(){
    return sessionStorage.getItem("question_ids");
}
function closeSelected(){
    $(".selectedQuestionDiv").removeClass("openSelected");
    $(".bg").css("display","none");
    $(".selectedQuestionDiv").addClass("closeSelected");
}
function changeBook(){
    window.location.href = "selectBook.html?access_token="+ sessionStorage.getItem("access_token");
}
var viewModel = function() {
    this.questions = ko.observableArray([]);
    this.selectedQuestions = ko.observableArray();
    this.start = ko.observable(0);
    this.limit = ko.observable(10);
    this.selectedNum = ko.observable(0);
    this.isEnd = ko.observable(false);
    this.addQuestion = addQuestion;
    this.delQuestion = delQuestion;
};
var vm = new viewModel();
if(sessionStorage.getItem("access_token") == "" || sessionStorage.getItem("access_token") == null || sessionStorage.getItem("access_token") == undefined){
    sessionStorage.setItem("access_token", util.getQueryString("access_token"));
}
$(document).ready(function(){
    SwiftClick.attach(document.body);
    ko.applyBindings(vm);
    $(window).scroll(function(){
        if($(document).scrollTop() >= $(document).height() - $(window).height() && !vm.isEnd()) {
            $("#more").empty();
            $("#more").append("正在加载...");
            loadMore();
        }
    });
    MathJax.Hub.Config({
        extensions: ["tex2jax.js"],
        jax: ["input/TeX","output/HTML-CSS"],
        tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]},
        messageStyle: "none",
        showMathMenu: false,
        showMathMenuMSIE: false
    });
    loadQuestions();
});