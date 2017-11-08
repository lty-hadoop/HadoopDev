$(".getSelect").selectpick({
    url:'tastList.json',
    showNum : 10,
    cbFn : function(data){
        console.log(data)
    }
});