/**
 * Created by hjy on 2016/9/26 0026.
 */

function loadSelectQuestions(){
    $.ajax(
        {
            type : "GET",
            async : true,
            url : "/rest/t/schedule/"+ util.getQueryString("schedule_id") +"/homework/rest/t/homework",
            dataType : 'json',
            data : {},
            beforeSend: function(request) {
                request.setRequestHeader("auth", window.btoa("access_token="+ util.getQueryString("access_token")));
            },
            success : function(data, textStatus, jqXHR) {
                vm.selectedQuestions(data.list);
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
    this.selectedQuestions = ko.observableArray();
};
var vm = new viewModel();
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