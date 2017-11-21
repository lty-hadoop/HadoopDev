$(function(){
    $(".getSelect").selectpick({
        url:$.getPath+'/Company/list',
        showNum : 10,
        wrap:'getSelectWrap',
        atuoCbfn:true,
        data : {isPage:true,pageNum:1,pageSize:10,company_name:""},
        keyupData:'company_name',
        simpleData : {
            name:'company_name',
            total:'total',
            data:'companyList'
        },
        cbFn : function(data){
            var $wrapDiv = $('.getSelectLineWrap').find('.selectpickDiv');
            if(($wrapDiv.length!=0))$wrapDiv.remove();
            getLine(data)
        }
    });
    function getLine(data){
        $(".getSelectLine").selectpick({
            url:$.getPath+'/Line/list',
            showNum : 10,
            wrap:'getSelectLineWrap',
            atuoCbfn:true,
            data : {isPage:true,pageNum:1,pageSize:10,company_id:data.company_id},
            keyupData:'line_name',
            simpleData : {
                name:'line_name',
                total:'total',
                data:'LineList'
            },
            cbFn : function(data){
                console.log(data)
            }
        });
    }
    var listData = {
        url : 'tastList.json',
        dataTitle : '待优化线路列表',
        sourceFlag:false,
        getPage:true
    };
    $(".optimize").creatList(listData);

    $(".driverTop").creatList(listData);
});