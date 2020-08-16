(function ($, root) {
    var dur;
    var frameId;
    var startTime = 0;
    var lastPer = 0; //歌曲播放暂停时时间所占的百分比

    function renderAlltime(time) { //渲染总时间
        dur = time;
        time = formateTime(time);
        // console.log(time)
        $('.endTime').html(time);
    }
    //格式时间函数
    function formateTime(time) { //格式化时间  转化成分秒的形式
        time = Math.round(time);

        var min = Math.floor(time / 60); //四舍五入 去掉小数
        var sec = time % 60;
        min = min < 10 ? '0' + min : min;
        sec = sec < 10 ? '0' + sec : sec;
        return (min + ' : ' + sec);
    }
    //开始进度条的功能
    function start(p) {
        lastPer = p === undefined ? lastPer : p;
        cancelAnimationFrame(frameId);
        startTime = new Date().getTime();
        function frame() {
            var curTime = new Date().getTime();
            var per = lastPer + (curTime - startTime) / (dur * 1000);
            if (per <= 1) {
                upDate(per);
            } else {
                cancelAnimationFrame(frameId);
            }
            frameId = requestAnimationFrame(frame);
        }
        frame();
    }
    //更新进度条的功能
    function upDate(per) {
        //      更新时间
        var time = formateTime(per * dur);
        $('.curTime').html(time);
        //更新进度条
        var perX = (per - 1) * 100 + '%';
        $('.fontBg').css('transform', 'translateX(' + perX + ')');
    }
    //停止进度条的功能
    function stop() {
        cancelAnimationFrame(frameId);
        //保存进度条停止时对应的时间
        var stopTime = new Date().getTime();
        lastPer = lastPer + (stopTime - startTime) / (dur * 1000);

    }

    root.pro = {
        renderAlltime: renderAlltime, //将模块中的方法暴露出去，给到window.player身上
        start: start,
        upDate: upDate,
        stop: stop

    };
})(window.Zepto, window.player || (window.player = {}));