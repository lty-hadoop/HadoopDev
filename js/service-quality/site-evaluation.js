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

    console.log(end.minDate);

    //表格控件
    $("#testtable").jeTable({
        width:"100%",
        height:300,
        datas:{
            url:"js/tableData.json",
            type:"GET",
            async:false,
            dataType:"json",
            field: 'sites'
        },
        isPage: false,
        columnSort:[1,2,3,4,5],
        columns:[
            {name:'评价时间',field: 'time', width:"80",isShow:true},
            { name:'评价地点',field: 'address',width:"550"},
            {name:'用户名', field: 'user', width:"150"},
            { name:'评价等级',field: 'state',width:"200"},
            { name:'具体内容', field: 'content',width:"200"}
        ],
        success:function (elem) {
            // elem.find("tr").on("click",function () {
            //     var trdata = $.parseJSON($(this).attr("trdata"));
            //     console.log(trdata)
            // })
            console.log(elem)
        }
    })
});
