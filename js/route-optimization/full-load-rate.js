/*
* 满载率与拥挤满意度
* */
$(function() {

    var $fullloadrate = $('.full-load-rate');

    var myChart = echarts.init(document.getElementById('full-load-rate'));
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
                }
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
                    data: ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}/%'
                    }
                },
                {
                    type: 'value',
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
                    data:[]
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
                    data: []
                },
                {
                    name:'发车间隔',
                    type:'line',
                    animation: true,
                    itemStyle: {
                        normal: {
                            color: '#999',
                            lineStyle: {
                                color: '#999'
                            }
                        }
                    },
                    data: []
                }
            ]
        };
        myChart.setOption(option);
    var theadArr = [{name:'线路',field: 'line_name'},
        { name:'分时范围',field: 'timeArr'},
        {name:'上车人数', field: 'up_num'},
        { name:'运力',field: 'shipping_ability'},
        { name:'下车人数', field: 'down_num'},
        {name:'平均发车间隔', field: 'waiting_duration'},
        {name:'舒适度', field: 'full_loadratio'},
        {name:'满载率', field: 'ride_satisfaction'}
    ];
    $fullloadrate.setSelecteTable({'fn':setEchartsData,'theadArr':theadArr});
    //设置echarts数据
    function setEchartsData(data){
        console.log(data)
        var maxWaiting = 0;
        var resData = {};
        resData.degree　= [];
        resData.waiting = [];
        resData.comfort = [];
        var res = data['resPonse']['satisfactionList'];
        $.each(res,function(index,value){
            resData.degree.push((value['full_loadratio']*100).toFixed(0));
            resData.waiting.push(value['waiting_duration']);
            resData.comfort.push((value['ride_satisfaction']*100).toFixed(0));
            if(maxWaiting<value['waiting_duration']){
                maxWaiting = value['waiting_duration'];
            }
        });
        //舒适满意度
        //满载率
        myChart.setOption({
            yAxis:[{
                max:100
            },{
                max:maxWaiting
            }],
            series: [{
                data: resData.degree
            },{
                data: resData.comfort
            },{
                data: resData.waiting
            }
            ]
        });
    }
    contrast('说明：满载率与舒适满意度呈现反比趋势');
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
});

