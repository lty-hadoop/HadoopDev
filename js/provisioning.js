$(function () {clearInterval($.timerEcharts);
    $.timerEcharts = null;
    var getDataInfo = {};
    var lineFlag = false;
    var direction = null;
    /***临时使用****/
        //删除 todo
    var isFrist = false;
    /***临时使用****/
    var $radioDiv = $('.radioDiv');
    $(".getSelect").selectpick({
        url: $.getPath + '/Company/list',
        showNum: 10,
        wrap: 'getSelectWrap',
        atuoCbfn: true,
        data: {isPage: true, pageNum: 1, pageSize: 10, departmentname: ""},
        keyupData: 'departmentname',
        simpleData: {
            name: 'departmentname',
            total: 'total',
            data: 'companyList'
        },
        cbFn: function (data) {
            var $wrapDiv = $('.getSelectLineWrap').find('.selectpickDiv');
            if (($wrapDiv.length != 0)) $wrapDiv.remove();
            getLine(data);
        }
    });

    function getLine(data) {
        $(".getSelectLine").selectpick({
            url: $.getPath + '/Line/list',
            showNum: 10,
            wrap: 'getSelectLineWrap',
            atuoCbfn: true,
            data: {isPage: true, pageNum: 1, pageSize: 10, departmentid: data.departmentid, linename: ""},
            keyupData: 'linename',
            simpleData: {
                name: 'linename',
                total: 'total',
                data: 'LineList'
            },
            cbFn: function (data) {
                lineFlag = true;
                getDataInfo.line_id = data.id;
                direction = $radioDiv.find('input:radio[name="route"]:checked').attr('attrType');
                if(isFrist)getEchartsData();
                isFrist = true;
            }
        });
    }

    $radioDiv.on('click', 'input', function () {
        direction = $(this).attr('attrType');
        if (lineFlag) {
            getEchartsData();
        }
    });
    function getEchartsData() {
        getDataInfo.direction = direction;
        getDataInfo.offdate = $.getDateString('-1');
        $.ajax({
            url: $.getPath + '/PassflowCapacity/list',
            dataType: 'json',
            data: getDataInfo,
            type: 'GET',
            success: function (data) {
                setEchartsData(data);
            }
        });
    }

    var option = {
        id: 'provisioning',
        url: '',
        title: '客流与运力对比图(' + $.getDateString('-1') + ')',
        titleColor: '#999',
        legendData: [
            {name: '客流', icon: 'rect'},
            {name: '运力', icon: 'rect'}
        ],
        ydata: [
            {
                splitLine: {show: true},
                type: 'value',
                max: 5,
                axisLabel: {
                    formatter: '{value}/'+"人次"
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
        seriesNumber: 2,
        seriesFirstData: [
            {
                name: '客流',
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
                data: [3, 4, 4.5, 3.6, 3.8, 3.2, 2.8, 3, 3.4]
            }
        ],
        seriesSecondData: [
            {
                name: '客流',
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
            },
            {
                //polarIndex: 0,
                name: '运力',
                type: 'line',
                //yAxisIndex: 1,
                //step: 'end',
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
    };
    var od = new GetData(option);
    function setEchartsData(postData) {

        var getData = postData['resPonse']['passflowCapacityList'];
        var up_num = [];
        var capacity = [];
        var upMax = 0;
        var capaMax = 0;
        $.each(getData, function (index, val) {
            up_num.push(val.up_num);
            capacity.push(val.capacity);
            if (upMax < Number(val.up_num)) {
                upMax = Number(val.up_num).toFixed(0);
            }
            if (capaMax < Number(val.capacity)) {
                capaMax = Number(val.capacity).toFixed(0);
            }
        })
        var option = {
            yAxis: [
                {
                    max: capaMax
                }, {
                    max: upMax
                }
            ],
            series: [
                {
                    data: up_num
                }, {
                    data: capacity
                }
            ]
        };
        od.setOption(option);
    }
    /***临时使用****/
    //删除 todo
    getEchartsData1();
    function getEchartsData1() {
        $.ajax({
            url: $.getPath + '/PassflowCapacity/list',
            dataType: 'json',
            data: {line_id:91,direction:0,offdate:'2017-11-20'},
            type: 'GET',
            success: function (data) {

                setEchartsData(data);
            }
        });
    }
    /***临时使用****/

    var listData = {
        url: $.getPath + '/PrepoptimLine/list',
        dataTitle: '待优化线路列表',
        sourceFlag: false,
        sendData: {offdate: $.getDateString('-1')},
        renderFn: function (data) {
            var _this = this;
            var data = data['resPonse']['prepoptimLineList'];
            this.$content.html("");
            if (data.dataTitle && data.dataFrom) {
                _this.opts.dataTitle = data.dataTitle;
                _this.opts.dataFrom = data.dataFrom;
            }
            _this.$title = _this.opts.sourceFlag ? $('<div class="title"><div class="titleName">' + _this.opts.titleData + '</div><div class="dataSouce">' + this.opts.dataFrom + '</div>\n' +
                '        </div>') : $('<h2 class="bd_b1">' + _this.opts.dataTitle + '<span class="f12 color_999">(' + $.getDateString('-1') + ')</span></h2>');
            _this.$ul = $('<ul class="pd_25 pd_t5"></ul>');
            $.each(data, function (index, value) {
                if (index <= _this.opts.allShowNum) {
                    _this.$li = $('<li class="bd_b1 h_40 dis_f jst_sb item_c"><div class="dis_f item_c"><p style="background:' + _this.opts.topColor[index] + '"  class="w_25 h_25 text_c line_h25 mg_r20">' + (index * 1 + 1) + '</p><span>' + value['line_name'] + '</span></div><span>' + value['company_name'] + '</span></li>')
                    _this.$ul.append(_this.$li);
                }
            });
            _this.$content.append(this.$title).append(this.$ul);
        }
    };
    var dervList = {
        url: $.getPath + '/DriverNum/list',
        dataTitle: '驾驶员载客量排行',
        sourceFlag: false,
        sendData: {offdate: $.getDateString('-1')},
        renderFn: function (data) {
            var _this = this;
            var data = data['resPonse']['driverNumList'];
            this.$content.html("");
            if (data.dataTitle && data.dataFrom) {
                _this.opts.dataTitle = data.dataTitle;
                _this.opts.dataFrom = data.dataFrom;
            }
            _this.$title = _this.opts.sourceFlag ? $('<div class="title"><div class="titleName">' + _this.opts.titleData + '</div><div class="dataSouce">' + this.opts.dataFrom + '</div>\n' +
                '        </div>') : $('<h2 class="bd_b1">' + _this.opts.dataTitle + '<span class="f12 color_999">(' + $.getDateString('-1') + ')</span></h2>');
            _this.$ul = $('<ul class="pd_25 pd_t5"></ul>');
            $.each(data, function (index, value) {
                if (index <= _this.opts.allShowNum) {
                    _this.$li = $('<li class="bd_b1 h_40 dis_f jst_sb item_c"><div class="dis_f item_c"><p style="background:' + _this.opts.topColor[index] + '"  class="w_25 h_25 text_c line_h25 mg_r20">' + (index * 1 + 1) + '</p><span>' + value['driver_name'] + '</span></div><span>' + value['busload'] + '</span></li>');
                    _this.$ul.append(_this.$li);
                }
            });
            _this.$content.append(this.$title).append(this.$ul);
        }
    };
    $(".optimize").creatList(listData);

    $(".driverTop").creatList(dervList);


});