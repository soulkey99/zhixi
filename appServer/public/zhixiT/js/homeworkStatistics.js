/**
 * Created by hjy on 2016/9/27 0027.
 */

function loadQuestion(){
    $.ajax(
        {
            type : "GET",
            async : true,
            url : "/rest/t/schedule/"+ util.getQueryString("schedule_id") +"/homework/stat/question/"+ util.getQueryString("q_id") +"/wrong",
            dataType : 'json',
            data : {},
            beforeSend: function(request) {
                request.setRequestHeader("auth", window.btoa("access_token="+ util.getQueryString("access_token")));
            },
            success : function(data, textStatus, jqXHR) {
                vm.content(data.info.content.replace(/\$\$/g,'\$'));
                vm.students(data.info.list);
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

var viewModel = function() {
    this.students = ko.observableArray();
    this.content = ko.observable("");
};
var vm = new viewModel();
$(document).ready(function(){
    SwiftClick.attach(document.body);
    ko.applyBindings(vm);
    loadQuestion();
    MathJax.Hub.Config({
        extensions: ["tex2jax.js"],
        jax: ["input/TeX","output/HTML-CSS"],
        tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]},
        messageStyle: "none",
        showMathMenu: false,
        showMathMenuMSIE: false
    });
    document.title = "NO." + util.getQueryString("num");
});