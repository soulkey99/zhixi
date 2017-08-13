/**
 * Created by hjy on 2016/11/8 0008.
 */

function loadBooks(){
    $.ajax(
        {
            type : "GET",
            async : true,
            url : "/rest/t/study/books",
            dataType : 'json',
            data : {
                start: 1,
                limit: 9999
            },
            beforeSend: function(request) {
                request.setRequestHeader("auth", window.btoa("access_token="+ access_token));
            },
            success : function(data, textStatus, jqXHR) {
                vm.books(data.list);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                util.errorCodeApi(jqXHR.responseJSON);
            }
        }
    );
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
                request.setRequestHeader("auth", window.btoa("access_token="+ access_token));
            },
            success : function(data, textStatus, jqXHR) {
                for(var i=0;i<data.list.length;i++){
                    $("#"+data.list[i].q_id).hide();
                }
                vm.selectedQuestions(data.list);
                MathJax.Hub.Config({
                    extensions: ["tex2jax.js"],
                    jax: ["input/TeX","output/HTML-CSS"],
                    tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]},
                    messageStyle: "none",
                    showMathMenu: false,
                    showMathMenuMSIE: false
                });
                MathJax.Hub.Queue(["Typeset",MathJax.Hub, "selectedQuestionList"],function(){});
            },
            error : function(jqXHR, textStatus, errorThrown) {
                util.errorCodeApi(jqXHR.responseJSON);
            }
        }
    );
}

function selectBook(){
    sessionStorage.setItem("ver_id",this.ver_id);
    window.location.href = "selectChapter.html";
}

function setSelectedInfo(obj){
    sessionStorage.setItem("question_ids",obj);
    if(sessionStorage.getItem("question_ids") != ""){
        loadSelectedQuestions(sessionStorage.getItem("question_ids"));
    }
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

function openSelected(){
    $(".selectedQuestionDiv").removeClass("closeSelected");
    $(".bg").css("display","block");
    $(".selectedQuestionDiv").addClass("openSelected");
    MathJax.Hub.Queue(["Typeset",MathJax.Hub, "selectedQuestionList"],function(){});
}

function closeSelected(){
    $(".selectedQuestionDiv").removeClass("openSelected");
    $(".bg").css("display","none");
    $(".selectedQuestionDiv").addClass("closeSelected");
}

function delQuestion(){
    $("#"+this.q_id).show();
    vm.selectedQuestions.splice(vm.selectedQuestions.indexOf(this),1);
    var q_id = [];
    for(var i=0;i<vm.selectedQuestions().length;i++){
        q_id.push(vm.selectedQuestions()[i].q_id);
    }
    sessionStorage.setItem("question_ids",q_id.join(","));
}

function changeBg(obj,color){
    $(obj).css("backgroundColor",color);
}

function getQ_id(){
    return sessionStorage.getItem("question_ids");
}

function changeBook(){
    window.location.href = "selectBook.html?access_token="+ access_token;
}

var viewModel = function() {
    this.books = ko.observableArray();
    this.selectedQuestions = ko.observableArray();
    this.selectBook = selectBook;
};
var vm = new viewModel()
    ,access_token = util.getQueryString("access_token");
sessionStorage.setItem("access_token",access_token);
$(document).ready(function(){
    SwiftClick.attach(document.body);
    ko.applyBindings(vm);
    if(sessionStorage.getItem("question_ids") != ""){
        loadSelectedQuestions(sessionStorage.getItem("question_ids"));
    }
    if(sessionStorage.getItem("setHomeworkAgain")){
        $("#rightBtn1,#rightBtn2").text("发布作业");
    }
    loadBooks();
});