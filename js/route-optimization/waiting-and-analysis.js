/*
* 候车时长与满意度分析
* */
$(function(){
    getEchartsData ('js/chartData.json', 100, '{value}%',[
        {name: '候车满意度', icon: 'rect'},
        {name: '候车时长', icon: 'rect'}
    ]);
    contrast('说明：候车时长与候车满意度呈现反比趋势')
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
                name: '候车时长',
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
                name: '候车满意度',
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