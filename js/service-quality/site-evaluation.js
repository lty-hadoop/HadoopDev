/*
* 这是站点评价
* */
$(function(){
    getEchartsData ('js/chartData.json', 5, '{value}')

    statis('js/public/evaluation.json');

    var start = {
        format: 'YYYY-MM-DD hh:mm:ss',
        maxDate: $.nowDate({DD:0}), //最大日期
        okfun: function(obj){
            end.minDate = obj.val; //开始日选好后，重置结束日的最小日期
            endDates();
            console.log(end.minDate)
        }
    };
    var end = {
        format: 'YYYY-MM-DD hh:mm:ss',
        minDate: $.nowDate({DD:0}), //设定最小日期为当前日期
        okfun: function(obj){
            start.maxDate = obj.val; //将结束日的初始值设定为开始日的最大日期
            console.log(start.maxDate)
        }
    };
//这里是日期联动的关键
    function endDates() {
        //将结束日期的事件改成 false 即可
        end.trigger = false;
        $("#test1").jeDate(end);
    }
    $('#test').jeDate(start);
    $('#test1').jeDate(end);

    console.log(end.minDate)
});
