/**
 * Created by hjy on 2016/5/4 0004.
 */

function getExerciseResult(){
    $.ajax(
        {
            type : "GET",
            async : true,
            url : "/rest/s/study/exercise/"+ sessionStorage.getItem("e_id") +"/result",
            //url : "/rest/s/study/exercise/58009819ad6aaa9e01f708be/result",
            dataType : 'json',
            beforeSend: function(request) {
                request.setRequestHeader("auth", window.btoa("access_token="+ sessionStorage.getItem("access_token")));
                //request.setRequestHeader("auth", window.btoa("access_token=f8a0236e2f8974e87724e4d48789cc71b7c39b99a711bd0b"));
            },
            success : function(data, textStatus, jqXHR) {
                vm.percent(data.info.percent);
                $(".subjectDiv").css("height",$(window).height()*0.25 + "px");
                $(".progressDiv").css("height",$(window).height()*0.49 + "px");
                $(".resultDiv").css("height",$(window).height()*0.2 + "px");
                $(".menuDiv").css("height",$(window).height()*0.06 + "px");
                $("body").css("visibility","visible");
                $("body").addClass("animated fadeIn");
                var opts = {
                    lines: 12, // The number of lines to draw
                    angle: 0.35, // The length of each line
                    lineWidth: 0.03, // The line thickness
                    pointer: {
                        length: 0.9, // The radius of the inner circle
                        strokeWidth: 0.035, // The rotation offset
                        color: '#5db2f4' // Fill color
                    },
                    limitMax: 'false',   // If true, the pointer will not go past the end of the gauge
                    colorStart: '#5db2f4',   // Colors
                    colorStop: '#5db2f4',    // just experiment with them
                    strokeColor: '#eeeeee',   // to see which ones work best for you
                    generateGradient: true
                };
                var target = document.getElementById("progressCanvas"); // your canvas element
                var gauge = new Donut(target).setOptions(opts); // create sexy gauge!
                gauge.setTextField(document.getElementById("textfield"));
                gauge.maxValue = 100; // set max gauge value
                gauge.animationSpeed = 32; // set animation speed (32 is default value)
                if(parseInt(data.info.point) == 0){
                    gauge.set(0.00001);
                }else{
                    gauge.set(parseInt(data.info.point));
                }
                $("#progressCanvas").css("width",$(window).width());
                $("#progressCanvas").css("height","auto");
                $(".peopleNum").hide();
                $(".resultDiv").find("img").hide();
                var x = 0, time = 200;
                setInterval(function(){
                    if(time > 0){
                        $(".world").css("backgroundPosition", x + "px 0px");
                        x -= time/10;
                        time -= 1;
                    }else{
                        $(".world").css("backgroundPosition", x + "px 0px");
                        x -= 1;
                        time -= 1;
                    }
                    if(time == 0){
                        $(".peopleNum").show();
                        $(".peopleNum").addClass("animated tada");
                        setTimeout(function(){
                            $(".resultDiv").find("img").show();
                            $(".resultDiv").find("img").addClass("animated tada");
                        },1000);
                    }
                }, 5);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                util.errorCodeApi(jqXHR.responseJSON);
            }
        }
    );
}

function toReview(){
    window.location.href = "review.html";
}

function nextQuestion(){
    $.ajax(
        {
            type : "GET",
            async : true,
            url : "/rest/s/study/section/"+ sessionStorage.getItem("sec_id") +"/next",
            dataType : 'json',
            beforeSend: function(request) {
                request.setRequestHeader("auth", window.btoa("access_token="+ sessionStorage.getItem("access_token")));
            },
            success : function(data, textStatus, jqXHR) {
                if(data.info == {}){
                    $.ajax(
                        {
                            type : "GET",
                            async : true,
                            url : "/rest/s/study/section/"+ sessionStorage.getItem("sec_id") +"/nextSection",
                            dataType : 'json',
                            beforeSend: function(request) {
                                request.setRequestHeader("auth", window.btoa("access_token="+ sessionStorage.getItem("access_token")));
                            },
                            success : function(data, textStatus, jqXHR) {
                                if(data.info.sec_id == ""){
                                    $(".title").text("本册完成");
                                    $(".classBg").text(sessionStorage.getItem("grade"));
                                    $(".className").text(sessionStorage.getItem("title"));
                                    $(".oneBtn").css("display","block");
                                    $(".twoBtn").css("display","none");
                                }else{
                                    $(".title").text("本节完成");
                                    $(".classBg").text("下一节");
                                    $(".className").text(data.info.cha_title);
                                    $(".oneBtn").css("display","none");
                                    $(".twoBtn").css("display","block");
                                    sessionStorage.setItem("sec_id",data.info.sec_id);
                                }
                            },
                            error : function(jqXHR, textStatus, errorThrown) {
                                util.errorCodeApi(jqXHR.responseJSON);
                            }
                        }
                    );
                }else{
                    sessionStorage.setItem("sec_id",data.info.sec_id);
                    window.location.href = "mainQuestion.html";
                }
                $(".bg,.dialog").css("display","block");
            },
            error : function(jqXHR, textStatus, errorThrown) {
                util.errorCodeApi(jqXHR.responseJSON);
            }
        }
    );
}

function gotoNext(){
    window.location.href = "mainQuestion.html";
}

function closeDialog(){
    $(".bg,.dialog").css("display","none");
}

function submit(){
    alert("关闭webview");
}

function goBack(){
    window.location.href = 'selectChapter.html';
}

var viewModel = function() {
    this.percent = ko.observable("");
};
var vm = new viewModel();
$(document).ready(function(){
    FastClick.attach(document.body);
    ko.applyBindings(vm);
    getExerciseResult();
    $(".knowledge").text(sessionStorage.getItem("sec_title"));
    $(".subject").text(sessionStorage.getItem("grade")+sessionStorage.getItem("subject"));
});