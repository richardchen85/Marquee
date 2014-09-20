Marquee
================

原生JavaScript实现任意方向的无缝滚动，兼容FF, chrome, IE6+

使用方法
================

var marquee = new Marquee({
    elem: document.getElementById("demo1"),
    autoPlay: true,
    step:2,
    stepInterval: 0,
    interval: 50,
    dir: 'left'
});<br>
可以使用marquee的changeDir方法改变滚动方向，实现上一张下一张

参数
================

<ul>
  <li>elem：要滚动的元素</li>
  <li>step：每次滚动的步长(px)，默认0</li>
  <li>stepInterval：滚动效果执行时间(ms)，默认400</li>
  <li>interval：每次滚动间隔时间(ms)，默认3000</li>
  <li>dir：滚动方向，up、down、left、right，默认为"left"</li>
  <li>autoPlay：是否自动滚动，默认为true</li>
  <li>hoverPause：是否在鼠标滑过低级元素时暂停滚动，默认为true</li>
</ul>
