/**
 * Created by hjy on 2016/9/18 0018.
 */

function selectNowNum(){
    vm.mainBtn(true);
    $(".numOut").each(function(){
        $(this).css("backgroundColor","#c5cae8");
    });
    $("#nowQuestion").css("backgroundColor","#5c6bc0");
    $(".question").html(vm.nowQuestion().content.replace(/\$\$/g,'\$'));
    $(".options").empty();
    for(var i=0;i<vm.nowQuestion().choice.length;i++){
        $(".options").append("<div class=\"option\" onclick=\"selectOption(this,'"+ i +"')\">"+
            "<img src='images/selectOut.png'><span class='optionText'>"+ vm.nowQuestion().choice[i].content.replace(/\$\$/g,'\$') +"</span></div>");
    }
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"],function(){});
    $(".mainBtn").css("backgroundColor","#5c6bc0");
    $("#btnText").text("查看题干");
    $(".mainBtn").unbind("click");
    $(".mainBtn").bind("click",mainQuestion);
}

function selectQuestion(obj){
    vm.mainBtn(false);
    $(".numOut").each(function(){
       $(this).css("backgroundColor","#c5cae8");
    });
    $(obj).css("backgroundColor","#5c6bc0");
    $("#nowQuestion").css("backgroundColor","#c5cae8");
    var question = vm.answeredQuestions()[vm.answeredQuestions().length-$(obj).text()];
    $(".question").html(question.content.replace(/\$\$/g,'\$'));
    $(".options").empty();
    for(var i=0;i<question.choice.length;i++){
        if(i == question.choice_num){
            $(".options").append("<div class=\"option\" style='background-color: rgb(92, 107, 192); color: white;'>"+
                "<img src='images/selectIn.png'><span class='optionText'>"+ question.choice[i].content.replace(/\$\$/g,'\$') +"</span></div>");
        }else{
            $(".options").append("<div class=\"option\">"+
                "<img src='images/selectOut.png'><span class='optionText'>"+ question.choice[i].content.replace(/\$\$/g,'\$') +"</span></div>");
        }
    }
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"],function(){});
}

function selectOption(obj,choice_num){
    objAll = obj;
    vm.choice_num(choice_num);
    var color = $(obj).css("backgroundColor");
    if("rgb(240, 242, 246)"==$(obj).css("backgroundColor")){ //选中当前选项
        $(".option").each(function(){
            $(this).css({"backgroundColor":"#f0f2f6","color":"#828b97"});
            $(this).find("img").attr("src","images/selectOut.png");
        })
        $(obj).css({"backgroundColor":"#5c6bc0","color":"white"});
        $(obj).find("img").attr("src","images/selectIn.png");
        $(".mainBtn").css("backgroundColor","#51e08b");
        $("#btnText").text("提交");
        $(".mainBtn").unbind("click");
        $(".mainBtn").bind("click",subAsk);
    }else{ //取消选中当前选项
        $(objAll).css({"backgroundColor":"#f0f2f6","color":"#828b97"});
        $(objAll).find("img").attr("src","images/selectOut.png");
        $(".mainBtn").css("backgroundColor","#5c6bc0");
        $("#btnText").text("查看题干");
        $(".mainBtn").unbind("click");
        $(".mainBtn").bind("click",mainQuestion);
    }
    if($(".footer").attr("class").indexOf("showMainQuestion")>=0){
        $(".footer").removeClass("showMainQuestion");
        $(".footer").addClass("hiddenMainQuestion");
        setTimeout(function(){
            $(".mainQuestion").css("display","none");
        },200);
    }
}

function mainQuestion(){
    if($(".footer").attr("class").indexOf("showMainQuestion")>=0){
        $(".footer").removeClass("showMainQuestion");
        $(".footer").addClass("hiddenMainQuestion");
        setTimeout(function(){
            $(".mainQuestion").css("display","none");
        },200);
    }else{
        $(".footer").removeClass("hiddenMainQuestion");
        $(".mainQuestion").css("display","block");
        $(".footer").addClass("showMainQuestion");
    }
}

function subAsk(){
    if(!optionSelected) {
        askApi();
        optionSelected = true;
        var choice = vm.nowQuestion().choice[vm.choice_num()];
        if (choice.action == "next") {  //跳至下一题
            if (choice.correct == true) {
                $(".note").html("<img class='noteImg' src='images/right.png'>");
                $(".note").show();
                $(".note").addClass("animated bounceInDown");
                setTimeout(function () {
                    $(".note").removeClass("animated bounceInDown");
                    $(".note").hide();
                    optionSelected = false;
                    vm.next_id(choice.next);
                    vm.nowQuestion().choice_num = vm.choice_num();
                    vm.nowQuestion().num = vm.answeredQuestions().length+1;
                    vm.answeredQuestions.unshift(vm.nowQuestion());
                    loadQuestion();
                }, 2000);
            } else if (choice.correct == false) {
                $(".note").html("<img class='noteImg' src='images/wrong.png'>");
                $(".note").show();
                $(".note").addClass("animated bounceInDown");
                setTimeout(function () {
                    optionSelected = false;
                    $(".note").removeClass("animated bounceInDown");
                    $(".note").hide();
                }, 2000);
            }
        } else if (choice.action == "question") {  //提示审题
            $(".note").html("<img class='noteImg' src='images/wrongAgain.png'>");
            $(".note").show();
            $(".note").addClass("animated bounceInDown");
            setTimeout(function () {
                optionSelected = false;
                $(".note").removeClass("animated bounceInDown");
                $(".note").hide();
                $(objAll).css({"backgroundColor":"#f0f2f6","color":"#828b97"});
                $(objAll).find("img").attr("src","images/selectOut.png");
                $(".mainBtn").css("backgroundColor","#5c6bc0");
                $("#btnText").text("查看题干");
                $(".mainBtn").unbind("click");
                $(".mainBtn").bind("click",mainQuestion);
            }, 2000);
        } else if (choice.action == "hint") {  //显示提示
            $(".note").html("<div style='width: 100%'>" +
                "<img class='noteImg' src='images/note.png'>" +
                "<div id='noteText' class='noteText'>" + choice.hint + "</div>" +
                "<div class='noteBtn' onclick='closeNote()'>我知道了</div>" +
                "</div>");
            $(".note").show();
            $(".note").addClass("animated bounceInDown");
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, "noteText"]);
        } else if (choice.action == "result") {  //最后一题 跳至结果页
            window.location.href = "result.html";
        }
    }
}

function askApi(){
    $.ajax(
        {
            type : "POST",
            async : true,
            url : "/rest/s/study/exercise/"+ sessionStorage.getItem("e_id") +"/check",
            dataType : 'json',
            data: {
                choice_id: vm.nowQuestion().choice[vm.choice_num()].choice_id,
                q_id: vm.nowQuestion().q_id
            },
            beforeSend: function(request) {
                request.setRequestHeader("auth", window.btoa("access_token="+vm.access_token()));
            },
            success : function(data, textStatus, jqXHR) {
            },
            error : function(jqXHR, textStatus, errorThrown) {
                util.errorCodeApi(jqXHR.responseJSON);
            }
        }
    );
}

function closeNote(){
    optionSelected = false;
    $(".note").removeClass("animated bounceInDown");
    $(".note").hide();
    $(objAll).css({"backgroundColor":"#f0f2f6","color":"#828b97"});
    $(objAll).find("img").attr("src","images/selectOut.png");
    $(".mainBtn").css("backgroundColor","#5c6bc0");
    $("#btnText").text("查看题干");
    $(".mainBtn").unbind("click");
    $(".mainBtn").bind("click",mainQuestion);
}
function loadQuestion(){
    $.ajax(
        {
            type : "GET",
            async : true,
            url : "/rest/s/study/question/"+ vm.next_id(),
            dataType : 'json',
            beforeSend: function(request) {
                request.setRequestHeader("auth", window.btoa("access_token="+vm.access_token()));
            },
            success : function(data, textStatus, jqXHR) {
                $(".question").html(data.info.content.replace(/\$\$/g,'\$'));
                $(".options").empty();
                for(var i=0;i<data.info.choice.length;i++){
                    $(".options").append("<div class=\"option\" onclick=\"selectOption(this,'"+ i +"')\">"+
                        "<img src='images/selectOut.png'><span class='optionText'>"+ data.info.choice[i].content.replace(/\$\$/g,'\$') +"</span></div>");
                }
                MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main"],function(){});
                vm.nowQuestion(data.info);
                $(".mainBtn").css("backgroundColor","#5c6bc0");
                $("#btnText").text("查看题干");
                $(".mainBtn").unbind("click");
                $(".mainBtn").bind("click",mainQuestion);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                util.errorCodeApi(jqXHR.responseJSON);
            }
        }
    );
}

var viewModel = function() {
    this.answeredQuestions = ko.observableArray();
    this.nowQuestion = ko.observable();
    this.choice_num = ko.observable();
    this.mainBtn = ko.observable(true);
    this.sec_id = ko.observable(sessionStorage.getItem("sec_id"));
    this.next_id = ko.observable(sessionStorage.getItem("next_id"));
    this.e_id = ko.observable(sessionStorage.getItem("e_id"));
    this.access_token = ko.observable(sessionStorage.getItem("access_token"));
};
var vm = new viewModel();
var optionSelected = false;
var objAll = "";
$(document).ready(function(){
    FastClick.attach(document.body);
    ko.applyBindings(vm);
    $(".mainQuestion").html(sessionStorage.getItem("mainQuestion"));
    MathJax.Hub.Config({
        extensions: ["tex2jax.js"],
        jax: ["input/TeX","output/HTML-CSS"],
        tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]},
        messageStyle: "none"
    });
    MathJax.Hub.Queue(function(){
        MathJax.Hub.Queue(["Typeset",MathJax.Hub, "mainQuestion"],function(){
            $(".mainQuestion").css("display","none");
        });
    });
    loadQuestion();
    document.title = sessionStorage.getItem("sec_title");
});