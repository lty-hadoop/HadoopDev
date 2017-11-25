/*
* 候车时长与满意度分析
* */
$(function ($) {clearInterval($.timerEcharts);
    clearInterval($.timerEcharts);
    $.timerEcharts = null;
    //先默认初始化echarts表格，待拿到数据直接赋值
    var myChart = echarts.init(document.getElementById('carzxt'));
    var contrast = echarts.init(document.getElementById('contrast-chart'));
    myChart.setOption({
        title: {
            text: '候车时长与满意度分时趋势',
            textStyle: {
                color: '#666'
            },
            left: '10%'
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
                {name: '候车满意度', icon: 'rect'},
                {name: '候车时长', icon: 'rect'}
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
                max: 100,
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            {
                type: 'value',
                nameLocation: 'start',
                axisLabel: {
                    formatter: '{value}/min'
                },
                //去掉y轴坐标线
                axisLine: {
                    show: false
                }
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
                symbol: 'circle',
                //让折线边的平滑
                // smooth: true,
                itemStyle: {
                    normal: {
                        color: '#3c9',
                        lineStyle: {
                            color: '#3c9'
                        }
                    }
                },
                data: []
            },
            {
                polarIndex: 0,
                name: '候车时长',
                type: 'line',
                yAxisIndex: 1,
                step: 'end',
                symbol: 'circle',
                //让折线边的平滑
                // smooth: true,
                // areaStyle: {normal: {}},
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
    });
    var $waitingandanalysis = $('.waiting-and-analysis');
    var theadArr = [{name: '线路', field: 'line_name'},
        {name: '分时范围', field: 'timeArr'},
        {name: '上车人数', field: 'up_num'},
        {name: '运力', field: 'shipping_ability'},
        {name: '下车人数', field: 'down_num'},
        {name: '平均发车时间', field: 'waiting_duration'},
        {name: '候车满意度', field: 'waiting_satisfaction'}
    ];
    $waitingandanalysis.setSelecteTable({'fn': setEchartsData, 'theadArr': theadArr, 'fn2': waitFn});

    //设置echarts数据
    function setEchartsData(data) {
        var ddddddata = [];
        var maxWaiting = 0;
        var resData = {};
        resData.degree = [];
        resData.waiting = [];
        var res = data['resPonse']['satisfactionList'];
        $.each(res, function (index, value) {
            resData.degree.push(value['waiting_satisfaction']);
            resData.waiting.push(value['waiting_duration']);
            if (maxWaiting < value['waiting_duration']) {
                maxWaiting = value['waiting_duration'];
            }
        });
        myChart.setOption({
            yAxis: [{
                max: 100,
            }, {
                max: maxWaiting
            }],
            series: [{
                data: resData.degree
            }, {
                data: resData.waiting
            }
            ]
        });
        var xAxisData = [];
        for(var i = 1;i<maxWaiting;i++){
            xAxisData.push(i);
        }
        var dataArr = resData.degree;
        dataArr.sort(function(a,b){
            return parseInt(b) - parseInt(a);
        });
        contrast.setOption({
            xAxis: [{
                data : xAxisData
            }
        ],
            series: [{
                data:dataArr
            }
            ]
        })
    }

    function waitFn(data) {
        // 候车时长与满意度统计
        //$.getPath

        $.ajax({
            url: $.getPath + '/WaitingDuratistics/list',
            type: 'GET',
            dataType: 'json',
            data: data,
            success: function (res) {
                $('.content-identical').html('');
                var res = res.resPonse.waitingDuratisticsList;
                res.map(function (elem, index) {
                    var state = '';
                    switch (elem.type) {
                        case 1:
                            state = "高峰";
                            break;
                        case 2:
                            state = "平峰";
                            break;
                        case 3:
                            state = "低峰";
                            break;
                    }
                    var total = '<div class="mg_t20 bg_f3f6fb of_h"><div class="col-sm-1 col-md-1 col-lg-1 text_c f18 bd_r1 peak-value-high">'+state+'</div>'+
                                '<div class="col-sm-11 col-md-11 col-lg-11"><div class="other-peak"><div class="identical-peak"><span class="less-than identical-time">小于三分钟</span>'+
                                '<div class="f16"><p class="mg_t20"><span class="total-green">满意，'+(elem.time_slot_one_satisfaction).toFixed(2)+'%</span><em class="mg_l15 total-red">不满意，'+(elem.time_slot_one_yawp).toFixed(2)+'%</em></p>'+
                                '<p class="mg_t20"><b class="color_999">Total：</b><i class="total-blue">'+(elem.time_slot_one_total).toFixed(2)+'%</i></p></div></div>'+
                                '<div class="identical-peak"><span class="less-than identical-time">3-8分钟</span><div class="f16"><p class="mg_t20"><span class="total-green">满意，'+(elem.time_slot_two_satisfaction).toFixed(2)+'%</span><em class="mg_l15 total-red">不满意，'+(elem.time_slot_two_yawp).toFixed(2)+'%</em></p>'+
                                '<p class="mg_t20"><b class="color_999">Total：</b><i class="total-blue">'+(elem.time_slot_two_total).toFixed(2)+'%</i></p></div>'+
                                '</div><div class="identical-peak"><span class="less-than identical-time">大于8分钟</span><div class="f16"><p class="mg_t20"><span class="total-green">满意，'+(elem.time_slot_three_satisfaction).toFixed(2)+'%</span><em class="mg_l15 total-red">不满意，'+(elem.time_slot_three_yawp).toFixed(2)+'%</em></p>'+
                                '<p class="mg_t20"><b class="color_999">Total：</b><i class="total-blue">'+(elem.time_slot_three_total).toFixed(2)+'%</i></p></div></div></div></div></div>';
                    $('.content-identical').append(total);
                });
            }
        })
    }


    //候车满意度top5
    var dervList = {
        url: $.getPath + '/WaitingSatisfaction/list',
        dataTitle: '候车满意度排行TOP5',
        sourceFlag: true,
        dataFrom: '来自坐公交APP',
        sendData: {offdate: $.getDateString('-1')},
        renderFn: function (data) {
            var _this = this;
            var data = data['resPonse']['waitingSatisfactionList'];
            this.$content.html("");
            if (data.dataTitle && data.dataFrom) {
                _this.opts.dataTitle = data.dataTitle;
                _this.opts.dataFrom = data.dataFrom;
            }
            _this.$title = _this.opts.sourceFlag ? $('<div class="title"><div class="titleName">' + _this.opts.dataTitle + '</div><div class="dataSouce">' + this.opts.dataFrom + '</div>\n' +
                '        </div>') : $('<h2 class="bd_b1">' + _this.opts.dataTitle + '</h2>');
            _this.$ul = $('<ul class="pd_25 pd_t5"></ul>');
            $.each(data, function (index, value) {
                if (index <= _this.opts.allShowNum) {
                    _this.$li = $('<li class="bd_b1 h_40 dis_f jst_sb item_c"><div class="dis_f item_c"><p style="background:' + _this.opts.topColor[index] + '"  class="w_25 h_25 text_c line_h25 mg_r20">' + (index * 1 + 1) + '</p><span>' + value['line_name'] + '</span></div><span>' + (value['satisfaction'] * 100).toFixed(2) + '%</span></li>');
                    _this.$ul.append(_this.$li);
                }
            });
            _this.$content.append(this.$title).append(this.$ul);
        }
    };
    $(".optimize").creatList(dervList);




//候车时长与候车满意度呈现反比趋势
    contrast1();
    function contrast1() {
        contrast.setOption({

                title: {
        text: '说明：候车时长与候车满意度呈现反比趋势',
               textStyle: {
            color: '#999',
            fontSize: 16,
            fontWeight: 'normal'
        },
        left: 'center'
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
                formatter: "{a} <br/>{c}%",
            },
            grid: {
                containLabel: true
            },
            xAxis: [
                {
                    splitLine:{show: true},
                    name: '候车时长(min)',
                    nameLocation: 'center',
                    nameTextStyle: {
                        color: '#999',
                        fontSize: 14,
                        padding: [10, 0, 0, 420]
                    },
                    type: 'category',
                    boundaryGap: false,
                    // axisLine: {onZero: false},
                    data: ['1', '2', '3', '4']
                }
            ],
            yAxis: [
                {
                    splitLine:{show: true},
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
                    data: []
                }
            ]
        });
    }
});
