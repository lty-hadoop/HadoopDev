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


    var option = {
        id: 'provisioning',
        url: '',
        title: '客流与运力对比图',
        titleColor: '#999',
        legendData: [
            {name: '客流', icon: 'rect'},
            {name: '运力', icon: 'rect'}
        ],
        ydata: [
            {
                splitLine:{show: true},
                type: 'value',
                max: 5,
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                max: 25,
                nameLocation: 'start',
                axisLabel: {
                    formatter: '{value}/min'
                }
            }
        ],
        seriesNumber: 2,
        seriesFirstData: [
            {
                name: '客流',
                type:'line',
                areaStyle: {
                    normal: {
                        color: '#e4f6f2'
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#3c9',
                        lineStyle: {
                            color: '#3c9'
                        }
                    }
                },
                data: [3,4,4.5, 3.6,3.8,3.2, 2.8, 3, 3.4]
            }
        ],
        seriesSecondData: [
            {
                name:'客流',
                type:'line',
                areaStyle: {
                    normal: {
                        color: '#e4f6f2'
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#3c9',
                        lineStyle: {
                            color: '#3c9'
                        }
                    }
                },
                data: [3,4,4.5, 3.6,3.8,3.2, 2.8, 3, 3.4]
            },
            {
                //polarIndex: 0,
                name: '运力',
                type:'line',
                //yAxisIndex: 1,
                //step: 'end',
                // areaStyle: {normal: {}},
                itemStyle : {
                    normal : {
                        color: '#999',
                        lineStyle: {
                            color: '#999'
                        }
                    }
                },
                data: [3.3, 3.5, 4.1, 4.3, 3.5, 3, 2.5, 3.3, 3.6]
            }
        ],
    };
    var od = new GetData(option);
});