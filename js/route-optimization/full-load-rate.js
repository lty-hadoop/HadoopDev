/*
* 满载率与拥挤满意度
* */
$(function () {clearInterval($.timerEcharts);
    $.timerEcharts = null;
    var $fullloadrate = $('.full-load-rate');
    var myChart = echarts.init(document.getElementById('full-load-rate'));
    var contrast = echarts.init(document.getElementById('contrast-chart'));
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
                name: '舒适满意度',
                type: 'line',
                areaStyle: {
                    normal: {
                        color: '#e4f6f2'
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#33cc99',
                        lineStyle: {
                            color: '#33cc99'
                        }
                    }
                },
                data: []
            },

            {
                name: '满载率',
                type: 'line',
                animation: true,
                itemStyle: {
                    normal: {
                        color: '#33ffff',
                        lineStyle: {
                            color: '#33ffff'
                        }
                    }
                },
                data: []
            },
            {
                polarIndex: 0,
                name: '发车间隔',
                type: 'line',
                yAxisIndex: 1,
                step: 'end',
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
    var theadArr = [{name: '线路', field: 'line_name'},
        {name: '分时范围', field: 'timeArr'},
        {name: '上车人数', field: 'up_num'},
        {name: '运力', field: 'shipping_ability'},
        {name: '下车人数', field: 'down_num'},
        {name: '平均发车间隔', field: 'waiting_duration'},
        {name: '舒适度', field: 'ride_satisfaction'},
        {name: '满载率', field: 'full_loadration'}
    ];
    $fullloadrate.setSelecteTable({'fn': setEchartsData, 'theadArr': theadArr, 'fn2': fullfn});

    //设置echarts数据
    function setEchartsData(data) {
        var maxWaiting = 0;
        var resData = {};
        var comfortMax = 0;
        resData.degree = [];
        resData.waiting = [];
        resData.comfort = [];
        var fullMax = 0;
        var res = data['resPonse']['satisfactionList'];
        $.each(res, function (index, value) {
            var full_loadration = ((value['full_loadration']) * 100).toFixed(2);
            resData.degree.push(full_loadration);
            resData.waiting.push(value['waiting_duration']);
            resData.comfort.push(value['ride_satisfaction']);
            if (maxWaiting < value['waiting_duration']) {
                maxWaiting = value['waiting_duration'];
            }
            if(comfortMax<value['ride_satisfaction']){
                comfortMax = value['ride_satisfaction'];
            }
        });
        //舒适满意度
        //满载率
        myChart.setOption({
            yAxis: [{
                max: 250

            }, {
                max: maxWaiting
            }],
            series: [{
                data: resData.comfort
            }, {
                data: resData.degree
            }, {
                data: resData.waiting

            }
            ]
        });
        var xAxisData = [];
        for(var i = 0;i<=comfortMax;i++){
            if(i%5==0)xAxisData.push(i);

        }
        var yAxisData = [];
        for(var i = 0;i<=maxWaiting;i++){
            if(i%5==0)yAxisData.push(i);

        }
        xAxisData.sort(function(a,b){
            return parseInt(a) - parseInt(b);
        });


        var dataArr = resData.degree;
        dataArr.sort(function(a,b){
            return parseInt(b) - parseInt(a);
        });
        contrast.setOption({
            xAxis : [{
                data : xAxisData
            }],
            yAxis : [{
                data :yAxisData
            }],
            series : [{
                data: dataArr
            }]
        })
    }
    contrast1();
    function fullfn(option) {
        $.ajax({
            url: $.getPath+'/RideSatistics/list',
            type: 'GET',
            dataType: 'json',
            data: option,
            success: function (res) {
                try {
                    var data = res.resPonse.rideSatisticsList;
                    //console.log(data)
                    $('.ride-satistics').html('');
                    var total = '<table class="table table-border"><thead><tr><td class="text_c f16">满载率</td>'+
                                '<td class="text_c f16">舒适满意度</td></tr></thead><tbody class="f16"><tr><td>小于40%</td>'+
                                '<td><div><p class="mg_t5 total-green">满意，'+(data[0].satisfaction).toFixed(2)+'%</p>'+
                                '<p class="mg_t5 total-red">不满意，'+(data[0].unsatisfaction).toFixed(2)+'%</p><p class="mg_t5"><span>Total：</span><i class="total-blue">'+(data[0].total).toFixed(2)+'%</i></p></div></td></tr><tr><td>40%-80%</td><td>'+
                                '<div><p class="mg_t5 total-green">满意，'+(data[1].satisfaction).toFixed(2)+'%</p><p class="mg_t5 total-red">不满意，'+(data[1].unsatisfaction).toFixed(2)+'%</p><p class="mg_t5"><span>Total：</span><i class="total-blue">'+(data[1].total).toFixed(2)+'%</i></p>'+
                                '</div></td></tr><tr><td>大于80%</td><td><div><p class="mg_t5 total-green">满意，'+(data[2].satisfaction).toFixed(2)+'%</p>'+
                                '<p class="mg_t5 total-red">不满意，'+(data[2].unsatisfaction).toFixed(2)+'%</p><p class="mg_t5"><span>Total：</span><i class="total-blue">'+(data[2].total).toFixed(2)+'%</i></p>'+
                                '</div></td></tr></tbody></table>';
                    $('.ride-satistics').append(total);
                } catch (e) {
                    console.log(e)
                }

            }

        })
    }


    function contrast1() {

var option = {
    title: {
        text: '说明：满载率与舒适满意度呈现反比趋势',
              textStyle: {
            color: '#999',
            fontSize: 16,
            fontWeight: 'normal'
        },
        left: 'center'
    },
    tooltip: {
        formatter: "{a} <br/>{c}%", // 这里是鼠标移上去的显示数据
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            animation: false,
            label: {
                backgroundColor: '#505765'
            }
        },
    },
    legend: {
        left: 'left'
    },
    xAxis: {
        splitLine:{show: true},
            name: '舒适度',
                nameLocation: 'center',
            nameTextStyle: {
            color: '#999',
                fontSize: 14,
                padding: [5, 0, 0, 450]
        },
            type: 'category',
                boundaryGap: false,
            // axisLine: {onZero: false},
            data: []
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
    },
    yAxis: {
        splitLine:{show: true},
        type: 'value',
        name: '满载率',
        data:[]
    },
    series: [
        {
            name: '满载率',
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
};
        contrast.setOption(option);
    }

    //舒适满意度排行
    var dervList = {
        url: $.getPath + '/RideLloadra/list',
        dataTitle: '满载率排行TOP5',
        dataFrom: '来自坐公交APP',
        sourceFlag: true,
        sendData: {offdate: $.getDateString('-1'), type: 1},
        renderFn: function (data) {
            var _this = this;
            var data = data['resPonse']['rideLloadraList'];
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
                    _this.$li = $('<li class="bd_b1 h_40 dis_f jst_sb item_c"><div class="dis_f item_c"><p style="background:' + _this.opts.topColor[index] + '"  class="w_25 h_25 text_c line_h25 mg_r20">' + (index * 1 + 1) + '</p><span>' + value['line_name'] + '</span></div><span>' + (value['percentage'] * 100).toFixed(2) + '%</span></li>');
                    _this.$ul.append(_this.$li);
                }
            });
            _this.$content.append(this.$title).append(this.$ul);
        }
    };
    var manzai = {
        url: $.getPath + '/RideLloadra/list',
        dataTitle: '舒适度排行TOP5',
        dataFrom: '来自坐公交APP',
        sourceFlag: true,
        sendData: {offdate: $.getDateString('-1'), type: 2},
        renderFn: function (data) {
            var _this = this;
            var data = data['resPonse']['rideLloadraList'];
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
                    _this.$li = $('<li class="bd_b1 h_40 dis_f jst_sb item_c"><div class="dis_f item_c"><p style="background:' + _this.opts.topColor[index] + '"  class="w_25 h_25 text_c line_h25 mg_r20">' + (index * 1 + 1) + '</p><span>' + value['line_name'] + '</span></div><span>' + (value['percentage'] * 100).toFixed(2) + '%</span></li>');
                    _this.$ul.append(_this.$li);
                }
            });
            _this.$content.append(this.$title).append(this.$ul);
        }
    };
    $(".optimize").creatList(dervList);
    $(".manzai").creatList(manzai);
});
