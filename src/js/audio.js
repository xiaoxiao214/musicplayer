(function(root){
    function audioManage(){
        this.audio = new Audio();
        this.status = 'pause';
    }
    audioManage.prototype = {
        //加载音频
        Load:function(src){
            this.audio.src = src;//设置音频路径
            this.audio.load();//加载音频
        },
        Play:function(){
            this.audio.play();
            this.status = 'play';
        },
        Pause:function(){
            this.audio.pause();
            this.status = 'pause';

        },
        isLike:function(){
            this.islike = false;

        },
        PlayTo:function(time){
            this.audio.currentTime = time;
        },
        ended:function(fn){
            this.audio.currentTime = fn;
        }
    };

    
    root.music =new audioManage();
})(window.player || (window.player = {}));