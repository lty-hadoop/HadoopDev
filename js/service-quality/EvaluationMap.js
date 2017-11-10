$(function(){
    var $EvaluationMap = $('.EvaluationMap');
    //点击查看评价详情

    $EvaluationMap.on("click",".seeDetail",function(){
        var $table = $EvaluationMap.find(".pjDetail");
        var $img = $EvaluationMap.find(".seeDetail").find("img");
        if($img.hasClass("up")){
            $img.removeClass("up").addClass("down");
            $table.slideDown(300);
        }else{
            $img.removeClass("down").addClass("up");
            $table.slideUp(300);
        }

    })
})