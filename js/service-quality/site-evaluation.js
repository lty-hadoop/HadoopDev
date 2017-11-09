/*
* 这是站点评价
* */
$(function(){
    getEchartsData ('js/chartData.json', 5, '{value}')

    statis('js/public/evaluation.json');


    $('#test').jeDate({
        format: 'YYYY-MM-DD hh:mm:ss',
        toggle: function(obj){
            console.log(obj.elem);     //得到当前输入框的ID
            console.log(obj.val);      //得到日期生成的值，如：2017-06-16
        }
    })
});