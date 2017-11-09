/*
* 司机评价
* */
$(function(){
    getEchartsData ('js/chartData.json', 5, '{value}');
    var myChart1 = echarts.init(document.getElementById('driver'));
    var option1 = {
        title: {
            text: '司机状态'
        },
        tooltip: {},
        legend: {},
        radar: {
            // shape: 'circle',
            name: {
                textStyle: {
                    color: '#fff',
                    backgroundColor: '#999',
                    borderRadius: 3,
                    padding: [3, 5]
                }
            },
            indicator: [
                { name: '销售（sales）', max: 6500},
                { name: '管理（Administration）', max: 16000},
                { name: '信息技术（Information Techology）', max: 30000},
                { name: '客服（Customer Support）', max: 38000},
                { name: '研发（Development）', max: 52000},
                { name: '市场（Marketing）', max: 25000}
            ]
        },
        series: [{
            name: '预算 vs 开销（Budget vs spending）',
            type: 'radar',
            // areaStyle: {normal: {}},
            data : [
                {
                    value : [4300, 10000, 28000, 35000, 50000, 19000],
                    name : '预算分配（Allocated Budget）'
                }
            ]
        }]
    };

    myChart1.setOption(option1);

});