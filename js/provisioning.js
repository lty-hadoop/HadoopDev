$(function(){
    $(".getSelect").selectpick({
        url:$.getPath+'/Company/list',
        showNum : 10,
        wrap:'getSelectWrap',
        atuoCbfn:true,
        data : {isPage:true,pageNum:1,pageSize:10,company_name:""},
        keyupData:'company_name',
        simpleData : {
            name:'company_name',
            total:'total',
            data:'companyList'
        },
        cbFn : function(data){
            var $wrapDiv = $('.getSelectLineWrap').find('.selectpickDiv');
            if(($wrapDiv.length!=0))$wrapDiv.remove();
            getLine(data)
        }
    });
    function getLine(data){
        $(".getSelectLine").selectpick({
            url:$.getPath+'/Line/list',
            showNum : 10,
            wrap:'getSelectLineWrap',
            atuoCbfn:true,
            data : {isPage:true,pageNum:1,pageSize:10,company_id:data.company_id},
            keyupData:'line_name',
            simpleData : {
                name:'line_name',
                total:'total',
                data:'LineList'
            },
            cbFn : function(data){
                console.log(data)
            }
        });
    }
    var listData = {
        url : $.getPath+'/PrepoptimLine/list',
        dataTitle : '待优化线路列表',
        sourceFlag:false,
        sendData : {offdate:$.getDateString('-1')},
        renderFn : function(data){
            var _this = this;
            var data = data['resPonse']['prepoptimLineList'];
            this.$content.html("");
            if(data.dataTitle&&data.dataFrom){
                _this.opts.dataTitle = data.dataTitle;
                _this.opts.dataFrom = data.dataFrom;
            }
            _this.$title = _this.opts.sourceFlag?$('<div class="title"><div class="titleName">'+_this.opts.titleData+'</div><div class="dataSouce">'+this.opts.dataFrom+'</div>\n' +
                '        </div>'):$('<h2 class="bd_b1">'+_this.opts.dataTitle+'</h2>');
            _this.$ul = $('<ul class="pd_25 pd_t5"></ul>');
            $.each(data,function(index,value){
                if(index<=_this.opts.allShowNum){
                    _this.$li = $('<li class="bd_b1 h_40 dis_f jst_sb item_c"><div class="dis_f item_c"><p style="background:'+_this.opts.topColor[index]+'"  class="w_25 h_25 text_c line_h25 mg_r20">'+(index*1+1)+'</p><span>'+value['line_name']+'</span></div><span>'+value['company_name']+'</span></li>')
                    _this.$ul.append( _this.$li);
                }
            });
            _this.$content.append(this.$title).append(this.$ul);
        }
    };
    var dervList = {
        url : $.getPath+'/DriverNum/list',
        dataTitle : '驾驶员载客量排行',
        sourceFlag:false,
        sendData : {offdate:$.getDateString('-1')},
        renderFn : function(data){
            var _this = this;
            var data = data['resPonse']['driverNumList'];
            this.$content.html("");
            if(data.dataTitle&&data.dataFrom){
                _this.opts.dataTitle = data.dataTitle;
                _this.opts.dataFrom = data.dataFrom;
            }
            _this.$title = _this.opts.sourceFlag?$('<div class="title"><div class="titleName">'+_this.opts.titleData+'</div><div class="dataSouce">'+this.opts.dataFrom+'</div>\n' +
                '        </div>'):$('<h2 class="bd_b1">'+_this.opts.dataTitle+'</h2>');
            _this.$ul = $('<ul class="pd_25 pd_t5"></ul>');
            $.each(data,function(index,value){
                if(index<=_this.opts.allShowNum){
                    _this.$li = $('<li class="bd_b1 h_40 dis_f jst_sb item_c"><div class="dis_f item_c"><p style="background:'+_this.opts.topColor[index]+'"  class="w_25 h_25 text_c line_h25 mg_r20">'+(index*1+1)+'</p><span>'+value['driver_name']+'</span></div><span>'+value['busload']+'</span></li>');
                    _this.$ul.append( _this.$li);
                }
            });
            _this.$content.append(this.$title).append(this.$ul);
        }
    };
    $(".optimize").creatList(listData);

    $(".driverTop").creatList(dervList);


    var option = {
        id: 'provisioning',
        url: '',
        title: '客流与运力对比图',
        titleColor: '#999',
        legendData: [
            {name: '客流', icon: 'rect'},
            {name: '运力', icon: 'rect'}
        ],
        ydata: [
            {
                splitLine:{show: true},
                type: 'value',
                max: 5,
                axisLabel: {
                    formatter: '{value}'
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
                name:'客流',
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
                name: '运力',
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
        ],
    };
    var od = new GetData(option);
});