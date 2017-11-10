/*
* 这是站点评价
* */
$(function(){
    getEchartsData ('js/chartData.json', 5, '{value}')

    statis('js/public/evaluation.json');



    //表格控件
    $("#testtable").jeTable({
        width:"100%",
        height: "100%",
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
