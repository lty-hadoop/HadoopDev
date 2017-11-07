$(function($){
    var data = {
        showNum : 10,
        itemSize : 102,
        showPage:5,
        callBack : function(data){
            console.log(data)
        }
    };
$(".pagePlugin").creatPage(data);
    var data = new Array(10);
    $.each(data,function(index,value){
        $(".test1").append('<div">'+index+'</div>');
    })
})
