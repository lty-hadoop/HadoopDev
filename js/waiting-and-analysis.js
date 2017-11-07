/*
* 候车时长与满意度分析
* */
$(function(){
    getEchartsData ('js/chartData.json', 100, '{value}%',[
        {name: '候车满意度', icon: 'rect'},
        {name: '候车时长', icon: 'rect'}
    ])
});