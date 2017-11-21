/*
* 候车时长与满意度分析
* */
$(function ($) {
    //先默认初始化echarts表格，待拿到数据直接赋值
    var myChart = echarts.init(document.getElementById('carzxt'));
    myChart.setOption({
        title: {
            text: '候车时长与满意度分时趋势',
            textStyle: {
                color: '#666'
            },
            left: '10%'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#505765'
                }
            }
        },
        legend: {
            data:[
                {name: '候车满意度', icon: 'rect'},
                {name: '候车时长', icon: 'rect'}
            ],
            right: '10%',
            itemGap: 35,
            itemWidth: 50
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
            }
        ],
        yAxis: [
            {
                type: 'value',
                max: 100,
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            {
                type: 'value',
                max: 120,
                nameLocation: 'start',
                axisLabel: {
                    formatter: '{value}/min'
                }
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
                data:[]
            },
            {
                polarIndex: 0,
                name:'候车时长',
                type:'line',
                yAxisIndex: 1,
                step: 'end',
                // areaStyle: {normal: {}},
                itemStyle : {
                    normal : {
                        color: '#999',
                        lineStyle: {
                            color: '#999'
                        }
                    }
                },
                data:[]
            }
        ]
    });
    var $waitingandanalysis = $('.waiting-and-analysis');
    $waitingandanalysis.setSelecteTable(setEchartsData);
    //设置echarts数据
    function setEchartsData(data){
        var maxWaiting = 0;
        var resData = {};
        resData.degree　= [];
        resData.waiting = [];
        var res = data['resPonse']['satisfactionList'];
        $.each(res,function(index,value){
            resData.degree.push(value['waiting_satisfaction']*100);
            resData.waiting.push(value['waiting_duration']);
            if(maxWaiting<value['waiting_duration']){
                maxWaiting = value['waiting_duration'];
            }
        });
        myChart.setOption({
            yAxis:[{
                max:100
            },{
                max:maxWaiting
            }],
            series: [{
                data: resData.degree
            },{
                data: resData.waiting
            }
            ]
        });
    }
});






//候车时长与候车满意度呈现反比趋势
contrast('说明：候车时长与候车满意度呈现反比趋势');
function contrast(title) {
    var contrast = echarts.init(document.getElementById('contrast-chart'));
    contrast.setOption({
        title: {
            text: title,
            textStyle: {
                color: '#999',
                fontSize: 16,
                fontWeight: 'normal'
            },
            bottom: 2,
            padding: [0, 0, 0, 60]
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#505765'
                }
            }
        },
        grid: {
            containLabel: true
        },
        xAxis: [
            {
                name: '候车时长',
                nameLocation: 'center',
                nameTextStyle: {
                    color: '#999',
                    fontSize: 14,
                    padding: [0, 0, 0, 420]
                },
                type: 'category',
                boundaryGap: false,
                // axisLine: {onZero: false},
                data: ['1', '2', '3', '4']
            }
        ],
        yAxis: [
            {
                name: '候车满意度',
                type: 'value',
                nameTextStyle: {
                    color: '#999',
                    fontSize: 14,
                    padding: [0, 0, 0, 0]
                },
                data: []
            }
        ],
        series: [
            {
                name: '候车满意度',
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
                data: [80, 60, 30, 10]
            }
        ]
    });
}