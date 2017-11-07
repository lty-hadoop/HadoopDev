
$.extend({
    /**
     * [setPosition]     该方法直接挂在jq的$上面，调用$.setPosition()；用来设置动态加载栏下面的操作栏
     * @param {[type]} mian      除去header和footer区域的中间内容区域的容器的class
     * @param {[type]} obj       需要设置定位的容器的class
     * @param {[type]} marginTop 设置该容器距离上一个容器的上部外边距
     * @param {[type]} window    [description]
     * @param {[type]} document  [description]
     */
    setPosition: function (mian, obj, marginTop, window, document) {
        var subCar = $("." + obj);
        var $mian = $("." + mian);
        var wHeight = $(window).height();
        var dHeight = $mian.outerHeight(false);
        var midHeight = subCar.outerHeight(false);
        var demp = dHeight - midHeight;
        var $marginTop = marginTop || 15;
        if (demp >= wHeight) {
            subCar.css({"position": "fixed", "margin": "0 auto", "width": "1000"});
            subCar.animate({"bottom": "8"}, 300);
        }
        window.onscroll = function () {
            var scrollTop = document.body.scrollTop;
            if (scrollTop + wHeight >= dHeight + midHeight) {
                subCar.css({"position": "relative", "marginTop": $marginTop, "width": "1000"});
            } else {

                subCar.css({"position": "fixed", "margin": "0 auto", "width": "1000"});
                subCar.animate({"bottom": "8"}, 300);
            }
        }
    },
    /**
     * [waitDo description] 延时触发事件执行函数
     * @param  {[type]}   id   [description]事件的id
     * @param  {Function} fn   [description]事件触发的函数
     * @param  {[type]}   wait [description]事件延时毫秒
     * @return {[type]}        [description]
     */
    waitDo: function (id, fn, wait) {
        if (window.timer[id]) {
            window.clearTimeout(window.timer[id]);
            delete window.timer[id];
        }
        return window.timer[id] = window.setTimeout(function () {
            fn();
            delete window.timer[id];
        }, wait);
    },
    /**
     * [findCity description]该方法可以直接通过省市区的id来获取名称。返回，名称
     * @param  {[type]} province_id [description]省份id
     * @param  {[type]} city_id     [description]城市id
     * @param  {[type]} area_id     [description]区id
     * @return {[type]}             [description]
     */
    findCity: function (province_id, city_id, area_id, flag) {
        var province, city, area;
        //获取省
        for (i in ChineseDistricts["86"]) {
            if (i == province_id) {
                province = ChineseDistricts["86"][i];
            }
        }
        //获取市/区
        for (i in ChineseDistricts) {
            if (i == province_id) {
                var data = ChineseDistricts[i];
                for (i in data) {
                    if (i == city_id) {
                        city = data[i];
                    }
                }
            }
            if (i == city_id) {
                var data = ChineseDistricts[i];
                for (i in data) {
                    if (i == area_id) {
                        area = data[i];
                    }
                }
            }
        }
        if (flag == true) {
            return province + "," + city + "," + area;
        } else {
            return province + city + area;
        }

    },
    stopEvent: function (ev) {
        ev = ev || window.event;
        if (ev.stopPropagation) ev.stopPropagation();
        else ev.cancelbubble = true;
    },
    quit: function () {
        $(".header_details").find(".quit").on("click", function () {
            layer.msg('你确定要退出登录吗？', {
                time: 0 //不自动关闭
                , btn: ['确定', '取消']
                , yes: function (index) {
                    $.ajax({
                        url:  '/user/logOut',
                        type: "POST",
                        dataType: "json",
                        success: function (data) {
                            if (data.type == "SUCCESS") {
                                layer.close(index);
                                window.location.href = '/htmls/mall/index.html'
                            }
                        }
                    });
                }
            });
        });
    },
    setSupplierHeader: function (cbfn) {
        // $(".supplierlogo").on("click","img",function(){
        //     window.location.href = '/htmls/mall/index.html';
        // });
        // $(".supplierheader").append('<div class="codeImg"><p>正思用户体验微信群</p><img src="../../resources/images/mall/weixinqun.jpg" alt=""><p>欢迎您加入!!!</p><p>在这里我们有专业的客服为您解决问题。</p><p>客服QQ : 1312566030</p></div>');
        //头部区域设置
        $.ajax({
            url: "/user/userinfo",
            type: "POST",
            dataType: "json",
            success: function (data) {
                //console.log(data)
                if(data.type=="SUCCESS"){
                    $(".supplierheader").find(".userName").find(".userSet").html(data.data.username);
                    $(".supplierheader").find(".userName").find(".userQuit").on("click", function () {
                        layer.closeAll();
                        layer.msg('你确定要退出登录吗？', {
                            time: 0 //不自动关闭
                            , btn: ['确定', '取消']
                            , yes: function (index) {
                                $.ajax({
                                    cache:false,
                                    url: '/user/logOut',
                                    type: "POST",
                                    dataType: "json",
                                    success: function (data) {
                                        if (data.type == "SUCCESS") {
                                            layer.close(index);
                                            window.location.href = '/htmls/login/login.html'
                                        }
                                    }
                                });
                            }
                        });
                    })
                }
            }
        });
        var $supplierNav = $(".supplierNav");
        //TODO左侧导航栏事件
        var $orderList = $(".supplierList").find(".orderList");
        $supplierNav.on('click', 'li', function (ev) {
            $.stopEvent(ev);
            var i = $(this).index();
            $(this).addClass('active').siblings().removeClass("active");
            switch (i) {
                case 0 : //工作台
                    window.location.href = '/htmls/supplier/supplierBench.html';
                    break;
                case 1 : //订单管理
                    window.location.href = '/htmls/supplier/supplier.html';
                    break;
                case 2 : //商品管理
                    window.location.href = '/htmls/supplier/goodsManage.html';
                    break;
                case 3 : //账户概要
                    window.location.href = '/htmls/supplier/accountBrief.html';
                    break;
                case 4 : //个人信息
                    window.location.href = '/htmls/supplier/personageInfo.html';
                    break;
                case 5 : //通知
                    break;
            }
        });
        $(".supplierfooter").load("/htmls/html/codeFooter.html");
        cbfn();
    },
    getFileUrl : function (sourceId) {
        var url;
        if (navigator.userAgent.indexOf("MSIE")>=1) { // IE
            url = document.getElementById(sourceId).value;
        }
        else if(navigator.userAgent.indexOf("Firefox")>0) { // Firefox
            url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
        }
        else if(navigator.userAgent.indexOf("Chrome")>0) { // Chrome
            url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
        }
        return url;
    }
// //点击搜索商品
    // search:function(value,province,city,area){
    //     $.ajax({
    //         url:"/elasticsearch/queryES",
    //         type:"get",
    //         data:{
    //             param:value,
    //             page:1,
    //             pagesize:10,
    //             province:province,
    //             city:city,
    //             area:area
    //         },
    //         dataType:"json",
    //         contentType: "charset=utf-8",
    //         success:function(data){
    //             console.log(data);
    //             return data;
    //         }
    //     })
    // }
})


//获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

function getFormatDates(date) {
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var hours = date.getHours();
    var min = date.getMinutes();
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + hours + seperator2 + min;
    return currentdate;
}

function getFormatDate(date) {
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

/**
 * [toLocaleString description] 该方法将后台返回的时间戳，转化为我们需要的格式2017-5-27 16:15:27
 * @return {[type]} [description]   调用就是用                var ceartTime =  new Date(后台时间戳);
 *                                                                ceartTime = ceartTime.toLocaleString();
 */
Date.prototype.toLocaleStringData = function () {
    var  getMonth = this.getMonth()+1;
    getMonth = setData(getMonth);
    var getDate = this.getDate();
    getDate = setData(getDate);
    var getHours = this.getHours();
    getHours = setData(getHours);
    var getMinutes = this.getMinutes();
    getMinutes = setData(getMinutes);
    var getSeconds = this.getSeconds();
    getSeconds = setData(getSeconds);
    function setData(data){
        if(data<10){
            return  '0'+data;
        }else{
            return data;
        }
    }
    return this.getFullYear() + "-" + getMonth + "-" + getDate + " " + getHours + ":" + getMinutes + ":" + getSeconds;
};
// $.fn.append = function() {
//     var that=this;
//     return this.domManip(arguments, true, function( elem ) {
//         if ( this.nodeType === 1 || this.nodeType === 11 ) {
//             that.appendChild( elem );
//             that=null;
//         }
//     });
// };
//动态获取IP  获取服务器IP  top.location.origin
$.ajaxHttp = "";
$.ajaxPort = "";



