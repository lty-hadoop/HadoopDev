
;
(function($, window, document, undefined) {
    function stopEvent(ev){
        ev = ev || window.event;
        if(ev.stopPropagation) ev.stopPropagation();
        else ev.cancelbubble = true;
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
                '            <li class="next bd_1 line_h30 text_c w_30 h_30">&gt;</li>' +
                '            <li class="last bd_1 line_h30 text_c w_30 h_30">&gt;&gt;</li></ul>');
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
                    this.starPage = this.nowPage - this.pageOffset;
                    this.endPage = this.pageNum>(this.nowPage + this.pageOffset)?(this.nowPage + this.pageOffset):this.pageNum ;

                }else{
                    this.starPage = 1;
                    this.endPage = this.showPage ;
                }
                if(this.pageNum < this.pageOffset + this.nowPage ){
                    var star = this.starPage - (this.nowPage  + this.pageOffset - this.endPage);
                    this.starPage = (this.showPage/2)==this.pageOffset? star+1 : star;
                }
            }
            //修改页码
            var index = 0;
            for(var i = this.starPage;i<= this.endPage;i++,index++){
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
        showNum : 6,
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
            "name":"name",
            "hotData":"hotData",
            "dataTitle":"dataTitle",
            "dataFrom":"dataFrom"
        },
        //标题
        dataTitle : null,
        //数据来源名称
        dataFrom : null

    }
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
            this.$content = $('<div class="plugin-topList w_auto" ></div>');
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
                    success:function(data){
                        //如果用户有传入自定义的渲染函数,就执行用户传入的，没有就自己渲染
                        _this.renderFn!=null?_this.renderFn(data):randerData.call(_this,data.data);
                    }
                });
            }else{
                $.ajax({
                    url : this.opts.url,
                    type : this.opts.type,
                    dataType : this.opts.dataType,
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
                this.$content.html("");
                if(data.dataTitle&&data.dataFrom){
                    this.opts.dataTitle = data.dataTitle;
                    this.opts.dataFrom = data.dataFrom;
                }
                this.$title = this.opts.sourceFlag?$('<div class="title"><div class="titleName">'+this.opts.titleData+'</div><div class="dataSouce">'+this.opts.dataFrom+'</div>\n' +
                    '        </div>'):$('<h2 class="bd_b1">'+this.opts.dataTitle+'</h2>');
                this.$ul = $('<ul class="pd_25 pd_t5"></ul>');
                $.each(data,function(index,value){
                    _this.$li = $('<li class="bd_b1 h_40 dis_f jst_sb item_c"><div class="dis_f item_c"><p style="background:'+_this.opts.topColor[index]+'"  class="w_25 h_25 text_c line_h25 mg_r20">'+(index*1+1)+'</p><span>'+value[_this.opts.simpleData.name]+'</span></div><span>'+value[_this.opts.simpleData.hotData]+'</span></li>')
                    _this.$ul.append( _this.$li);
                });
                this.$content.append(this.$title).append(this.$ul);
            }
        }
    };

    //下拉选择枚举组件
    $.fn.selectpick = function(options){
            options.el = $(this);
            var select = new Selectpick(options);
        $(this).on("click",function(ev){
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
    }
    //构造函数
    function Selectpick(options){
        this.$ele = options.el;
        this.opts = $.extend({},$.fn.selectpick.opts,options);
        this.cbFn = options.cbFn||function(){};
        this.init();
    }
    //方法挂载
    Selectpick.prototype = {
        //初始化
        init : function(){
            this.outdiv = $('<div class="of_h selectpickDiv" ></div>');
            $(document.body).append(this.outdiv);
            this.$content = $('<ul class="selectpickUl w_auto"></ul>');
            this.outdiv.append(this.$content);
            this.hide();
            this.getData('');
            this.bindEvent();
        },
        getData : function(passData){
            var _this = this;
            //这里加查询参数；
            // _this.opts.data.data = 关键词;
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
            this.outdiv.creatPage({
                itemSize:data[_this.opts.simpleData.total],
                showNum : _this.opts.showNum,
                showPage : _this.opts.showPage,
                callBack : function(page){
                    console.log(page)
                    _this.opts.getData['page'] = page;
                    $.ajax({
                        url:_this.opts.url,
                        type:_this.opts.sendType,
                        dataType:_this.opts.dataType,
                        data:_this.opts.getData,
                        success:function(data){
                            _this.rander(data.data);
                        }
                    })
                }
            })
        },
        rander:function (data){
            var _this = this;
            _this.$content.html('');
            $.each(data,function(index,value){
                _this.$li = $('<li class="option">'+value[_this.opts.simpleData.name]+'</li>');
                _this.$content.append(_this.$li);
                _this.$li.data('data',value);
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
        setPosition : function(){
            var _this = this;
            _this.outdiv.css({top:_this.offsetT,left:_this.offsetL});
        },
        show : function(){
            var _this = this;
            this.setWidth = this.$ele.width();
            this.offsetL = this.$ele.offset().left;
            this.offsetT = this.$ele.offset().top*1+6+this.$ele.height();
            this.outdiv.css({width:_this.setWidth});
            this.setPosition();
            this.outdiv.show();
        },
        hide : function(){
            this.outdiv.hide();
        }
    }

})(jQuery, window, document);


/**
 * Created by sinarts on 17/2/22.
 */
(function(root, factory) {
    //amd
    if (typeof define === "function" && define.amd) {
        define([ "jquery" ], factory);
    } else if (typeof exports === "object") {
        //umd
        module.exports = factory();
    } else {
        root.jeTable = factory(window.$ || $);
    }
})(this, function($) {
    var regPxe = /\px|pt|em|rem/g,je = {},
        jeTable = function(elem, opts) {
            var config = {
                skin:"je-grid",                    //默认风格
                width:"100%",                             //表格标签宽度
                height:"auto",                            //表格标签宽度
                columnSort:[],                            //头部可排序的数，如[1,3,5],其中1表示第一个可排序
                columns:[],                               //数据模型
                pageField:{                               //分页对象或函数
                    pageIndex:{field:"size",num:1},       //默认为第一页
                    pageSize:{field:"pagesize",num:12},   //默认每页显示12条
                    dataCount:"",                         //数据记录统计字段
                    pageCount:"",                         //页码统计字段
                    ellipsis:false                        //是否显示两边省略号
                },
                datas:{url:"",type:"GET",data:{},dataType:"json",field:""},  //AJAX请求的参数。可以是普通对象或函数。 函数返回一个参数对象
                isPage:true,                              //是否显示分页
                itemfun:function(elem,data) {},           //当前的回调，elem为表格当前行的ID, data为表格当前行的数据
                success:null                              //加载成功后的回调
            };
            this.opts = $.extend(true,config, opts || {});
            this.elCell = elem;
            this.init();
        };

    je.isBool = function(obj){  return (obj == undefined || obj == true ?  true : false); };

    $.fn.jeTable = function(options) {
        return this.each(function() {
            return new jeTable($(this), options || {});
        });
    };
    $.extend({
        jeTable:function(elem, options) {
            return $(elem).each(function() {
                return new jeTable($(this), options || {});
            });
        }
    });
    var jefn = jeTable.prototype;
    jefn.init = function () {
        var that = this, opts = that.opts, pageIdxSize = {}, pgField = opts.pageField;
        var theadDiv = $('<div class="' + opts.skin + '-thead"></div>');
        that.elCell.html(theadDiv.append("<table ><thead jetableth><tr></tr></thead><tbody jetabletd></tbody></table>"));
        theadDiv.after("<div class='fielddrop'></div>");
        that.setContent();
        pageIdxSize[pgField.pageIndex.field] = pgField.pageIndex.num;
        pageIdxSize[pgField.pageSize.field] = pgField.pageSize.num;
        that.loadDates(theadDiv,pageIdxSize);
    };

    jefn.loadDates = function (elem,datas) {
        var that = this, opts = that.opts, colDate = opts.columns, dataObj = opts.datas;
        var pgField = opts.pageField, dataArr = $.extend(dataObj.data,datas);
        var tbody = that.elCell.find("tbody[jetabletd]");
        //载入内容前先清空
        tbody.empty();
        //把数据插入到tbody内
        var tbodySuccess = function (data,json) {
            json = json || "";
            tbody.empty();
            //循环数据插入内容
            $.each(data,function(idx,val){
                var tr = $("<tr row='"+idx+"'></tr>");
                $.each(colDate,function (i,d) {
                    var isShow = je.isBool(d.isShow), alVal = d.align||"left";
                    var renVal = (d.renderer != "" && d.renderer != undefined) ? d.renderer(val,idx) : val[d.field],
                        tdCls = $("<td class='field-"+d.field+"'><div>"+renVal+"</div></td>").addClass("dfields").attr("align",alVal);
                    tr.append(isShow ? tdCls : tdCls.hide());
                });
                tbody.append(tr);
                //加载成功后的回调
                if ($.isFunction(opts.itemfun) || opts.itemfun != ("" || null)) {
                    opts.itemfun && opts.itemfun(tr,val);
                }
            });
            //表格分页设置，判断分页DIV是否已经存在，如果不存在就创建
            if (opts.isPage && that.elCell.find("."+ opts.skin +"-page").length == 0){
                //创建分页DIV
                var pageDiv = $('<div class="' + opts.skin + '-page"></div>');
                elem.append(pageDiv);
                //执行分页插件
                pageDiv.jeTablePage({
                    dataCount:json[pgField.dataCount],
                    pageCount:json[pgField.pageCount],
                    ellipsis:pgField.ellipsis,
                    jumpChange:function (page) {
                        //获取分页页码的key值与当前分页数组成对象
                        var obj = {};
                        obj[pgField.pageIndex.field] = page;
                        //点击后刷新内容加载
                        that.loadDates(elem,$.extend(true,dataArr,obj));
                    }
                });
            }
            //下拉按钮与字段列表的显示隐藏
            var eltheadCls = that.elCell.find("."+ opts.skin +"-thead"),
                fielddrop = that.elCell.find(".fielddrop");
            eltheadCls.on("mouseenter",function(){
                if(fielddrop.is(":hidden")) fielddrop.slideDown('fast');
            });
            $("."+ opts.skin).on('mouseleave', function(){
                fielddrop.slideUp('fast');
            });
            that.elCell.find("."+ opts.skin +"-tbody").on("mouseenter",function(){
                if(fielddrop.is(":visible")) fielddrop.slideUp('fast');
            });
            //点击显示字段列表
            fielddrop.on("click",function(){
                var elfieldCls = that.elCell.find("."+ opts.skin +"-field");
                fielddrop.hide();
                elfieldCls.slideDown('fast');
                //点击隐藏字段列表
                elfieldCls.find("h3 em").on("click",function(){
                    elfieldCls.slideUp('fast');
                })
            });
            //加载成功后的回调
            if ($.isFunction(opts.success) || opts.success != "" || opts.success != null) {
                opts.success && opts.success(that.elCell,tbody);
            }
        };
        //拉取数据
        if ($.isArray(dataObj)) {
            tbodySuccess(dataObj,"");
        } else {
            $.ajax({
                url: dataObj.url,
                type: dataObj.type,
                data: dataArr || {},
                dataType: dataObj.dataType || "json",
                async: dataObj.async || true,
                success: function (json) {
                    var rowVal = dataObj.field == "" ? json : json[dataObj.field];
                    if(rowVal.length == 0 || rowVal == undefined){
                    }else {
                        tbodySuccess(rowVal,json);
                    }
                }
            });
        };
    };
    //表格基本框架与宽度设置
    jefn.setContent = function () {
        var that = this, opts = that.opts,colDate = opts.columns,
            thead = that.elCell.find("thead[jetableth]"),
            tbody = that.elCell.find("tbody[jetabletd]");
        //设置头部
        $.each(colDate,function (i,d) {
            var  nameval ,dname = d.name;
            nameval = $.isArray(dname) ? ($.isFunction(dname[1]) ? dname[1](dname) : dname[1]) : dname;
            var althVal = d.align||"left";
            var thCls = $("<th class='field-"+d.field+"'><div>"+nameval+"</div></th>").addClass("dfields").attr("align",althVal);
            thead.find("tr").append(thCls);
        });

        //进行表格排序
        if (opts.columnSort.length > 0){
            that.tableSorter({elhead:thead, elbody:tbody, colSort:opts.columnSort});
        }
    };
    //表格排序
    jefn.tableSorter = function (obj) {
        var colSort = obj.colSort, eltop = obj.elhead, thCls = eltop.find(" th"),all = "all", sa = "asc", sd = "desc",
            elcon = (obj.elbody == "" || obj.elbody == undefined) ? eltop : obj.elbody;
        $.each(colSort, function(i, d) {
            thCls.eq(d-1).addClass("colsort all").attr("sort", sa).append("<em></em>");
        });
        //取出TD的值，并存入数组,取出前二个TD值；
        var setSort = function(idx,sorted) {
            var sortedMap = [];
            elcon.find("tr").each(function() {
                var ts = $(this), tdVal = ts.children("td").eq(idx).text();
                sortedMap.push({row: ts, vals:tdVal});
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
                return sorted == sa ? dateSort(a, b) : dateSort(b, a);
            });
            $.each(sortedMap,function(key,val){
                elcon.append(val.row);
            });
        };
        //点击表格升序/降序
        thCls.on("click",function () {
            var _this = $(this), idx = _this.index();
            if(_this.hasClass("colsort")) {
                eltop.find(" th.colsort").addClass(all);
                thCls.removeClass(sd).removeClass(sa);
                var deasc = _this.attr("sort") == sa ? sd : sa;
                if (_this.attr("sort") == sa) {
                    _this.attr("sort", sd);
                    _this.removeClass(all).addClass(sd);
                } else {
                    _this.attr("sort", sa);
                    _this.removeClass(all).addClass(sa);
                }
                setSort(idx, deasc);
            }
        })
    }
    return jeTable;
});

;(function($) {
    var isEven = function (num) {  // true偶数, false奇数
        return (parseInt(num)%2 == 0) ? true : false;
    }, jePage = function(elem, options) {
        var defaults = {
            pageIndex: 1,            //当前页码，1表示第一页
            pageSize: 5,             //每页显示数量
            pageCount: 50,           //显示项的总数量
            dataCount: 0,
            ellipsis:true,           //是否显示两边省略号
            firstText: '首页',//
            lastText: '尾页',
            prevText: "上一页",       //上一页按钮显示的文字
            nextText: "下一页",       //下一页按钮显示的文字
            hashUrl: null,           //构造页码按钮链接href的方法,包含一个pageIndex参数，不传则返回"javascript:;"
            jumpChange: null         //点击页码后的回调函数，包含一个pageIndex参数
        };
        this.elCell = elem;
        this.opts = $.extend(defaults, options || {});
        this.init();
    };
    $.fn.jeTablePage = function(options) {
        return this.each(function() {
            return new jePage($(this), options || {});
        });
    };
    var jepg = jePage.prototype;
    jepg.init = function () {
        var that = this, opts = that.opts;
        this.createHtml(opts.pageIndex);
        that.bindEvent();
    };
    jepg.createHtml = function(pagenum) {
        pagenum = parseInt(pagenum);
        if(isEven(this.opts.pageSize)){alert("请将pageSize设为奇数，且不能小于3");return}
        var that = this, opts = that.opts, html = [],
            start = opts.pageIndex, group = opts.pageSize,
            pageCount = Math.ceil(opts.pageCount),
            dataCount = parseInt(opts.dataCount),
            onBoth = Math.floor(opts.pageSize / 2);
        if (pagenum >= group) {
            start = pagenum - onBoth;
            group = pagenum + onBoth;
        }
        if (group > pageCount) {
            start = pageCount - onBoth*2;
            group = pageCount;
        }
        if (start < 1) start = 1;
        //统计页码的条数
        html.push('<span class="pagecount">共<em>' + pageCount + '</em>页</span>');
        //统计数据的条数
        if (dataCount > 0 || dataCount != "") {
            html.push('<span class="datacount">共<em>' + dataCount + '</em>条记录</span>');
        }
        //生成上一页的按钮
        if (pagenum > 1) {
            html.push('<a data-page="' + (pagenum - 1) + '" href="' + that.hashUrl(pagenum - 1) + '" class="flip" title="上一页">' + opts.prevText + '</a>');
        } else {
            html.push('<span class="flip noPage" title="上一页">' + opts.prevText + '</span>');
        }
        // 第一页
        if (pagenum > opts.pageSize - 1) {
            var firstText = opts.ellipsis ? (opts.firstText == "" ? 1 : opts.firstText) : opts.firstText;
            html.push("<a href='" + that.hashUrl(1) + "' data-page='" + 1 + "' class='flip' title='"+firstText+"'>"+firstText+"</a> ");
            if(opts.ellipsis) html.push("<span>···</span>");
        }
        // 循环渲染可见的按钮
        for (var i = start; i <= group; i++) {
            if(i == pagenum){
                html.push('<span class="current">' + i + '</span>');
            }else{
                html.push('<a href="' + that.hashUrl(i) + '" data-page="' + i + '" title="' + i + '">' + i + '</a>');
            }
        }
        // 最后一页
        if (pagenum < pageCount - (onBoth + 1)) {
            var lastText =  opts.ellipsis ? (opts.lastText == "" ? pageCount : opts.lastText) : opts.lastText;
            if(opts.ellipsis) html.push("<span>···</span> ");
            html.push("<a href='" + this.hashUrl(pageCount) + "' data-page='" + pageCount + "' class='flip' title='" + lastText + "'>" + lastText + "</a> ");
        }
        //生成下一页的按钮
        if (pagenum < pageCount) {
            html.push('<a data-page="' + (pagenum + 1) + '" href="' + that.hashUrl(pagenum + 1) + '" class="flip" title="下一页">' + opts.nextText + '</a>');
        } else {
            html.push('<span class="flip noPage">' + opts.nextText + '</span>');
        }
        //跳转设置页码
        html.push('<span>转到<input type="text" class="gopage"><button type="button" class="gobtn">Go</button></span>');
        that.elCell.html("<div class='pagebox'>"+html.join("")+"</div>");
    };
    jepg.bindEvent = function() {
        var that = this, opts = that.opts;
        that.elCell.on("click", "a", function() {
            var pageIndex = parseInt($(this).data("page"), 10);
            that.createHtml(pageIndex);
            opts.jumpChange && opts.jumpChange(pageIndex);
        });
        that.elCell.on("click", ".gobtn", function() {
            var indexVal = that.elCell.find(".gopage").val();
            if(indexVal != ""){
                that.setPageIndex(indexVal);
            }
        });
    };
    jepg.hashUrl = function(pageIndex) {
        var that = this, opts = that.opts;
        if ($.isFunction(opts.hashUrl)) {
            return opts.hashUrl(pageIndex);
        }
        return "javascript:;";
    };
    jepg.setPageIndex = function(pageIndex) {
        this.createHtml(pageIndex);
        this.opts.jumpChange && this.opts.jumpChange(pageIndex);
    };
    var jeTablePage = function(y,m,d) {
        return new jePage(new Date(y,m,d));
    };
    return jeTablePage;
})(jQuery);