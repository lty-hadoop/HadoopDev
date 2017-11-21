$(function(){
    var listData = {
        url : $.getPath+'/DenseRegion/list',
        dataTitle : '出行密集区域排行',
        sourceFlag:false,
        allShowNum:6,
        sendData : {type:1,offdate:$.getDateString('-1')}
    };
    var ddData = {
        url : $.getPath+'/DenseRegion/list',
        dataTitle : '到达密集区域排行',
        sourceFlag:false,
        allShowNum:6,
        sendData : {type:2,offdate:$.getDateString('-1')}
    };
    $(".depart").creatList(listData);
    $(".arrive").creatList(ddData);


    //品质路线
    var tbody = $('.table-responsive').find('.list-data');
    $.ajax({
        url : $.getPath+'/QualityLine/list',
        type :'get',
        dataType : 'json',
        data : {isPage:true,offdate:$.getDateString('-1'),pageNum:1,pageSize:10},
        success:function (data) {
            if(data['resPonse']['page']['total']>10){
                getRander(data['page']['total'])
            }else{
                randerData(data)
            }

        }
    });
    //加载分页
    function getRander(data){
        $('.tablePage').creatPage({
            itemSize:data,
            callBack : function(data){
                $.ajax({
                    url : $.getPath+'/QualityLine/list',
                    type :'get',
                    dataType : 'json',
                    data : {isPage:true,offdate:$.getDateString('-1'),pageNum:1,pageSize:10},
                    success:function (data) {
                            randerData(data)
                    }
                });
            }
        })
    }
    //渲染数据
    function randerData(data){
        tbody.html('');
        var posData = data['resPonse']['qualityLineList'];
        $.each(posData,function(index,val){
            var $tr = $('<tr></tr>');
            var sData = $.formatDate(val['running_time']);
            var eData =$.formatDate(val['depart_time']);
            var $td = $('<td>'+val['start_place_name']+'</td><td>'+val['way_site']+'</td><td>'+val['end_place_name']+
                '</td><td>'+sData+'</td><td>'+eData+'</td><td>'+val['crest_segment_num']+'</td><td>'
                +val['fitted_out_vehicles']+'</td><td>'+val['fitted_out_person']+'</td>');
            $tr.append($td);
            tbody.append($tr);
        })
    }
//迁徙图
    function Pmgressbar(){
        var _this = this;
        //间隔多少时间触发一次请求，或者说刷新一次显示；单位为分钟默认15分钟
        this.space = 15;
        //当前播放进度的宽度；即播放进度；
        this.changeWidth = 0;
        //进度条截止点；
        this.Mwidth = $('.pmgressbar').width();
        //进度条开始点；
        this.minWidth = 0;
        // 根据指定的间隔时间来计算步长
        this.steep =  Math.floor(_this.Mwidth/24/60*_this.space);
        //拖动进度条时鼠标点击时的x轴距离
        this.startX = 0;
        //拖动进度条时鼠标拖动结束点
        this.endX = 0;
        //拖动进度条时鼠标拖动距离
        this.moveX = 0;
        //进度条是否能被拖动
        this.isMove = false;
        //延时
        this.timer = {};
        //自动播放
        this.autoPlay = null;
        //进度条是否处于能播放的状态；
        this.isAction = true;
        //是否是点击事件
        this.clickEv = false;
        this.startBar();
        this.movebar();

    }
    Pmgressbar.prototype = {
        changeBar : function(){
            var _this = this;
            if(!this.isMove){
                this.changeWidth+=1;
            }
            if(_this.changeWidth>this.Mwidth||_this.changeWidth<this.minWidth){
                _this.stopBar();
            }else{
                _this.getData();
                $(".end").css({"top":Math.ceil(this.changeWidth/this.Mwidth*25),"left":this.changeWidth+5});
                $(".bar").css({'width':this.changeWidth},600);
            }
        },
        movebar : function(){
            var _this = this;
            var timers = 0;
            var run = null;
            $(document).on("mouseenter",".pmgressbar",function() {
                _this.stopBar();
            }).on("mouseleave",".pmgressbar",function() {
                if(!_this.isAction){
                    _this.isAction = true;
                    _this.startBar();
                }
            });
            $(document).on('mousedown', '.pmgressbar',function(){
                _this.clickEv = false;
            })
            $(document).on('mouseup', '.pmgressbar', function(event) {
                if(_this.clickEv)return;
                if(event.target.className!='pmgressbar'&&event.target.className!='bar')return;
                _this.stopBar();
                event.preventDefault();
                console.log("offset:"+$(this).offset().left+"clientX:"+event.clientX);
                var clickOffset = event.clientX-$(this).offset().left;
                if(clickOffset>=_this.Mwidth){
                    clickOffset=_this.Mwidth;
                }else if(clickOffset<=_this.minWidth){
                    clickOffset=_this.minWidth;
                }
                clickOffset>=_this.changeWidth?add.call(_this):minus.call(_this);
                _this.clickEv  = false;
                //点击位置是需要增加的
                function add(){
                    for(this.changeWidth;this.changeWidth<=clickOffset;this.changeWidth++){
                        console.log("+")
                        this.getData();
                    }
                    getMoveTo.call(this);
                }
                //点击位置是需要减小的
                function minus(){
                    for(this.changeWidth;this.changeWidth>=clickOffset;this.changeWidth--){
                        console.log("-")
                        this.getData();
                    }
                    getMoveTo.call(this);
                }

                function getMoveTo(){
                    $(".end").animate({"top":Math.ceil(this.changeWidth/this.Mwidth*25),"left":this.changeWidth+5},600);
                    $(".bar").animate({'width':this.changeWidth},600);
                }
                /* Act on the event */
            });

//拖动播放条事件
            $(".pmgressbar").on("mousedown",".end",function(event){

                event.preventDefault();
                _this.isMove = true;
                _this.clickEv = true;
                _this.startX = event.clientX;
                _this.stopBar();
            });
            $(document).on("mouseup",function(e){
                if(_this.isMove){
                    _this.isMove = false;
                    _this.isAction = true;
                    _this.startBar();
                }

            });
            $(document).on('mousemove',function(event) {
                event.preventDefault();
                /* Act on the event */
                if(_this.isMove){
                    _this.stopBar();
                    // _this.endX = event.clientX;
                    _this.changeWidth = event.clientX-$(".pmgressbar").offset().left
                    // _this.moveX = _this.endX-_this.startX;
                    // _this.startX =  _this.endX;
                    if(_this.changeWidth>_this.Mwidth||_this.changeWidth<_this.minWidth){
                    }else{
                        _this.changeWidth = _this.changeWidth+_this.moveX;
                        _this.changeBar();
                    }
                }
            });
        },
        stopBar : function(){
            var _this = this;
            this.isAction = false;
            clearInterval(_this.autoPlay);
            _this.autoPlay = null;
        },
        startBar : function(){
            var _this = this;
            clearInterval(_this.autoPlay);
            _this.autoPlay = null;
            _this.waitDo("waitStart",function(){
                if(_this.isAction){
                    _this.autoPlay = setInterval(function(){
                        _this.changeBar();
                        _this.isAction = false;
                    },50);
                }
            },500)

        },
        getData : function (){
            if(this.changeWidth%this.steep==0){
                //满足条件就请求数据，改变图形
                setEcharts();
                // console.log(this.changeWidth/this.steep)
            }
            function setEcharts(){

            }
        },
        waitDo : function (id, fn, wait) {
            //id事件名称  fn执行事件 wait等待时间
            var _this = this;
            if (_this.timer[id]) {
                window.clearTimeout(this.timer[id]);
                delete _this.timer[id];
            }
            return _this.timer[id] = window.setTimeout(function() {
                fn();
                delete _this.timer[id];
            },wait);
        }
    }
    var aa = new Pmgressbar();
    var myChart = echarts.init(document.getElementById('main'));
    var startPoint = {
        x: 104.114129,
        y: 37.550339
    };
// 地图自定义样式
    var bmap = {
        center: [startPoint.x, startPoint.y],
        zoom: 6,
        roam: true,
        mapStyle: {
            styleJson: [
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": {
                        "color": "#021019"
                    }
                },
                {
                    "featureType": "highway",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#000000"
                    }
                },
                {
                    "featureType": "highway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#147a92"
                    }
                },
                {
                    "featureType": "arterial",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#000000"
                    }
                },
                {
                    "featureType": "arterial",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#0b3d51"
                    }
                },
                {
                    "featureType": "local",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#000000"
                    }
                },
                {
                    "featureType": "land",
                    "elementType": "all",
                    "stylers": {
                        "color": "#08304b"
                    }
                },
                {
                    "featureType": "railway",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#000000"
                    }
                },
                {
                    "featureType": "railway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#08304b"
                    }
                },
                {
                    "featureType": "subway",
                    "elementType": "geometry",
                    "stylers": {
                        "lightness": -70
                    }
                },
                {
                    "featureType": "building",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#000000"
                    }
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#857f7f"
                    }
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#000000"
                    }
                },
                {
                    "featureType": "building",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#022338"
                    }
                },
                {
                    "featureType": "green",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#062032"
                    }
                },
                {
                    "featureType": "boundary",
                    "elementType": "all",
                    "stylers": {
                        "color": "#1e1c1c"
                    }
                },
                {
                    "featureType": "manmade",
                    "elementType": "all",
                    "stylers": {
                        "color": "#022338"
                    }
                }
            ]
        }
    }

    var geoCoordMap = {
        '上海': [121.4648, 31.2891],
        '东莞': [113.8953, 22.901],
        '东营': [118.7073, 37.5513],
        '中山': [113.4229, 22.478],
        '临汾': [111.4783, 36.1615],
        '临沂': [118.3118, 35.2936],
        '丹东': [124.541, 40.4242],
        '丽水': [119.5642, 28.1854],
        '乌鲁木齐': [87.9236, 43.5883],
        '佛山': [112.8955, 23.1097],
        '保定': [115.0488, 39.0948],
        '兰州': [103.5901, 36.3043],
        '包头': [110.3467, 41.4899],
        '北京': [116.4551, 40.2539],
        '北海': [109.314, 21.6211],
        '南京': [118.8062, 31.9208],
        '南宁': [108.479, 23.1152],
        '南昌': [116.0046, 28.6633],
        '南通': [121.1023, 32.1625],
        '厦门': [118.1689, 24.6478],
        '台州': [121.1353, 28.6688],
        '合肥': [117.29, 32.0581],
        '呼和浩特': [111.4124, 40.4901],
        '咸阳': [108.4131, 34.8706],
        '哈尔滨': [127.9688, 45.368],
        '唐山': [118.4766, 39.6826],
        '嘉兴': [120.9155, 30.6354],
        '大同': [113.7854, 39.8035],
        '大连': [122.2229, 39.4409],
        '天津': [117.4219, 39.4189],
        '太原': [112.3352, 37.9413],
        '威海': [121.9482, 37.1393],
        '宁波': [121.5967, 29.6466],
        '宝鸡': [107.1826, 34.3433],
        '宿迁': [118.5535, 33.7775],
        '常州': [119.4543, 31.5582],
        '广州': [113.5107, 23.2196],
        '廊坊': [116.521, 39.0509],
        '延安': [109.1052, 36.4252],
        '张家口': [115.1477, 40.8527],
        '徐州': [117.5208, 34.3268],
        '德州': [116.6858, 37.2107],
        '惠州': [114.6204, 23.1647],
        '成都': [103.9526, 30.7617],
        '扬州': [119.4653, 32.8162],
        '承德': [117.5757, 41.4075],
        '拉萨': [91.1865, 30.1465],
        '无锡': [120.3442, 31.5527],
        '日照': [119.2786, 35.5023],
        '昆明': [102.9199, 25.4663],
        '杭州': [119.5313, 29.8773],
        '枣庄': [117.323, 34.8926],
        '柳州': [109.3799, 24.9774],
        '株洲': [113.5327, 27.0319],
        '武汉': [114.3896, 30.6628],
        '汕头': [117.1692, 23.3405],
        '江门': [112.6318, 22.1484],
        '沈阳': [123.1238, 42.1216],
        '沧州': [116.8286, 38.2104],
        '河源': [114.917, 23.9722],
        '泉州': [118.3228, 25.1147],
        '泰安': [117.0264, 36.0516],
        '泰州': [120.0586, 32.5525],
        '济南': [117.1582, 36.8701],
        '济宁': [116.8286, 35.3375],
        '海口': [110.3893, 19.8516],
        '淄博': [118.0371, 36.6064],
        '淮安': [118.927, 33.4039],
        '深圳': [114.5435, 22.5439],
        '清远': [112.9175, 24.3292],
        '温州': [120.498, 27.8119],
        '渭南': [109.7864, 35.0299],
        '湖州': [119.8608, 30.7782],
        '湘潭': [112.5439, 27.7075],
        '滨州': [117.8174, 37.4963],
        '潍坊': [119.0918, 36.524],
        '烟台': [120.7397, 37.5128],
        '玉溪': [101.9312, 23.8898],
        '珠海': [113.7305, 22.1155],
        '盐城': [120.2234, 33.5577],
        '盘锦': [121.9482, 41.0449],
        '石家庄': [114.4995, 38.1006],
        '福州': [119.4543, 25.9222],
        '秦皇岛': [119.2126, 40.0232],
        '绍兴': [120.564, 29.7565],
        '聊城': [115.9167, 36.4032],
        '肇庆': [112.1265, 23.5822],
        '舟山': [122.2559, 30.2234],
        '苏州': [120.6519, 31.3989],
        '莱芜': [117.6526, 36.2714],
        '菏泽': [115.6201, 35.2057],
        '营口': [122.4316, 40.4297],
        '葫芦岛': [120.1575, 40.578],
        '衡水': [115.8838, 37.7161],
        '衢州': [118.6853, 28.8666],
        '西宁': [101.4038, 36.8207],
        '西安': [109.1162, 34.2004],
        '贵阳': [106.6992, 26.7682],
        '连云港': [119.1248, 34.552],
        '邢台': [114.8071, 37.2821],
        '邯郸': [114.4775, 36.535],
        '郑州': [113.4668, 34.6234],
        '鄂尔多斯': [108.9734, 39.2487],
        '重庆': [107.7539, 30.1904],
        '金华': [120.0037, 29.1028],
        '铜川': [109.0393, 35.1947],
        '银川': [106.3586, 38.1775],
        '镇江': [119.4763, 31.9702],
        '长春': [125.8154, 44.2584],
        '长沙': [113.0823, 28.2568],
        '长治': [112.8625, 36.4746],
        '阳泉': [113.4778, 38.0951],
        '青岛': [120.4651, 36.3373],
        '韶关': [113.7964, 24.7028]
    };
    var GZData = [
        [{
            name: '广州',
            value: 90
        }, {
            name: '福州',
            value: 95
        }],
        [{
            name: '北京',
            value: 30
        }, {
            name: '太原',
            value: 90
        }],
        [{
            name: '上海',
            value: 70
        }, {
            name: '长春',
            value: 80
        }],
        [{
            name: '长春',
            value: 80
        }, {
            name: '重庆',
            value: 70
        }],
        [{
            name: '成都',
            value: 50
        }, {
            name: '西安',
            value: 60
        }],
        [{
            name: '上海',
            value: 50
        }, {
            name: '成都',
            value: 50
        }],
        [{
            name: '上海',
            value: 30
        }, {
            name: '常州',
            value: 40
        }],
        [{
            name: '天津',
            value: 30
        }, {
            name: '北京',
            value: 30
        }],
        [{
            name: '成都',
            value: 20
        }, {
            name: '北海',
            value: 20
        }],
        [{
            name: '上海',
            value: 10
        }, {
            name: '海口',
            value: 10
        }]
    ];
    var convertData = function(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var fromCoord = geoCoordMap[dataItem[0].name];
            var toCoord = geoCoordMap[dataItem[1].name];
            if (fromCoord && toCoord) {
                res.push({
                    fromName: dataItem[0].name,
                    toName: dataItem[1].name,
                    coords: [fromCoord, toCoord]
                });
            }
        }
        return res;
    };

    var color = [ 'red','#28cc79'];
    var series = [];
    series.push({
        type: 'lines',
        coordinateSystem: 'bmap',
        zlevel: 1,
        effect: {
            show: true,
            period: 1,
            trailLength: 0.2,
            color: '#fff',
            symbolSize: 3
        },
        lineStyle: {
            normal: {

                width: 0,
                curveness: 0.2
            }
        },
        data: convertData(GZData)
    }, {
        type: 'lines',
        coordinateSystem: 'bmap',
        zlevel: 2,
        effect: {
            show: true,
            period: 0,
            trailLength: 0,
            symbolSize: 0
        },
        lineStyle: {
            normal: {

                width: 1,
                opacity: 0.4,
                curveness: 0.2
            }
        },
        data: convertData(GZData)
    }, {
        type: 'scatter',
        coordinateSystem: 'bmap',
        zlevel: 1,
        rippleEffect: {
            brushType: 'stroke'
        },
        symbolSize: function(val) {
            return val[2] / 4;
        },
        showEffectOn: 'render',
        itemStyle: {
            normal: {
                color: '#28cc79'
            }
        },
        data: GZData.map(function(dataItem) {
            return {
                name: dataItem[1].name,
                value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
            };
        })
    }, {
        type: 'scatter',
        coordinateSystem: 'bmap',
        zlevel: 1,
        rippleEffect: {
            brushType: 'stroke'
        },
        symbolSize: function(val) {
            return val[2] / 4;
        },
        showEffectOn: 'render',
        itemStyle: {
            normal: {
                color: 'red'
            }
        },
        data: GZData.map(function(dataItem) {
            return {
                name: dataItem[0].name,
                value: geoCoordMap[dataItem[0].name].concat([dataItem[0].value])
            };
        })

    });

    option = {
        bmap: bmap,
        color : ['#28cc79', 'red'],
        backgroundColor: '#404a59',
        tooltip: {
            trigger: 'item'
        },
        legend: {
            show: true,
            data: ['地点', '线路'],
        },
        geo: {
            map: 'bmap',
            polyline: true,
            progressiveThreshold: 500,
            progressive: 200,
            zoom:15,
            label: {
                emphasis: {
                    show: false
                }
            },
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: '#323c48',
                    borderColor: '#404a59'
                },
                emphasis: {
                    areaColor: '#2a333d'
                }
            }
        },
        series: series
    };
    myChart.setOption(option);

    setTimeout(function(){
        // 获取百度地图实例，使用百度地图自带的控件
        var getMap = myChart.getModel().getComponent('bmap').getBMap();
        getMap.addControl(new BMap.NavigationControl({type: BMAP_NAVIGATION_CONTROL_ZOOM}));
    },0)
});
