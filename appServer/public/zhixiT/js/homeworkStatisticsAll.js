/**
 * Created by hjy on 2016/10/14 0014.
 */

function loadQuestion(){
    $.ajax(
        {
            type : "GET",
            async : true,
            url : "/rest/t/schedule/"+ util.getQueryString("schedule_id") +"/homework/stat/question",
            dataType : 'json',
            beforeSend: function(request) {
                request.setRequestHeader("auth", window.btoa("access_token="+ util.getQueryString("access_token")));
            },
            success : function(data, textStatus, jqXHR) {
                vm.questions(data.list);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                util.errorCodeApi(jqXHR.responseJSON);
            }
        }
    );
}
var viewModel = function() {
    this.questions = ko.observableArray();
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
});