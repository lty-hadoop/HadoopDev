/*
* 第一个参数YLnumber     表示左侧y轴的最大值
* 第二个参数symbol       表示y轴的单位
* 第三个桉树array        表示要显示的图例组件名字，没有则传[]，有则传[{},{}]
* */
function getEchartsData (url, YLnumber, symbol, array) {
    var myChart = echarts.init(document.getElementById('carzxt'));

    $.get(url, function(data){
        option = {
            data:[],
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
                },
                // formatter: function (obj) {
                //     var value = obj.value;
                //     return value
                // }
            },
            legend: {
                data: array,
                right: '10%',
                itemGap: 35,
                itemWidth: 50
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,

                    // axisLine: {onZero: false},
                    data : ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    max: YLnumber,
                    axisLabel: {
                        formatter: symbol
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
                    data: data[0].degree
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
                    data: data[0].waiting
                }
                // {
                //     name:'候车状况',
                //     type:'line',
                //     animation: true,
                //     // areaStyle: {normal: {}},
                //     data: [44,25,76,63,14,28,41,53,62,48,53,62,47,82]
                // }
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

        //console.log(data[0].waiting)
        myChart.setOption(option);
    })
}