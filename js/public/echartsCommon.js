 $(function(){
    var option = {
        id: 'test',
        url: '',
        title: '候车时长与满意度分时趋势',
        legendData: [
            {name: '水电费', icon: 'rect'},
            {name: '离开', icon: 'rect'}
        ],
        ydata: [
            {
                splitLine:{show: true},
                type: 'value',
                max: 15,
                axisLabel: {
                    formatter: '{value}%'
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
        seriesNumber: 1,
        seriesFirstData: [
            {
                name: '水电费',
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
                data: [3,4,4.5, 3.6,3.8,3.2, 2.8, 3, 3.4]
            }
        ],
        seriesSecondData: [
            {
                name:'水电费',
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
                data: [3,4,4.5, 3.6,3.8,3.2, 2.8, 3, 3.4]
            },
            {
                //polarIndex: 0,
                name: '离开',
                type:'line',
                //yAxisIndex: 1,
                //step: 'end',
                // areaStyle: {normal: {}},
                itemStyle : {
                    normal : {
                        color: '#999',
                        lineStyle: {
                            color: '#999'
                        }
                    }
                },
                data: [3.3, 3.5, 4.1, 4.3, 3.5, 3, 2.5, 3.3, 3.6]
            }
        ]
    };
    var od = new GetData(option);
});

function GetData(option) {
    this.id = option.id;
    this.url = option.url;
    this.title = option.title;
    this.titleColor = option.titleColor || '#666';          // 默认是#666，
    this.legendData = option.legendData || [
        {name: '客流', icon: 'rect'},
        {name: '运力', icon: 'rect'}
    ];
    this.YData = option.ydata ||  [
        {
            splitLine:{show: true},
            type: 'value',
            max: 5
        },
        {
            type: 'value',
            max: 25,
            nameLocation: 'start'
        }
    ];
    this.SeriesData = option.seriesNumber == 1 ? option.seriesFirstData : option.seriesSecondData || [
        {
            name:option.legendData[0].name,
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
            data: [3,4,4.5, 3.6,3.8,3.2, 2.8, 3, 3.4]
        },
        {
            //polarIndex: 0,
            name:option.legendData[1].name,
            type:'line',
            //yAxisIndex: 1,
            //step: 'end',
            // areaStyle: {normal: {}},
            itemStyle : {
                normal : {
                    color: '#999',
                    lineStyle: {
                        color: '#999'
                    }
                }
            },
            data: [3.3, 3.5, 4.1, 4.3, 3.5, 3, 2.5, 3.3, 3.6]
        }
    ];
    this.init();
}

GetData.prototype.init = function () {
    this.myChart = echarts.init(document.getElementById(this.id));
    option = {
        title: {
            text: this.title,
            textStyle: {
                color: this.titleColor
            },
            left: '10%'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                animation: true,
                label: {
                    backgroundColor: '#505765'
                }
            },
        },
        legend: {
            data: this.legendData,
            right: '10%',
            itemGap: 50,
            itemWidth: 50
        },
        xAxis : [
            {
                splitLine:{show: true},
                type : 'category',
                boundaryGap : false,
                data : ["06:00", "08:00", "10:00","12:00","14:00","16:00","18:00","20:00","22:00"]
            }
        ],
        yAxis: this.YData,
        series: this.SeriesData
    };
    this.myChart.setOption(option);
};