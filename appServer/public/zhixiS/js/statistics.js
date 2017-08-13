/**
 * Created by hjy on 2016/11/29 0029.
 */

function loadStatisticsInfo(access_token){
    $.ajax(
        {
            type : "GET",
            async : true,
            url : "/rest/s/stat",
            dataType : 'json',
            beforeSend: function(request) {
                request.setRequestHeader("auth", window.btoa("access_token="+ access_token));
            },
            success : function(data, textStatus, jqXHR) {
                var refresh = false;
                if(vm.total() != data.info.questions.total){
                    vm.total(data.info.questions.total);
                    refresh = true;
                }
                if(vm.perfect() != data.info.questions.perfect){
                    vm.perfect(data.info.questions.perfect);
                    refresh = true;
                }
                if(vm.excellent() != data.info.questions.excellent){
                    vm.excellent(data.info.questions.excellent);
                    refresh = true;
                }
                if(vm.pass() != data.info.questions.pass){
                    vm.pass(data.info.questions.pass);
                    refresh = true;
                }
                if(vm.fail() != data.info.questions.fail){
                    vm.fail(data.info.questions.fail);
                    refresh = true;
                }
                if(refresh){
                    initCharts();
                }
            },
            error : function(jqXHR, textStatus, errorThrown) {
                util.errorCodeApi(jqXHR.responseJSON);
            }
        }
    );
}

function initCharts(){
    var myChart = echarts.init(document.getElementById('main'));
    var option = {
        title: {
            show: false
        },

        tooltip : {
            show: false,
            trigger: 'item',
            formatter: "{b}({d}%)"
        },

        series : [
            {
                name:'',
                type:'pie',
                radius : '65%',
                center: ['50%', '45%'],
                data:[
                    {value: vm.perfect(), name:'完美',
                        itemStyle: {
                            normal: {
                                color: '#f968f1'
                            }
                        }
                    },
                    {value: vm.excellent(), name:'优秀',
                        itemStyle: {
                            normal: {
                                color: '#6ae1f3'
                            }
                        }
                    },
                    {value: vm.pass(), name:'及格',
                        itemStyle: {
                            normal: {
                                color: '#4289ff'
                            }
                        }
                    },
                    {value: vm.fail(), name:'不及格',
                        itemStyle: {
                            normal: {
                                color: '#4759bd'
                            }
                        }
                    }
                ].sort(function (a, b) { return a.value - b.value}),
                roseType: 'true',
                label: {
                    normal: {
                        textStyle: {
                            color: '#535860'
                        },
                        formatter: '{d}%'
                    }
                },
                labelLine: {
                    normal: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        },
                        smooth: 0.2,
                        length: 5,
                        length2: 10
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
}

var viewModel = function() {
    this.total = ko.observable(0);
    this.perfect = ko.observable(0);
    this.excellent = ko.observable(0);
    this.pass = ko.observable(0);
    this.fail = ko.observable(0);
};
var vm = new viewModel();
var access_token = util.getQueryString("access_token");
$(document).ready(function(){
    SwiftClick.attach(document.body);
    ko.applyBindings(vm);
    loadStatisticsInfo(access_token);
});