$(".getSelect").selectpick({
    url:'tastList.json',
    showNum : 10,
    cbFn : function(data){
        console.log(data)
    }
});

var listData = {
    url : 'tastList.json',
    dataTitle : '待优化线路列表',
    sourceFlag:false,
    getPage:true
};
$(".optimize").creatList(listData);

$(".driverTop").creatList(listData);