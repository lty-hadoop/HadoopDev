/*
* 满载率与拥挤满意度
* */
$(function() {
    var myChart = echarts.init(document.getElementById('full-load-rate'));

    $.get('js/chartData.json', function (data) {
        option = {
            data: [],
            title: {
                text: '候车时长与满意度分时趋势',
                textStyle: {
                    color: '#666'
                },
                left: '6%'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: false,
                    label: {
                        backgroundColor: '#505765'
                    }
                },
                // formatter: function (obj) {
                //     var value = obj.value;
                //     return value
                // }
            },
            legend: {
                data: [
                    {name: '舒适满意度', icon: 'rect'},
                    {name: '满载率', icon: 'rect'},
                    {name: '发车间隔', icon: 'rect'}
                ],
                right: '10%',
                itemGap: 35,
                itemWidth: 50
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,

                    // axisLine: {onZero: false},
                    data: ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    max: 100,
                    axisLabel: {
                        formatter: '{value}/kg'
                    }
                },
                {
                    type: 'value',
                    max: 25,
                    nameLocation: 'start',
                    axisLabel: {
                        formatter: '{value}/min'
                    }
                }
            ],
            series: [
                {
                    name: '舒适满意度',
                    type: 'line',
                    areaStyle: {
                        normal: {
                            color: '#e4f6f2'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#3c9',
                            lineStyle: {
                                color: '#3c9'
                            }
                        }
                    },
                    data: data[0].degree
                },
                {
                    polarIndex: 0,
                    name: '满载率',
                    type: 'line',
                    yAxisIndex: 1,
                    step: 'end',
                    // areaStyle: {normal: {}},
                    itemStyle: {
                        normal: {
                            color: '#ff0000',
                            lineStyle: {
                                color: '#ff0000'
                            }
                        }
                    },
                    data: data[0].waiting
                },
                {
                    name:'发车间隔',
                    type:'line',
                    animation: true,
                    // areaStyle: {normal: {}},
                    itemStyle: {
                        normal: {
                            color: '#999',
                            lineStyle: {
                                color: '#999'
                            }
                        }
                    },
                    data: [44,25,76,63,14,28,41,53,62,48,53,62,47,82]
                }
            ]
        };

        for (var n = 0; n < data.length; n++) {
            //console.log(data[n])
            option.data.push({
                series: {
                    data: data[n]
                }
            });
        }

        myChart.setOption(option);
    })

    contrast('说明：满载率与舒适满意度呈现反比趋势');

    //日期控件
    var start = {
        format: 'YYYY-MM-DD hh:mm:ss',
        maxDate: $.nowDate({DD:0}), //最大日期
        okfun: function(obj){
            end.minDate = obj.val; //开始日选好后，重置结束日的最小日期
            endDates();
            console.log(end.minDate)
        }
    };
    var end = {
        format: 'YYYY-MM-DD hh:mm:ss',
        minDate: $.nowDate({DD:0}), //设定最小日期为当前日期
        okfun: function(obj){
            start.maxDate = obj.val; //将结束日的初始值设定为开始日的最大日期
            console.log(start.maxDate)
        }
    };
//这里是日期联动的关键
    function endDates() {
        //将结束日期的事件改成 false 即可
        end.trigger = false;
        $("#test1").jeDate(end);
    }
    $('#test').jeDate(start);
    $('#test1').jeDate(end);

    console.log(end.minDate);
});

function contrast(title) {
    var contrast = echarts.init(document.getElementById('contrast-chart'));
    option = {
        title: {
            text: title,
            textStyle: {
                color: '#999',
                fontSize: 16,
                fontWeight: 'normal'
            },
            bottom: 2,
            padding: [0,0,0,60]
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#505765'
                }
            },
        },
        grid: {
            containLabel: true
        },
        xAxis : [
            {
                name: '舒适满意度',
                nameLocation: 'center',
                nameTextStyle: {
                    color: '#999',
                    fontSize: 14,
                    padding: [0,0,0,420]
                },
                type : 'category',
                boundaryGap : false,
                // axisLine: {onZero: false},
                data : ['1','2','3','4']
            }
        ],
        yAxis: [
            {
                name: '满载率',
                type: 'value',
                nameTextStyle: {
                    color: '#999',
                    fontSize: 14,
                    padding: [0,0,0,0]
                },
                data: []
            }
        ],
        series : [
            {
                name:'候车满意度',
                type:'line',
                areaStyle: {
                    normal: {
                        color: '#e4f6f2'
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#3c9',
                        lineStyle: {
                            color: '#3c9'
                        }
                    }
                },
                data: [80,60,30,10]
            }
        ]
    };

    contrast.setOption(option);
}