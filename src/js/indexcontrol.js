;(function(root){
    function Index(len){
        this.len = len;
        this.index = 0;
    }
    Index.prototype = {
        prev:function(){
            return this.get(-1);
        },
        next:function(){
            return this.get(1);

        },
        //val为+1  或者-1
        get:function(val){
            this.index = (this.index + val +this.len) %this.len;
            return this.index;
        
        }
    };
    root.indexControl =Index;
    
})(window.player || (window.player = {}));