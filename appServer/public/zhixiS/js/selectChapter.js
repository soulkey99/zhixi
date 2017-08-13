/**
 * Created by hjy on 2016/9/12 0012.
 */

function loadChapter(){
    $.ajax(
        {
            type : "GET",
            async : true,
            url : "/rest/s/study/version/"+ sessionStorage.getItem("ver_id") +"/catalog",
            dataType : 'json',
            beforeSend: function(request) {
                request.setRequestHeader("auth", window.btoa("access_token="+ sessionStorage.getItem("access_token")));
            },
            success : function(data, textStatus, jqXHR) {
                vm.chapter(data.list);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                util.errorCodeApi(jqXHR.responseJSON);
            }
        }
    );
}

function loadBookInfo(){
    $.ajax(
        {
            type : "GET",
            async : true,
            url : "/rest/s/study/version/"+ sessionStorage.getItem("ver_id") +"/detail",
            dataType : 'json',
            beforeSend: function(request) {
                request.setRequestHeader("auth", window.btoa("access_token="+ sessionStorage.getItem("access_token")));
            },
            success : function(data, textStatus, jqXHR) {
                vm.title(data.info.title);
                vm.intro(data.info.intro);
                vm.cover(data.info.cover);
                vm.ver_id(data.info.ver_id);
                sessionStorage.setItem("version",data.info.version);
                sessionStorage.setItem("grade",data.info.grade);
                sessionStorage.setItem("title",data.info.title);
                sessionStorage.setItem("subject",data.info.subject);
                loadProgress();
            },
            error : function(jqXHR, textStatus, errorThrown) {
                util.errorCodeApi(jqXHR.responseJSON);
            }
        }
    );
}

function loadProgress(){
    $.ajax(
        {
            type : "GET",
            async : true,
            url : "/rest/s/study/version/"+ sessionStorage.getItem("ver_id") +"/process",
            dataType : 'json',
            beforeSend: function(request) {
                request.setRequestHeader("auth", window.btoa("access_token="+ sessionStorage.getItem("access_token")));
            },
            success : function(data, textStatus, jqXHR) {
                for(var i=0;i<data.info.catalog.length;i++){
                    if(data.info.catalog[i].total == 0){
                        $("#"+data.info.catalog[i].cha_id).text(0);
                        $("#"+data.info.catalog[i].cha_id+"p").animate({width:"0%"});

                    }else{
                        $("#"+data.info.catalog[i].cha_id).text(Math.round(data.info.catalog[i].finish/data.info.catalog[i].total));
                        $("#"+data.info.catalog[i].cha_id+"p").animate({width:Math.round(data.info.catalog[i].finish/data.info.catalog[i].total)+"%"});
                    }
                    for(var j=0;j<data.info.catalog[i].sections.length;j++){
                        $("#"+data.info.catalog[i].sections[j].sec_id+"f").text(data.info.catalog[i].sections[j].finish);
                        $("#"+data.info.catalog[i].sections[j].sec_id+"t").text(data.info.catalog[i].sections[j].total);
                    }
                }
            },
            error : function(jqXHR, textStatus, errorThrown) {
                util.errorCodeApi(jqXHR.responseJSON);
            }
        }
    );
}

function selectChapter(){
    sessionStorage.setItem("sec_id",this.sec_id);
    sessionStorage.setItem("sec_title",this.title.substring(1,this.title.length));
    window.location.href = "mainQuestion.html";
}

function ctrlSection(obj){
    var display = $(obj).next().css("display");
    if(display == "none"){
        $(obj).find("img").eq(0).prop("src","images/upArrow.png");
        $(obj).next().slideDown();
    }else{
        $(obj).find("img").eq(0).prop("src","images/downArrow.png");
        $(obj).next().slideUp();
    }
}
var viewModel = function() {
    this.chapter = ko.observableArray();
    this.title = ko.observable("");
    this.intro = ko.observable("");
    this.cover = ko.observable("");
    this.ver_id = ko.observable("");
    this.selectChapter = selectChapter;
};
var vm = new viewModel()
    ,access_token = util.getQueryString("access_token")
    ,ver_id = util.getQueryString("ver_id");
//access_token = "8b264331138b2f47dbb7cb6f4bf2e47d89e8157e2568f95d";
//ver_id = "5786e9f086bd1c8379152247";
if(access_token!=null && ver_id!=null){
    sessionStorage.setItem("access_token",access_token);
    sessionStorage.setItem("ver_id",ver_id);
}
$(document).ready(function(){
    FastClick.attach(document.body);
    ko.applyBindings(vm);
    loadChapter();
    loadBookInfo();
});