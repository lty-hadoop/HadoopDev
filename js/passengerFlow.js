$(function(){
    var listData = {
        url : 'tastList.json',
        dataTitle : '出行密集区域排行',
        sourceFlag:false
    }
    $(".depart").creatList(listData);
    $(".arrive").creatList(listData);
});
