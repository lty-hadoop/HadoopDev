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
                color: this.titleColor,
                fontWeight: 'normal',
                fontSize:16
            },
            left: '8%'
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
                data : ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
            }
        ],
        yAxis: this.YData,
        series: this.SeriesData
    };
    this.myChart.setOption(option);
};
GetData.prototype.setOption = function(data){
    this.myChart.setOption(data);
}