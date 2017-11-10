/*
* 司机评价
* */
$(function(){
    getEchartsData ('js/chartData.json', 5, '{value}');
    var myChart1 = echarts.init(document.getElementById('driver'));
    var option1 = {
        title: {
            text: '司机状态',
            textStyle: {
                fontWeight: 'normal',
                fontSize: 16,
                color: '#666'
            },
            padding: [10,0,0,30]
        },
        tooltip: {
            axisPointer: {
                type: 'cross',
                animation: true,
                label: {
                    // backgroundColor: '#505765'
                }
            },
        },
        radar: {
            shape: 'polygon',
            startAngle: '120',
            name: {
                textStyle: {
                    color: '#999',
                    fontSize: 14
                }
            },
            splitNumber: 5,
            axisLabel: {
                show: true,
                color: '#666'
            },
            indicator: [
                { name: '文明行车', max: 5,},
                { name: '热心服务', max: 5},
                { name: '着装整齐', max: 5},
                { name: '态度好', max: 5},
                { name: '驾驶平稳', max: 5},
                { name: '按站停靠', max: 5}
            ]
        },
        series: [{
            type: 'radar',
            symbol: 'none',     // 去掉圆点
            areaStyle: {
                normal: {
                    color: '#1ab394'
                }
            },
            lineStyle: {
                normal: {
                    color: '#1ab394',
                    opacity: 0.3,
                    type: 'solid'
                }
            },
            data : [
                {
                    value : [2, 4, 5, 2, 4, 1]
                }
            ]
        }]
    };

    myChart1.setOption(option1);

});