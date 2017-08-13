/**
 * Created by hjy on 2016/9/28 0028.
 */

function loadInfo(){
    $.ajax(
        {
            type : "GET",
            async : true,
            url : "/rest/t/schedule/"+ util.getQueryString("schedule_id") +"/homework/stat/student/"+ util.getQueryString("s_id"),
            dataType : 'json',
            data: {
              type: "schedule"
            },
            beforeSend: function(request) {
                request.setRequestHeader("auth", window.btoa("access_token="+ util.getQueryString("access_token")));
            },
            success : function(data, textStatus, jqXHR) {
                vm.questions(data.info.list);
                vm.s_nick(data.info.s_nick);
                vm.has_feedback(data.info.has_feedback);
                document.title = data.info.s_nick + "的错题";
                if(data.info.s_avatar != ""){
                    vm.s_avatar(data.info.s_avatar);
                }
                if(data.info.has_feedback){
                    $(".feedback").text("查看反馈");
                }else{
                    $(".feedback").text("反馈情况");
                }
                vm.num(Math.round(data.info.correct_count/data.info.question_total*100));
                MathJax.Hub.Queue(["Typeset",MathJax.Hub, "main"],function(){});
            },
            error : function(jqXHR, textStatus, errorThrown) {
                util.errorCodeApi(jqXHR.responseJSON);
            }
        }
    );
}
function setHomeworkAgain(){
    sessionStorage.setItem("setHomeworkAgain",true);
    window.location.href = "selectBook.html?access_token="+ util.getQueryString("access_token");
}
function homeworkAgainList(){
    window.location.href = "homeworkAgainList.html?schedule_id="+ util.getQueryString("schedule_id") +"&s_id="+ util.getQueryString("s_id") +"&access_token="+ util.getQueryString("access_token");
}
function questionDetails(){
    window.location.href = "questionDetails.html?swork_id="+ this.swork_id +"&q_id="+ this.q_id +"&access_token="+ util.getQueryString("access_token");
}
function feedback(){
    if (util.u.indexOf('Android') >= 0) {
        javascript:zhixi.jsCallback('feedback',JSON.stringify({has_feedback: vm.has_feedback(), schedule_id: sessionStorage.getItem("schedule_id"), s_id: sessionStorage.getItem("s_id")}));
    } else if (util.u.indexOf('iPhone') >= 0) {
        window.location.href = "/feedback?has_feedback="+ vm.has_feedback() + "&schedule_id=" + sessionStorage.getItem("schedule_id") + "&s_id=" + sessionStorage.getItem("s_id");
    }
}
function changeBg(obj,color){
    $(obj).css("backgroundColor",color);
}
var viewModel = function() {
    this.questions = ko.observableArray();
    this.s_nick = ko.observable("");
    this.s_avatar = ko.observable("images/defaultHead.png");
    this.num = ko.observable("");
    this.has_feedback = ko.observable();
    this.questionDetails = questionDetails;
};
var vm = new viewModel();
sessionStorage.setItem("schedule_id",util.getQueryString("schedule_id"));
sessionStorage.setItem("s_id",util.getQueryString("s_id"));
$(document).ready(function(){
    SwiftClick.attach(document.body);
    ko.applyBindings(vm);
    loadInfo();
    MathJax.Hub.Config({
        extensions: ["tex2jax.js"],
        jax: ["input/TeX","output/HTML-CSS"],
        tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]},
        messageStyle: "none",
        showMathMenu: false,
        showMathMenuMSIE: false
    });
});