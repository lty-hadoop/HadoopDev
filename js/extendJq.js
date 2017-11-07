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
        this.$ul = $('<ul class=" pageInfo dis_f jst_r bd_1 " style="border-radius: 2px;"><li class="first bd_1 line_h30 text_c w_30 h_30">&lt;&lt;</li><li class="prev bd_1 line_h30 text_c w_30 h_30 ">&lt;</li>' +
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
            _this.stopEvent(ev);
            _this.nowPage = parseInt($(this).html());
            _this.setPage();

        });
        //点击下一页
        this.$ul.on("click",".next",function(ev){
            _this.stopEvent(ev);
            if(_this.nowPage==_this.pageNum)return;
            _this.nowPage++;
            _this.setPage(_this.nowPage);

        });
        //点击上一页
        this.$ul.on("click",".prev",function(ev){
            _this.stopEvent(ev);
            if( _this.nowPage==1)return;
            _this.nowPage--;
            _this.setPage();
        });
        //点击第一页
        this.$ul.on("click",".first",function(ev){
            _this.stopEvent(ev);
            if( _this.nowPage == 1)return;
            _this.nowPage = 1;
            _this.setPage();
        });
        //点击到最后一页
        this.$ul.on("click",".last",function(ev){
            _this.stopEvent(ev);
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
    },
    stopEvent:function(ev){
        ev = ev || window.event;
        if(ev.stopPropagation) ev.stopPropagation();
        else ev.cancelbubble = true;
    }
};

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
    topColot : ['#1c84c6','#23c6c8','#1ab394','#1ab394','#1ab394','#1ab394'],
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
    this.opts = $.extend({}, $.fn.creatList.opts, options);
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
        this.$content = $('<div class="plugin-topList w_auto"></div>');
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
                            console.log(page);
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
                _this.$li = $('<li class="bd_b1 h_40 dis_f jst_sb item_c"><div class="dis_f item_c"><p style="background:'+_this.opts.topColot[index]+'"  class="w_25 h_25 text_c line_h25 mg_r20">'+(index*1+1)+'</p><span>'+value[_this.opts.simpleData.name]+'</span></div><span>'+value[_this.opts.simpleData.hotData]+'</span></li>')
                _this.$ul.append( _this.$li);
            });
            this.$content.append(this.$title).append(this.$ul);
        }
    }
};

