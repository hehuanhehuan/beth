setTimeout(function(){
    goOrderCenter();
},3000);

function goOrderCenter(){
    if($('a:contains("我的订单")').length > 0){
        var order_center = $('a:contains("我的订单")')[0];
        order_center.click();
    }else{
        window.location.href = 'http://order.jd.com/center/list.action';
    }

}