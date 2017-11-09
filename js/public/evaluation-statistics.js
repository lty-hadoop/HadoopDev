/*
* 评价详情
* 参数url：表示要传的api接口
* */
function statis (url) {
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(res) {
            var title = res.title;
            var data = res.sites;
            $('.evaluation-title').html(title);
            data.map(function(elem, index){
                // console.log(index);
                var state = '';
                var classType = null;
                switch (elem.state) {
                    case "0":
                        state = "好评";
                        classType = 'total-green';
                        break;
                    case "1":
                        state = "中评";
                        classType = 'total-orange';
                        break;
                    case "2":
                        state = "差评";
                        classType = 'total-red';
                        break;
                }
                var evalution = `<div class="statistics-block col33">
                                    <div class="statistics-type f14 line_h40">
                                        <span class="pd_l20 cc">${state}</span>
                                    </div>
                                    <div class="pd_20 evaluation-total">
                                        <p class="total">${elem.total}</p>
                                        <div class="dis_f jst_sb">
                                            <span>Total</span>
                                            <div>
                                                <i class="percent">${elem.rate}</i>
                                                <em>↑</em>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                $('.evaluation-data').append(evalution);
                $('.evaluation-total p').eq(index).addClass(classType);
            });
        }
    })
}


