# Frameworks
rewrite famous frameworks on my own

这是一个用来存放我自己对一些流行框架的实现的Repo

内容如下:
- TH-Frameworks,仿jQuery框架,未完成,已实现功能如下
	> 1.选择器模块
	>> 实现了 多层级，id，class，tag 选择器，
	实现了eq，find，first，last，children，siblings等筛选功能，
	支持end()返回筛选前的TH对象。
	有两个版本，递归实现和管道模式实现。
	
	> 2.DOM操作模块
	>> append, prepend, appendTo, prependTo, insertAfter, insertBefore, replaceWith, replaceAll
	
	> 3.事件模块 暂未实现多处理任务绑定在同一个事件上的功能和解绑功能。
	
	> 4.样式操作模块 css(), hide(), show()...
	
	> 5.属性模块 attr(), removeAttr(), addClass(), removeClass(), toggleClass(), hasClass() 等
	
	> 6.动画模块
	>> 实现了动画队列的功能，譬如以下代码：
	TH("div ul li")
		  .animate({"width":"500px","height":"100px","opacity":"0.3"},2000,"linear",function(){console.log("complete1");})
		  .animate({"width":"200px","height":"30px","opacity":"1"},2000,"linear",function(){console.log("complete2");})
		  .animate({"width":"500px","height":"100px","opacity":"0.3"},2000,"linear",function(){console.log("complete3");});
	上述三个动画将轮流进行。
	
	