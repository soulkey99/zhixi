/**
 * Created by hjy on 2016/5/6 0006.
 */

function getExerciseReview(){
    $.ajax(
        {
            type : "GET",
            async : true,
            url : "/rest/s/homework/"+ sessionStorage.getItem("swork_id") +"/question/"+ sessionStorage.getItem("q_id") +"/review",
            dataType : 'json',
            beforeSend: function(request) {
                request.setRequestHeader("auth", window.btoa("access_token="+ sessionStorage.getItem("access_token")));
            },
            success : function(data, textStatus, jqXHR) {
                vm.reviewList(data.info.list);
                vm.rootReview(data.info.root);
                MathJax.Hub.Queue(["Typeset",MathJax.Hub, "questionText"]);
                MathJax.Hub.Queue(["Typeset",MathJax.Hub, "content"]);
                MathJax.Hub.Queue(function(){
                    $("body").css("visibility","visible");
                    $("body").addClass("animated fadeIn");
                    $("body").removeClass("animated fadeIn");
                });
            },
            error : function(jqXHR, textStatus, errorThrown) {
                util.errorCodeApi(jqXHR.responseJSON);
            }
        }
    );
}

function goBack(){
    window.location.href = 'resultWork.html';
}

var viewModel = function() {
    this.reviewList = ko.observableArray();
    this.rootReview = ko.observable("");
};
var vm = new viewModel();
$(document).ready(function() {
    FastClick.attach(document.body);
    ko.applyBindings(vm);
    MathJax.Hub.Config({
        tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]},
        showProcessingMessages: false,
        messageStyle: "none",
        "HTML-CSS": {
            linebreaks: {
                automatic: true,
                width: "container"
            },
            styles: {
                ".MathJax_Display": {
                    "text-align": "center",
                    margin: "1em 0em",
                    display: "-webkit-inline-box !important"
                }
            }
        }
    });
    getExerciseReview();
});