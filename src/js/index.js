(function ($, player) {
    function musicPlayer(dom) {
        this.wrap = dom; //播放器的容器  用于加载listcontrol模块
        this.dataList = []; //存取获取到的请求数据
        this.indexObj = null;
        this.islike = false;
        // this.now = 0;
        this.len = 0;
        this.rotateTimer = null;
        this.curIndex = 0;
    }
    musicPlayer.prototype = {
        init: function () {
            this.getDom();
            this.getData('../mock/data.json'); //请求数据
        },
        //获取页面元素
        getDom: function () {
            this.record = document.querySelector('.songImg img');
            this.controlBtns = document.querySelectorAll('.control li');
        },
        getData: function (url) { //获取数据
            var self = this;
            $.ajax({
                url: url,
                method: 'get',
                success: function (data) {
                    // self.dataList = data;
                    // self.listPlay(); //列表切歌
                    // self.indexObj = new player.indexControl(self.dataList.length);
                    // console.log(self)
                    // self.loadMusic(self.indexObj.index);
                    // console.log(self.dataList);
                    // self.musicControl();
                    self.dataList = data;
                    self.listPlay(); //列表切歌
                    self.len = self.dataList.length;
                    self.indexObj = new player.indexControl(self.len);
                    self.loadMusic(self.indexObj.index);
                    self.musicControl();
                },
                error: function () {
                    console.log('请求失败');
                }
            });
        },
        loadMusic: function (index) { //加载音乐
            player.render(this.dataList[index]);
            player.pro.renderAlltime(this.dataList[index].duration);

            player.music.Load(this.dataList[index].audioSrc);
            //在页面刷新时你不需要加载音乐，需要判断当前的状态
            if (player.music.status == 'play') {
                player.music.Play();
                player.pro.start(0);
                this.imgRotate(0); //音乐播放时图片旋转
                //切换播放/暂停按钮
                this.controlBtns[2].className = 'playing';
            }

            this.list.changeSelect(index);
            this.curIndex = index; //存取当前歌曲对应的索引值
        },
        musicControl: function () { //控制音乐
            var self = this;
            //是否喜欢

            this.controlBtns[0].addEventListener('touchend', function () {
                //添加是否喜欢  自己写的
                if (player.music.islike) {
                    this.className = '';
                    player.music.islike = !player.music.islike;

                } else {
                    this.className = 'liking';
                    player.music.islike = !player.music.islike;
                }


            });
            //上一首this.className

            this.controlBtns[1].addEventListener('touchend', function () {
                player.music.status = 'play';
                // self.now--;
                //加载音乐
                self.loadMusic(self.indexObj.prev());

            });
            //播放和暂停
            this.controlBtns[2].addEventListener('touchend', function () {
                if (player.music.status == 'play') {

                    player.music.Pause();
                    player.pro.stop();
                    this.className = '';
                    self.imgStop(); //图片停止旋转

                } else {
                    player.music.Play();
                    player.pro.start();
                    this.className = 'playing';
                    var deg = self.record.dataset.rotate || 0;
                    self.imgRotate(deg);

                }
                // ;

            });
            //下一首
            this.controlBtns[3].addEventListener('touchend', function () {
                player.music.status = 'play';
                // self.now--;
                self.loadMusic(self.indexObj.next());

            });
            //拖拽进度条控制音乐进度

            var offset = $('.backBg').offset();
            var left = offset.left;
            var width = offset.width;
        
            $('.circle').on('touchstart', function () {
                player.pro.stop();
            }).on('touchmove', function (ev) {
                var x = ev.changedTouches[0].clientX;
                var per = (x - left) / width;
                if (per > 0 && per < 1) {
                    player.pro.upDate(per);
                }
            }).on('touchend', function (ev) {
                var x = ev.changedTouches[0].clientX;
                var per = (x - left) / width;
                if (per > 0 && per < 1) {
                    var cutTime = per * self.dataList[self.indexObj.index].duration;
                    player.music.PlayTo(cutTime);
                    player.music.status='play';
        
                    player.muted = true;
                    player.music.Play();
        
        
                    $('.play').addClass('playing');
                    player.pro.start(per);
                }
            });

        },
        //音乐图片旋转
        imgRotate: function (deg) {
            var self = this;
            clearInterval(this.rotateTimer);
            this.rotateTimer = setInterval(function () {
                deg = +deg + 0.2;
                self.record.style.transform = 'rotate(' + deg + 'deg)';
                self.record.dataset.rotate = deg; //dataset为保存的当前的旋转角度
            }, 1000 / 60); //电脑的刷新频率为60 
        },
        imgStop: function () {
            clearInterval(this.rotateTimer);
        },


        listPlay: function () { //列表切歌
            var self = this;

            this.list = player.listcontrol(this.dataList, this.wrap); //把listControl对象赋值给this.list

            //列表按钮添加点击事件
            this.controlBtns[4].addEventListener('touchend', function () {
                self.list.slideUp(); //让列表显示出来
            });

            //歌曲列表添加事件
            this.list.musicList.forEach(function (item, index) {
                item.addEventListener('touchend', function () {
                    //如果点击的是当前的那首歌，不管它是播放还是暂停都无效
                    if (self.curIndex == index) {
                        return;
                    }

                    player.music.status = 'play'; //歌曲要变成播放状态
                    self.indexObj.index = index; //索引值对象身上的当前索引值要更新
                    self.loadMusic(index); //加载点击对应的索引值的那首歌曲
                    self.list.slideDown(); //列表消失
                });
            });
        }
    };
    var MusicPlayer = new musicPlayer(document.getElementById('wrap'));
    MusicPlayer.init();
})(window.Zepto, window.player);