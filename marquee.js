/**
 * Marquee by javascript
 * @authors richard chen
 * @date    2014-06-12
 * @version 1.0
 * @参数 opt{} 可选值
 *   elem：要滚动的元素
 *   step：每次滚动的步长(px)
 *   stepInterval：滚动效果执行时间(ms)
 *   interval：每次滚动间隔时间(ms)
 *   dir：滚动方向，up、down、left、right，默认为"left"
 *   autoPlay：是否自动滚动，默认为true
 *   hoverPause：是否在鼠标滑过时暂停滚动，默认为true
 */
var Marquee = function (opt) {
    // 要滚动的元素
    this.elem = null;

    // 每次滚动的步长(px)
    this.step = 0;

    // 滚动效果执行时间(ms)
    this.stepInterval = 400;

    // 每次滚动间隔时间(ms)
    this.interval = 3000;

    // 滚动方向，up、down、left、right，默认为"left"
    this.dir = "left";

    // 是否自动滚动，默认为true
    this.autoPlay = true;

    // 是否在鼠标滑过时暂停滚动，默认为true
    this.hoverPause = true;

    // 保存暂停状态
    this.pausing = false;

    // 滚动计时器
    this.timerStep = null;

    // 滚动间隔计时器
    this.timer = null;

    this.init(opt);
};

Marquee.prototype = {

    constructor: Marquee,

    init: function (opt) {

        this.extend(opt, this);

        // 如果元素不存在则直接返回
        if (!this.elem) return false;

        // 复制滚动元素内容并填充
        this.elem.innerHTML += this.elem.innerHTML;

        this.loadStyle();

        this.hoverPause && this.bindEvents();

        this.autoPlay && this.startScroll();
    },

    // 初始化滚动元素的样式
    loadStyle: function () {
        var childrens = this.elem.children;

        // 如果是左右滚动就给滚动元素加上宽度
        if (this.dir == 'left' || this.dir == 'right') {
            this.elem.style.width = childrens[0].offsetWidth * childrens.length + 'px';
        }

        if (this.dir == 'right' && this.elem.offsetLeft == 0) {
            this.elem.style.left = -this.elem.offsetWidth / 2 + 'px';
        }

        if (this.dir == 'left' && this.elem.offsetLeft == -this.elem.offsetWidth / 2) {
            this.elem.style.left = 0;
        }

        if (this.dir == 'down' && this.elem.offsetTop == 0) {
            this.elem.style.top = -this.elem.offsetHeight / 2 + 'px';
        }

        if (this.dir == 'up' && this.elem.offsetTop == -this.elem.offsetHeight / 2) {
            this.elem.style.top = 0;
        }
    },

    // 绑定控制元素的事件
    bindEvents: function () {
        var _this = this;

        // 鼠标移入父级元素时暂停
        this.bind(this.elem.parentNode, "mouseover", function () {
            _this.stop();
            _this.pausing = true;
        });

        // 鼠标移出父级元素时重新开始滚动
        this.bind(this.elem.parentNode, "mouseout", function () {
            _this.pausing = false;
            _this.autoPlay && _this.startScroll();
        });
    },

    // 停止滚动
    stop: function () {
        clearInterval(this.timer);
    },

    // 执行滚动效果
    doScroll: function () {
        var _this = this,
            style, offset, target, step, elemSize;

        if (this.dir == 'left' || this.dir == 'right') {
            // element.style[ 'left' | 'top' ]
            style = 'left';
            offset = 'offsetLeft';
            elemSize = this.elem.offsetWidth / 2;
        } else {
            // element[ offset[Left|Top] ];
            style = 'top';
            offset = 'offsetTop';
            elemSize = this.elem.offsetHeight / 2;
        }

        step = (this.dir == 'left' || this.dir == 'up') ? -this.step : this.step;

        if (this.stepInterval == 0) {
            // 滚动效果执行时间为0时，进入无缝滚动模式
            if (elemSize - Math.abs(this.elem[offset]) < Math.abs(step)) {
                step = step / Math.abs(step) * (elemSize - Math.abs(this.elem[offset]));
            }
            target = this.elem[offset] + step;
            target = this.fixTarget(step, this.elem[offset] + step, elemSize);
            this.elem.style[style] = target + "px";

        } else {

            if (this.timerStep != null) return;

            //先停止掉this.timer，在滚动执行完过后再开启
            this.stop();

            // 将step按stepInterval分割
            var seed = 50 / _this.stepInterval * step;
            seed = seed < 0 ? Math.ceil(seed) : Math.floor(seed);

            this.timerStep = setInterval(function () {
                seed = seed > 0 ? Math.min(seed, step) : Math.max(seed, step);

                target = _this.fixTarget(seed, _this.elem[offset] + seed, elemSize);
                _this.elem.style[style] = target + "px";

                step -= seed;
                if (step == 0) {
                    clearInterval(_this.timerStep);
                    _this.timerStep = null;

                    if (_this.autoPlay && !_this.pausing) {
                        _this.startScroll();
                    }
                }
            }, 30);
        }
    },

    // 修正超出边界的滚动
    fixTarget: function (dir, target, max) {
        // left or up, 当元素offset=最大滚动值时将offset变为0
        if (dir < 0 && Math.abs(target) >= max) {
            return 0;
        }

        // right or down，当元素offset=0时将offset变为最大滚动值
        if (dir > 0 && target >= 0) {
            return -max;
        }
        return target;
    },

    // 改变方向
    changeDir: function (dir) {
        this.dir = dir;
        this.loadStyle();
        this.doScroll();
    },

    // 开始滚动
    startScroll: function () {
        var _this = this;
        this.timer = setInterval(function () {
            _this.doScroll();
        }, _this.interval);
    },

    extend: function (opt, target) {
        for (name in opt) {
            target[name] = opt[name];
        }
    },

    //绑定事件方法
    bind: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = hanlder;
        }
    }
};