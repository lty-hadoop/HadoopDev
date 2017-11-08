
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
                            itemSize : data.totle,
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