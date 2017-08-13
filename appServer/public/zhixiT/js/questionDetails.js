/**
 * Created by hjy on 2016/11/4 0004.
 */

function loadQuestions(){
    $.ajax(
        {
            type : "GET",
            async : true,
            url : "/rest/t/swork/"+ util.getQueryString("swork_id") +"/question/"+ util.getQueryString("q_id") +"/steps",
            dataType : 'json',
            data : {},
            beforeSend: function(request) {
                request.setRequestHeader("auth", window.btoa("access_token="+ util.getQueryString("access_token")));
            },
            success : function(data, textStatus, jqXHR) {
                vm.status(data.info.status);
                vm.point(data.info.point);
                vm.content(data.info.step[0].info.content.replace(/\$\$/g,'\$'));
                for(var i=1;i<data.info.step.length;i++){
                    var correct = false;
                    if(data.info.step[i].choice_id.length == 1){
                        for(var j=0;j<data.info.step[i].info.choice.length;j++){
                            if(data.info.step[i].choice_id[0] == data.info.step[i].info.choice[j].choice_id){
                                correct = data.info.step[i].info.choice[j].correct;
                            }
                        }
                    }
                    data.info.step[i].correct = correct;
                    vm.step.push(data.info.step[i]);
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

var viewModel = function() {
    this.status = ko.observable("");
    this.point = ko.observable("");
    this.content = ko.observable("");
    this.step = ko.observableArray();
};
var vm = new viewModel();
$(document).ready(function(){
    SwiftClick.attach(document.body);
    ko.applyBindings(vm);
    loadQuestions();
    MathJax.Hub.Config({
        extensions: ["tex2jax.js"],
        jax: ["input/TeX","output/HTML-CSS"],
        tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]},
        messageStyle: "none",
        showMathMenu: false,
        showMathMenuMSIE: false
    });
});
