$(function ($) {clearInterval($.timerEcharts);
    // 退出
    $('.log-out').on('click', function(){
        window.location.href = "index.html";
    });

    var userName = localStorage.getItem('user');
    $('.username').text(userName);
    $.timerEcharts = null;
    var $navUl = null;
    var $loadContent = $(".loadContent");
    // 针对不同屏幕设置显示样式
    if ($(this).width() < 769) {
        $('body').addClass('body-small')
    } else {
        $('body').removeClass('body-small')
    }
    $navUl = $("#side-menu");
    $loadContent.load('html/passengerFlow.html',function(){
        $(document.body).append('<script src="js/passengerFlow.js"></script>');
    });
    var setBarFlag = true;
    //设置侧边栏导航最初显示形式；
    SmoothlyMenu();
    // 初始化侧边栏导航
    //根据窗口大小变化动态设置当前侧边栏导航的形式
    $(window).on("resize", function () {
        SmoothlyMenu();
    });

    function SmoothlyMenu() {
        var winWidth = null;
        if (window.innerWidth)
            winWidth = window.innerWidth;
        else if ((document.body) && (document.body.clientWidth))
            winWidth = document.body.clientWidth;
        if (winWidth < 768 && setBarFlag) {
            setBarFlag = false;
            $('body').addClass('body-small')
        } else if (winWidth > 768 && !setBarFlag) {
            setBarFlag = true;
            $('body').removeClass('body-small')
        } else {
            return;
        }
        $("body").toggleClass("mini-navbar");
        if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
            $('#side-menu').hide();
            setTimeout(
                function () {
                    $('#side-menu').fadeIn(200);
                }, 150);
        } else if ($('body').hasClass('fixed-sidebar')) {
            $('#side-menu').hide();
            setTimeout(
                function () {
                    $('#side-menu').fadeIn(200);
                }, 100);
        } else {
            $('#side-menu').removeAttr('style');
        }
    }
    //配置侧边栏导航
    $.ajax({
        url: 'json/nav.json',
        type: 'get',
        dataType: 'json',
        success: function (data) {
            $.each(data, function (index, val) {
                creatNav(val, index);
            });
            navBindEvent();
        }
    });

    function creatNav(data, index) {
        var $li = $('<li class="navFrist" slideFlag="1"><a><i class="fa ' + data.icon + '"></i><span class="nav-label">' + data.navigationName + '</span></a></li>');
        if (index == 0) $li.addClass('active');
        $li.data('data', data);
        $navUl.append($li);
        if (data.navChild.length != 0) {
            $li.find("a").append('<span class="fa arrow"></span>');
            var $nextul = $('<ul class="nav nav-second-level collapse"></ul>');
            $li.append($nextul);
            $.each(data.navChild, function (index, scVal) {
                var $scLi = $('<li class="scNav"><a>' + scVal.navigationName + '</a></li>');
                $scLi.data('data', scVal);
                $nextul.append($scLi);
            })
        }
    }
    //绑定侧边栏导航点击事件；
    function navBindEvent() {
        var animate = ["","animation","animation1","animation2","animation3"];
        $navUl.on("click", 'li', function (e) {
            if($(this).index()==1&&$(this).html()!=='<a>满载率与拥挤满意度</a>'&&$(this).html()!=='<a>站点评价</a>') {
                window.location.reload();
                return;
            }
            var index = Math.ceil(Math.random()*4);
            var animateClass = animate[index];
            e.stopPropagation();
            var $down = $navUl.find('.down');
            var data = $(this).data('data');
            if (data.navigationUrl != '') {
                $loadContent.addClass(animateClass);
                $navUl.find('.scNav').removeClass('active');
                $loadContent.load(data.navigationUrl,function(){
                    $loadContent.animate({'scrollTop':0},100,function(){
                        setTimeout(function(){$loadContent.removeClass(animateClass);},600)

                    });
                    $(document.body).append('<script src='+data.scriptName+'></script>');

                });
                if(e.currentTarget.className!='scNav'){
                    //关闭其他展开的tab
                    if ($down.length != 0) {
                        $down.find("ul").slideUp(280);
                        $down.attr("slideFlag", 1).removeClass('down');
                    }
                }
            } else if( $(window).width()>769){
                // $(this).find('.scNav').removeClass('active');
                var flag = $(this).attr("slideFlag");
                var _this = $(this);
                //关闭其他展开的tab
                if ($down.length != 0) {
                    $down.find("ul").slideUp(280);
                    $down.attr("slideFlag", 1).removeClass('down');
                }
                if (flag == 1) {
                    $(this).attr("slideFlag", 2);
                    setTimeout(function () {
                        _this.addClass('down');
                    }, 150);
                    $(this).find("ul").slideDown(300);

                } else {
                    $(this).attr("slideFlag", 1);
                    setTimeout(function () {
                        _this.removeClass('down');
                    }, 150);
                    $(this).find("ul").slideUp(220);
                }
            }
            $(this).addClass('active').siblings('li').removeClass('active');

        });
    }
});