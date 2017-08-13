/**
 * Created by hjy on 2016/11/3 0003.
 */

function loadSelectQuestions(){
    var url = "", data = {};
    if(swork_id != null && swork_id != ""){
        url = "/rest/t/swork/"+ swork_id +"/stat";
    }else{
        url = "/rest/t/schedule/"+ schedule_id +"/homework/stat/student/"+ s_id;
        data.type = "additional";
    }
    $.ajax(
        {
            type : "GET",
            async : true,
            url : url,
            dataType : 'json',
            data : data,
            beforeSend: function(request) {
                request.setRequestHeader("auth", window.btoa("access_token="+ util.getQueryString("access_token")));
            },
            success : function(data, textStatus, jqXHR) {
                vm.selectedQuestions(data.info.list);
                vm.swork_id(data.info.swork_id);
                if(schedule_id == null || schedule_id == ""){
                    sessionStorage.setItem("s_id", data.info.s_id);
                    sessionStorage.setItem("schedule_id", data.info.schedule_id);
                }
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
function questionDetails(){
    if(this.status != "pending"){
        window.location.href = "questionDetails.html?swork_id="+ vm.swork_id() +"&q_id="+ this.q_id +"&access_token="+ util.getQueryString("access_token");
    }
}
function setHomeworkAgain(){
    sessionStorage.setItem("setHomeworkAgain",true);
    window.location.href = "selectBook.html?access_token="+ util.getQueryString("access_token");
}
var viewModel = function() {
    this.selectedQuestions = ko.observableArray();
    this.questionDetails = questionDetails;
    this.swork_id = ko.observable("");
};
var vm = new viewModel()
    ,swork_id = util.getQueryString("swork_id")
    ,schedule_id = util.getQueryString("schedule_id")
    ,s_id = util.getQueryString("s_id");
$(document).ready(function(){
    SwiftClick.attach(document.body);
    ko.applyBindings(vm);
    loadSelectQuestions();
    MathJax.Hub.Config({
        extensions: ["tex2jax.js"],
        jax: ["input/TeX","output/HTML-CSS"],
        tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]},
        messageStyle: "none",
        showMathMenu: false,
        showMathMenuMSIE: false
    });
});