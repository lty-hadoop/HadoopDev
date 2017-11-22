
;
(function($, window, document) {
    var timerEcharts = null;
    clearInterval(timerEcharts);
    //请求接口的域名端口
    $.getPath = 'http://192.168.2.133:9001';
    //将方法扩展到$上
    $.extend({
         //获取前一天日期或者当前日期
         //取前一天传-1
         getDateString : function(yesterday){
             var myDate = new Date();
             if(yesterday==='-1'){
                 // return myDate.getFullYear()+'-'+(myDate.getMonth()+1)+'-'+(myDate.getDate()-1);
                 return '2017-11-20';
             }else{
                 return myDate.getFullYear()+'-'+(myDate.getMonth()+1)+'-'+myDate.getDate();
             }
         },
        formatDate : function(now){
             var   d=new   Date(now);
        var   hour=d.getHours();
        var   minute=d.getMinutes();
        var   second=d.getSeconds();
        if(hour<10){
            hour= '0'+hour;
        }
        if(minute<10){
            minute= '0'+minute;
        }
        if(second<10){
            second= '0'+second;
        }
        return   hour+":"+minute+":"+second;
    },
        qxEcharts : function(){
            var aa = new Pmgressbar();
        }
});
    //阻止时间冒泡
    function stopEvent(ev){
        ev = ev || window.event;
        if(ev.stopPropagation) ev.stopPropagation();
        else ev.cancelbubble = true;
    }
    //延迟执行时间
    function waitDo(_this,id, fn, wait) {
        //id事件名称  fn执行事件 wait等待时间

        if (_this.timer[id]) {
            window.clearTimeout(_this.timer[id]);
            delete _this.timer[id];
        }
        return _this.timer[id] = window.setTimeout(function() {
            fn();
            delete _this.timer[id];
        },wait);
    }
    //分页插件  样式还可以优化
    $.fn.creatPage = function(option){
        option.el = $(this);
        var page = new Initpage(option);
        return page;
    };
    function Initpage(data){
        //目标元素
        this.$elem = data.el;
        //一次显示多少页
        this.showPage = data.showPage||5;
        //当前页码
        this.nowPage = data.startPage||1;
        //总条数
        this.itemSize = data.itemSize;
        //一次显示多少条数据
        this.showNum = data.showNum||10;
        //总页数
        this.pageNum =this.itemSize%this.showNum==0?this.itemSize/this.showNum:Math.ceil(this.itemSize/this.showNum);
        //初始页
        this.startPage = data.startPage||1;
        //页码偏移量
        this.pageOffset = Math.floor(this.showPage/2);
        this.callBack = data.callBack||function(){};
        this.init();
        this.render();
    }
    Initpage.prototype = {
        init : function(){
            this.$ul = $('<ul class=" pageInfo dis_f jst_r bd_1 w_auto "  style="border-radius: 2px; "><li class="first bd_1 line_h30 text_c w_30 h_30">&lt;&lt;</li><li class="prev bd_1 line_h30 text_c w_30 h_30 ">&lt;</li>' +
                '<li class="next bd_1 line_h30 text_c w_30 h_30">&gt;</li>' +
                '<li class="last bd_1 line_h30 text_c w_30 h_30">&gt;&gt;</li></ul>');
            this.$elem.append(this.$ul);
        },
        render:function(){
            //渲染初始化页面
            this.$pageLi = '';
            this.endPage = this.pageNum <= this.showPage ? this.pageNum:this.showPage;
            for(var i = this.startPage;i<= this.endPage;i++){
                if(this.nowPage==i){
                    this.$li = '<li class="bd_1 line_h30 pageLi active text_c w_30 h_30">'+i+'</li>';
                }else{
                    this.$li = '<li class="bd_1 line_h30 pageLi text_c w_30 h_30">'+i+'</li>';
                }
                this.$pageLi += this.$li;
            }
            this.$ul.find('.next').before(this.$pageLi);
            this.bindEvent();
        },
        bindEvent:function(){
            var _this = this;
            this.callBack(this.nowPage);
            //直接点击页码
            this.$ul.on("click",".pageLi",function(ev){
                stopEvent(ev);
                _this.nowPage = parseInt($(this).html());
                _this.setPage();

            });
            //点击下一页
            this.$ul.on("click",".next",function(ev){
                stopEvent(ev);
                if(_this.nowPage==_this.pageNum)return;
                _this.nowPage++;
                _this.setPage(_this.nowPage);

            });
            //点击上一页
            this.$ul.on("click",".prev",function(ev){
                stopEvent(ev);
                if( _this.nowPage==1)return;
                _this.nowPage--;
                _this.setPage();
            });
            //点击第一页
            this.$ul.on("click",".first",function(ev){
                stopEvent(ev);
                if( _this.nowPage == 1)return;
                _this.nowPage = 1;
                _this.setPage();
            });
            //点击到最后一页
            this.$ul.on("click",".last",function(ev){
                stopEvent(ev);
                if( _this.nowPage == _this.pageNum)return;
                _this.nowPage = _this.pageNum;
                _this.setPage();
            });
        },
        setPage : function(){
            if(this.pageNum > this.showPage){
                //当选中当前页数大于 页数偏移量时
                if(this.nowPage > this.pageOffset){
                    this.startPage = this.nowPage - this.pageOffset;
                    this.endPage = this.pageNum>(this.nowPage + this.pageOffset)?(this.nowPage + this.pageOffset):this.pageNum ;

                }else{
                    this.startPage = 1;
                    this.endPage = this.showPage ;
                }
                if(this.pageNum < this.pageOffset + this.nowPage ){
                    var star = this.startPage - (this.nowPage  + this.pageOffset - this.endPage);
                    this.startPage = (this.showPage/2)==this.pageOffset? star+1 : star;
                }
            }
            //修改页码
            var index = 0;
            for(var i = this.startPage;i<= this.endPage;i++,index++){
                this.$ul.find(".pageLi").eq(index).html(i);
                if(this.nowPage == i){
                    this.$ul.find(".pageLi").eq(index).addClass('active').siblings().removeClass('active');
                }

            }
            this.callBack(this.nowPage);
        }
    };
//创建排名列表
    $.fn.creatList = function(option){
        option.el = $(this);
        var list = new CreatList(option);
        return list;
    };
    $.fn.creatList.opts  = {
        //显示条数
        allShowNum : 6,
        //是否显示数据来源,默认不显示
        sourceFlag: false,
        //是需要示分页，默认不需要分页
        getPage : false,
        //是否显示分页,默认不显示分页
        showPage : false,
        //分页显示多少页码
        pageNull: 5,
        //总页数为多少
        allList : null,
        //标题默认背景颜色，为一个由16进制的颜色值前面加#号组成
        topColor : ['#1c84c6','#23c6c8','#1ab394','#1ab394','#1ab394','#1ab394'],
        //数据来源路径
        url : null,
        //请求方式
        type : 'get',
        //请求数据类型
        dataType : 'json',
        simpleData:{
            "name":"dense_region_site",
            "hotData":"dense_data",
            "dataTitle":"dataTitle",
            "dataFrom":"dataFrom"
        },
        //标题
        dataTitle : null,
        //数据来源名称
        dataFrom : null

    };
    function CreatList(options){
        //配置项继承
        this.opts = $.extend({},$.fn.creatList.opts,options);
        //目标元素
        this.$ele = options.el;
        //回调函数
        this.cbFn = options.cbFn || function() {};
        //自定义的渲染函数
        this.renderFn = options.renderFn || null;
        //初始化容器
        this.init();
    }

    CreatList.prototype = {
        //初始化容器
        init : function(){
            this.$content = $('<div class="plugin-topList w_auto bg_fff" style="min-height:320px;"></div>');
            this.$page = $('<div></div>');
            this.$ele.append(this.$content).append(this.$page);
            //获取初始化数据
            this.getData();
        },
        getData : function () {
            var _this = this;
            //判断是否需要分页
            if(!this.opts.getPage){
                $.ajax({
                    url : this.opts.url,
                    type : this.opts.type,
                    dataType : this.opts.dataType,
                    data : this.opts.sendData,
                    success:function(data){
                        //如果用户有传入自定义的渲染函数,就执行用户传入的，没有就自己渲染
                        _this.renderFn!=null?_this.renderFn.call(_this,data):randerData.call(_this,data);
                    }
                });
            }else{
                $.ajax({
                    url : this.opts.url,
                    type : this.opts.type,
                    dataType : this.opts.dataType,
                    data : _this.opts.sendData,
                    success:function(data){
                        _this.$page.creatPage({
                            itemSize : data.total,
                            callBack : function(page){
                                $.ajax({
                                    url : _this.opts.url,
                                    type : _this.opts.type,
                                    dataType : _this.opts.dataType,
                                    data: {},
                                    success:function(data){
                                        //如果用户有传入自定义的渲染函数,就执行用户传入的，没有就自己渲染
                                        _this.renderFn!=null?_this.renderFn(data):randerData.call(_this,data.data);
                                    }
                                })
                            }
                        });
                    }
                });

            }
            //渲染函数
            function randerData(data){
                var _this = this;
                var data = data['resPonse']['DenseRegionList'];
                this.$content.html("");
                if(data.dataTitle&&data.dataFrom){
                    _this.opts.dataTitle = data.dataTitle;
                    _this.opts.dataFrom = data.dataFrom;
                }
                _this.formTime = $.getDateString('-1');
                _this.$title = _this.opts.sourceFlag?$('<div class="title"><div class="titleName">'+_this.opts.dataTitle+'</div><div class="dataSouce">'+this.opts.dataFrom+'</div>\n' +
                    '        </div>'):$('<h2 class="bd_b1">'+_this.opts.dataTitle+'<span class="f12 color_999">('+_this.formTime+')</span></h2>');
                _this.$ul = $('<ul class="pd_25 pd_t5"></ul>');
                $.each(data,function(index,value){
                    if(index<=_this.opts.allShowNum){
                        _this.$li = $('<li class="bd_b1 h_40 dis_f jst_sb item_c"><div class="dis_f item_c"><p style="background:'+_this.opts.topColor[index]+'"  class="w_25 h_25 text_c line_h25 mg_r20">'+(index*1+1)+'</p><span>'+value[_this.opts.simpleData.name]+'</span></div><span>'+value[_this.opts.simpleData.hotData]+'</span></li>')
                        _this.$ul.append( _this.$li);
                    }
                });
                _this.$content.append(this.$title).append(this.$ul);
            }
        }
    };

    //下拉选择枚举组件
    $.fn.selectpick = function(options){
            options.el = $(this);
            var select = new Selectpick(options);
        $(this).on("click",function(ev){
            $(this).select();
            stopEvent(ev);
            select.show();
        })
    }
    //基本配置
    $.fn.selectpick.opts = {
        //是否需要分页;默认需要;
        showPageFlag : true,
        //数据请求路径
        url : null,
        renderFn : null,
        //数据类型；默认为JSON
        dataType : 'JSON',
        //请求方式；默认为get
        sendType : 'get',
        //请求时所带的参数；默认为空对象；
        getData : {},
        simpleData : {
            name : 'name',
            total : 'total'
        },
        //一次显示多少条数据
        showNum: 5,
        //一次显示多少页;默认为5页
        showPage: 5,
        //存放请求数据的容器
        wrap:null,
        //是否自动执行回调，选中第一条；
        atuoCbfn : false
    }
    //构造函数
    function Selectpick(options){
        this.$ele = options.el;
        this.opts = $.extend({},$.fn.selectpick.opts,options);
        this.cbFn = options.cbFn||function(){};
        this.init();
        this.timer = {};
    }
    //方法挂载
    Selectpick.prototype = {
        //初始化
        init : function(){
            this.outdiv = $('<div class="of_h selectpickDiv" ></div>');
            $('.'+this.opts.wrap).append(this.outdiv);
            this.$content = $('<ul class="selectpickUl w_auto"></ul>');
            this.outdiv.append(this.$content);
            this.hide();
            this.getData('');
            this.bindEvent();
            this.keySearch();
        },
        getData : function(passData){
            var _this = this;
            //这里加查询参数；
             _this.opts.data[_this.opts.keyupData] = passData;
            //请求数据
            $.ajax({
                url:_this.opts.url,
                type:_this.opts.sendType,
                dataType:_this.opts.dataType,
                data:_this.opts.data,
                success:function(data){
                    _this.opts.showPageFlag?_this.pagingRander(data):_this.rollRander(data);
                }
            })
        },
        //超出显示滚动条的
        rollRander : function(data){
            var _this = this;
            this.opts.renderFn!=null?this.opts.renderFn(data):_this.rander(data.data);

        },
        //需要分页的
        pagingRander : function(data){
            var _this = this;
            _this.outdiv.find(".pageInfo").remove();
            if(data.resPonse[_this.opts.simpleData.data].length==0){
                _this.$content.html('');
                _this.$content.append('<li style="color: red">没有相关数据哦</li>');
                _this.$ele.val('');
                return;
            }
            this.outdiv.creatPage({
                itemSize:data.resPonse.page[_this.opts.simpleData.total],
                showNum : _this.opts.showNum,
                showPage : _this.opts.showPage,
                callBack : function(page){
                    _this.opts.data.pageNum = page;
                    $.ajax({
                        url:_this.opts.url,
                        type:_this.opts.sendType,
                        dataType:_this.opts.dataType,
                        data:_this.opts.data,
                        success:function(data){
                            _this.rander(data);
                        }
                    })
                }
            })
        },
        rander:function (data){
            var _this = this;
            var data = data.resPonse[_this.opts.simpleData.data];
            _this.$content.html('');
            $.each(data,function(index,value){
                _this.$li = $('<li class="option">'+value[_this.opts.simpleData.name]+'</li>');
                _this.$content.append(_this.$li);
                _this.$li.data('data',value);
                if(index==0&&_this.opts.atuoCbfn){
                    _this.$li.addClass("active");
                    _this.opts.atuoCbfn = false;
                    _this.$ele.val(value[_this.opts.simpleData.name]);
                    _this.cbFn(value);
                }
            })
        },
        bindEvent : function(){
            var _this = this;
            this.$content.on("click",".option",function(ev){
                stopEvent(ev);
                var data = $(this).data('data');
                $(this).addClass("active").siblings().removeClass('active');
                _this.$ele.val($(this).html());
                _this.cbFn(data);
                _this.hide();
            })
            $(document.body).on("click",function(){
                _this.hide();
            })
            $(window).on("resize",function(){
                _this.hide();
            })
        },
        keySearch:function(){
            var _this = this;
            _this.$ele.on("keyup",function(){
                var value = $.trim($(this).val());
                waitDo(_this,"keyup",function(){
                    _this.getData(value);
                },200)
            })
        },
        setPosition : function(){
            var _this = this;
            _this.outdiv.css({'z-index':10000});
        },
        show : function(){
            var _this = this;
            this.setWidth = this.$ele.width();
            this.outdiv.css({width:_this.setWidth});
            this.setPosition();
            this.outdiv.show();
        },
        hide : function(){
            this.outdiv.hide();
        }
    }
    //点击查看评价
    $.fn.seaDtail = function(){
        var _this = $(this);
        _this.on("click",".seeDetail",function(){
            var $table = _this.find(".pjDetail");
            var $img = _this.find(".seeDetail").find("img");
            if($img.hasClass("up")){
                $img.removeClass("up").addClass("down");
                $table.slideDown(300);
            }else{
                $img.removeClass("down").addClass("up");
                $table.slideUp(300);
            }
        })
    }

    //table组件
    $.fn.creatTable = function(opt){
        opt.$ele = $(this);
        var table = new CreatTable(opt);
    };
    function CreatTable(option){
        var opts = {
            //表头名称和对应字段
            theadArr : [{name:'线路',field: 'line_name'},
                { name:'分时范围',field: 'timeArr'},
                {name:'上车人数', field: 'up_num'},
                { name:'运力',field: 'shipping_ability'},
                { name:'下车人数', field: 'down_num'},
                {name:'平均发车时间', field: 'waiting_duration'},
                {name:'候车满意度', field: 'waiting_satisfaction'}
            ],
            //时间周期
            timeArr : ["06:00-06:59", "07:00-07:59", "08:00-08:59", "09:00-09:59", "10:00-10:59", "11:00-11:59", "12:00-12:59", "13:00-13:59", "14:00-14:59", "15:00-15:59", "16:00-16:59", "17:00-17:59", "18:00-18:59", "19:00-19:59", "20:00-20:59"],
            //是否分页,默认不分页
            showPage : false
        };
        this.$ele = option.$ele;
        this.opts = $.extend({},opts,option);
        //排序后的所有数据
        this.allSendData = [];
        this.init();
        this.bindEvent();
    }
    CreatTable.prototype = {
        //初始化容器
        init : function(){
            var _this = this;
            this.content = $('<table></table>');
            this.$ele.append(this.content);
            this.thead = $('<thead></thead>');
            this.tbody = $('<tbody></tbody>');
            this.content.append(_this.thead).append(_this.tbody);
            var $tr = $('<tr></tr>')
            $.each(_this.opts.theadArr,function(index,val){
                var $th = $('<th field="'+val.field+'">'+val.name+'<em></em></th>');
                $tr.append($th);
            })
            this.thead.append($tr);
            this.getData();
        },
        //获取数据
        getData : function(){
            var _this = this;
            $.ajax({
                url : _this.opts.url,
                data : _this.opts.getData,
                dataType : 'json',
                success : function(data){
                    _this.opts.showPage?_this.pageRander(data):_this.randerData(data,'');
                }
            })
        },
        //渲染数据
        randerData : function(obj,sort){
            var _this = this;
            var sort = sort;
            var dataList;
            _this.tbody.html('');
            if(sort===''){
                dataList = obj['resPonse']['satisfactionList'];
            }else{
                dataList = obj;
            }

            $.each(dataList,function(index,val){
                var $tr = $('<tr></tr>');
                $.each(_this.opts.theadArr,function(i,data){
                    var dataName = data['field'];
                    var isText = String(val[dataName]).indexOf(".");
                    if(dataName==='timeArr'&&sort==='') val['timeArr'] =  _this.opts.timeArr[index];
                    if(dataName==='waiting_satisfaction'&&isText!='-1'&&sort==='')val[dataName]=(val[dataName])+'%';
                    if(dataName==='full_loadration'&&isText!='-1'&&sort==='')val[dataName]=((val[dataName])*100).toFixed(2)+'%';
                    if(dataName==='ride_satisfaction'&&isText!='-1'&&sort==='')val[dataName]=(val[dataName])+'%';
                    var $td = $('<td class="'+dataName+'">'+val[dataName]+'</td>');
                    $tr.append($td);
                });
                $tr.data('data',val);
                _this.tbody.append($tr);
            });
            //存放排序数据的数组重置
            _this.allSendData = [];
        },
        //分页渲染数据
        pageRander : function(data){
            //评价模块再来集成分页插件
        },
        //时间绑定
        bindEvent : function(){
            var _this = this;
            _this.thead.on("click","em",function(){
                var td = $(this).parent();
                td.addClass('active').siblings().removeClass('active');
                //任何class都没有
                var sortName = td.attr('field');
                if($(this).className==""){
                    $(this).addClass('ae');
                    //ae排序
                    _this.sortData(sortName,'ae');
                    //有ae这个class的
                }else if(!$(this).hasClass('ad')){
                    $(this).removeClass('ae').addClass('ad');
                    //排序
                    //有ad这个class的
                    _this.sortData(sortName,'ad');
                }else{
                    $(this).removeClass('ad').addClass('ae');
                    _this.sortData(sortName,'ae');
                }
            })
        },
        sortData : function(name,sorted){
            var _this = this;
            //取出TD的值，并存入数组,取出前二个TD值；
            var sortedMap = [];
            _this.tbody.find("."+name).each(function(){
                var tr = $(this).parent();
                sortedMap.push({'row':tr.data('data'),'vals':$(this).html()});
            });
            //对数据进行排序
            sortedMap.sort(function(ra, rb) {
                var a = ra.vals, b = rb.vals,
                    dateSort = function(d1, d2) {
                        if(!isNaN(d1) && !isNaN(d2)){
                            return parseInt(d1) - parseInt(d2);
                        }
                        return d1.localeCompare(d2);
                    };
                return sorted == 'ae' ? dateSort(a, b) : dateSort(b, a);
            });
            $.each(sortedMap,function(key,val){
                _this.allSendData.push(val.row);
            });
            //排序重新渲染
            _this.randerData(_this.allSendData,'sort');
        }
    }

    $.fn.setSelecteTable = function(obj){
        var _this = $(this);
        var $obj = obj;
        var getData = {line_id: '', isPage: false};
        var isFrist = true;
        var setDataFlag = false;
        var timerData = [];
        //echarts数据
        //点击查看评价详情
        _this.seaDtail();
        //公司和线路选择
        _this.find(".getSelect").selectpick({
            url: $.getPath + '/Company/list',
            showNum: 10,
            wrap: 'getSelectWrap',
            atuoCbfn: true,
            data: {isPage: true, pageNum: 1, pageSize: 10, company_name: ""},
            keyupData: 'company_name',
            simpleData: {
                name: 'departmentname',
                total: 'total',
                data: 'companyList'
            },
            cbFn: function (data) {
                var $wrapDiv = $('.getSelectLineWrap').find('.selectpickDiv');
                getData.line_id = "";
                if(($wrapDiv.length!=0))$wrapDiv.remove();
                getLine(data);
            }
        });

        //公司选择完毕之后在回调里面选择线路
        function getLine(data) {
            _this.find('.getSelectLine').selectpick({
                url: $.getPath + '/Line/list',
                showNum: 10,
                wrap: 'getSelectLineWrap',
                atuoCbfn: true,
                data: {isPage: true, pageNum: 1, pageSize: 10, departmentid : data.departmentid},
                keyupData: 'linename',
                simpleData: {
                    name: 'linename',
                    total: 'total',
                    data: 'LineList'
                },
                cbFn: function (data) {
                    getData.line_id = data.id;
                    if (isFrist) getLineData();
                    if (setDataFlag) getLineData();
                }
            });
        }
        //选择日期
        var start = {
            //默认日期
            isinitVal: true,
            initDate: [{DD: '-1'}, true],
            //使用的日期格式
            format: 'YYYY-MM-DD',
            //选中日期执行回调，关闭窗口
            onClose: false,
            maxDate: $.nowDate({DD: 0}), //最大日期
            //确认选择的事件回调
            okfun: function (obj) {
                end.minDate = obj.val; //开始日选好后，重置结束日的最小日期
                endDates();
            },
            //清空的事件回调，elem当前输入框ID, val当前选择的值
            clearfun: function () {
                setDataFlag = false;
            }
        };
        var end = {
            format: 'YYYY-MM-DD',
            minDate: $.getDateString('-1'),//设定最小日期为当前日期前一天
            onClose: false,
            okfun: function (obj) {
                setDataFlag = true;
                timerData = [];
                timerData.push(end.minDate);
                timerData.push(obj.val);
                if ((getData.line_id === "")) {
                    //弹窗提示请先选择线路
                    return;
                }
                start.maxDate = obj.val; //将结束日的初始值设定为开始日的最大日期
                getLineData();
            },
            //清空的事件回调
            clearfun: function () {
                setDataFlag = false;
            }
        };

        //根据不同参数请求数据
        function getLineData() {
            //初次加载默认展示前一天数据,每次赋值时置空；
            getData.offdatess = '';
            if (isFrist) {
                getData.offdatess = $.getDateString('-1');
                isFrist = false;
            } else {
                getData.offdatess = timerData.join(",");
            }
            obj.fn2(getData);
            //请求ajax
            $.ajax({
                url: $.getPath + '/Satisfaction/list',
                type: 'get',
                dataType: 'json',
                data: getData,
                success: function (data) {
                    $obj.fn(data);
                }
            });
            //动态去设置table
            var $table = $(".table-identical");
            $table.html('');
            $table.creatTable({'getData':getData,'url':$.getPath + '/Satisfaction/list',theadArr:$obj.theadArr});
        }
        //开始时间
        $('.getStartTime').jeDate(start);
        $(".getEndTime").jeDate(end);

//这里是日期联动的关键
        function endDates() {
            //将结束日期的事件改成 false 即可
            end.trigger = false;
            //结束时间
            $(".getEndTime").jeDate(end);
        }

    }

    //迁徙图
    function Pmgressbar(){
        var _this = this;
        //间隔多少时间触发一次请求，或者说刷新一次显示；单位为分钟默认15分钟
        this.space = 15;
        //当前播放进度的宽度；即播放进度；
        this.changeWidth = 0;
        //进度条截止点；
        this.Mwidth = $('.pmgressbar').width();
        //进度条开始点；
        this.minWidth = 0;
        // 根据指定的间隔时间来计算步长
        this.steep =  Math.floor(_this.Mwidth/24/60*_this.space);
        //拖动进度条时鼠标点击时的x轴距离
        this.startX = 0;
        //拖动进度条时鼠标拖动结束点
        this.endX = 0;
        //拖动进度条时鼠标拖动距离
        this.moveX = 0;
        //进度条是否能被拖动
        this.isMove = false;
        //延时
        this.timer = {};
        //进度条是否处于能播放的状态；
        this.isAction = true;
        //是否是点击事件
        this.clickEv = false;
        this.startBar();
        this.movebar();

    }
    Pmgressbar.prototype = {
        changeBar : function(){
            var _this = this;
            if(!this.isMove){
                this.changeWidth+=1;
            }
            if(_this.changeWidth>this.Mwidth||_this.changeWidth<this.minWidth){
                _this.stopBar();
            }else{
                _this.getData();
                $(".end").css({"top":Math.ceil(this.changeWidth/this.Mwidth*25),"left":this.changeWidth+5});
                $(".bar").css({'width':this.changeWidth},600);
            }
        },
        movebar : function(){
            var _this = this;
            var timers = 0;
            var run = null;
            $(document).on("mouseenter",'.pmgressbar',function() {
                _this.stopBar();
            }).on("mouseleave",".pmgressbar",function() {
                if(!_this.isAction){
                    _this.isAction = true;
                    _this.startBar();
                }
            });
            $(document).on('mousedown','.pmgressbar',function(){
                _this.clickEv = false;
            })
            $(document).on('mouseup','.pmgressbar', function(event) {
                if(_this.clickEv)return;
                if(event.target.className!='pmgressbar'&&event.target.className!='bar')return;
                _this.stopBar();
                event.preventDefault();
                console.log("offset:"+$(this).offset().left+"clientX:"+event.clientX);
                var clickOffset = event.clientX-$(this).offset().left;
                if(clickOffset>=_this.Mwidth){
                    clickOffset=_this.Mwidth;
                }else if(clickOffset<=_this.minWidth){
                    clickOffset=_this.minWidth;
                }
                clickOffset>=_this.changeWidth?add.call(_this):minus.call(_this);
                _this.clickEv  = false;
                //点击位置是需要增加的
                function add(){
                    for(this.changeWidth;this.changeWidth<=clickOffset;this.changeWidth++){
                        this.getData();
                    }
                    getMoveTo.call(this);
                }
                //点击位置是需要减小的
                function minus(){
                    for(this.changeWidth;this.changeWidth>=clickOffset;this.changeWidth--){
                        this.getData();
                    }
                    getMoveTo.call(this);
                }

                function getMoveTo(){
                    $(".end").animate({"top":Math.ceil(this.changeWidth/this.Mwidth*25),"left":this.changeWidth+5},600);
                    $(".bar").animate({'width':this.changeWidth},600);
                }
                /* Act on the event */
            });

//拖动播放条事件
            $(".pmgressbar").on("mousedown",".end",function(event){

                event.preventDefault();
                _this.isMove = true;
                _this.clickEv = true;
                _this.startX = event.clientX;
                _this.stopBar();
            });
            $(document).on("mouseup",function(e){
                if(_this.isMove){
                    _this.isMove = false;
                    _this.isAction = true;
                    _this.startBar();
                }

            });
            $(document).on('mousemove',function(event) {
                event.preventDefault();
                /* Act on the event */
                if(_this.isMove){
                    _this.stopBar();
                    _this.changeWidth = event.clientX-$(".pmgressbar").offset().left;
                    if(_this.changeWidth>_this.Mwidth||_this.changeWidth<_this.minWidth){
                    }else{
                        _this.changeWidth = _this.changeWidth+_this.moveX;
                        _this.changeBar();
                    }
                }
            });
        },
        stopBar : function(){
            this.isAction = false;
            clearInterval(timerEcharts);
            timerEcharts = null;
        },
        startBar : function(){
            var _this = this;
            _this.waitDo("waitStart",function(){
                if(_this.isAction){
                    timerEcharts = setInterval(function(){
                        _this.changeBar();
                        _this.isAction = false;
                    },50);
                }
            },50)

        },
        getData : function (){
            if(this.changeWidth%this.steep==0){
                //满足条件就请求数据，改变图形
                setEcharts();
                // console.log(this.changeWidth/this.steep)
            }
            function setEcharts(){

            }
        },
        waitDo : function (id, fn, wait) {
            //id事件名称  fn执行事件 wait等待时间
            var _this = this;
            if (_this.timer[id]) {
                window.clearTimeout(this.timer[id]);
                delete _this.timer[id];
            }
            return _this.timer[id] = window.setTimeout(function() {
                fn();
                delete _this.timer[id];
            },wait);
        }
    }
})(jQuery, window, document);


