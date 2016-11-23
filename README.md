# Angularjs-learning

## 目录
  1. [SPA](#spa)
  1. [Directive&DataBind](#dd)
   1. [Directives](#directives)
   1. [Expression](#expression)
   1. [Filter](#filter)
  1. [Simple Project](#sp)
   1. [Controllers](#controllers)
   1. [View](#view)
   1. [Model](#model)
   1. [Scope](#scope)
  1. [Modules&Router](#mr)
   1. [Dependency Injection](#di)
   1. [Providers](#providers)
   1. [Services](#services)
   1. [Factory](#factory)
   1. [Router](#router)
  1. [Big Project](#bp)
   1. [ui-router](#uir)
   1. [Promises / Deferred](#pd)
   1. [$http / $resource](#hr)
   1. [Broadcast](#broadcast)

<a name="spa"></a>
## SPA
### 定义(SPA)

<a name="dd"></a>
## Directive&DataBind
<a name="directives"></a>
### Directives
#### Directive List
| 指令				| 描述 																|
| ----------------- |:-----------------------------------------------------------------:|
| ng-app				| 定义应用程序的根元素。												|
| ng-bind			| 绑定 HTML 元素到应用程序数据											|
| ng-bind-html		| 绑定 HTML 元素的 innerHTML 到应用程序数据，并移除 HTML 字符串中危险字符	|
| ng-bind-template	| 规定要使用模板替换的文本内容											|
| ng-blur			| 规定 blur 事件的行为												|
| ng-change			| 规定在内容改变时要执行的表达式										|
| ng-checked			| 规定元素是否被选中													|
| ng-class			| 指定 HTML 元素使用的 CSS 类											|
| ng-class-even		| 类似 ng-class，但只在偶数行起作用										|
| ng-class-odd		| 类似 ng-class，但只在奇数行起作用										|
| ng-click			| 定义元素被点击时的行为												|
| ng-cloak			| 在应用正要加载时防止其闪烁											|
| ng-controller		| 定义应用的控制器对象													|
| ng-copy			| 规定拷贝事件的行为													|
| ng-csp				| 修改内容的安全策略													|
| ng-cut				| 规定剪切事件的行为													|
| ng-dblclick		| 规定双击事件的行为													|
| ng-disabled		| 规定一个元素是否被禁用												|
| ng-focus			| 规定聚焦事件的行为													|
| ng-form			| 指定 HTML 表单继承控制器表单											|
| ng-hide			| 隐藏或显示 HTML 元素												|
| ng-href			| 为 the &lt;a&gt; 元素指定链接										|
| ng-if				| 如果条件为 false 移除 HTML 元素										|
| ng-include			| 在应用中包含 HTML 文件												|
| ng-init			| 定义应用的初始化值													|
| ng-jq				| 定义应用必须使用到的库，如：jQuery									|
| ng-keydown			| 规定按下按键事件的行为												|
| ng-keypress		| 规定按下按键事件的行为												|
| ng-keyup			| 规定松开按键事件的行为												|
| ng-list			| 将文本转换为列表 (数组)												|
| ng-model			| 绑定 HTML 控制器的值到应用数据										|
| ng-model-options	| 规定如何更新模型													|
| ng-mousedown		| 规定按下鼠标按键时的行为												|
| ng-mouseenter		| 规定鼠标指针穿过元素时的行为											|
| ng-mouseleave		| 规定鼠标指针离开元素时的行为											|
| ng-mousemove		| 规定鼠标指针在指定的元素中移动时的行为									|
| ng-mouseover		| 规定鼠标指针位于元素上方时的行为										|
| ng-mouseup			| 规定当在元素上松开鼠标按钮时的行为										|
| ng-non-bindable	| 规定元素或子元素不能绑定数据											|
| ng-open			| 指定元素的 open 属性												|
| ng-options			| 在 &lt;select&gt; 列表中指定 &lt;options&gt;						|
| ng-paste			| 规定粘贴事件的行为													|
| ng-pluralize		| 根据本地化规则显示信息												|
| ng-readonly		| 指定元素的 readonly 属性											|
| ng-repeat			| 定义集合中每项数据的模板												|
| ng-selected		| 指定元素的 selected 属性											|
| ng-show			| 显示或隐藏 HTML 元素												|
| ng-src				| 指定 &lt;img&gt; 元素的 src 属性									|
| ng-srcset			| 指定 &lt;img&gt; 元素的 srcset 属性									|
| ng-style			| 指定元素的 style 属性												|
| ng-submit			| 规定 onsubmit 事件发生时执行的表达式									|
| ng-switch			| 规定显示或隐藏子元素的条件											|
| ng-transclude		| 规定填充的目标位置													|
| ng-value			| 规定 input 元素的值													|

#### Event
AngularJS 支持以下事件:
* ng-click
* ng-dbl-click
* ng-mousedown
* ng-mouseenter
* ng-mouseleave
* ng-mousemove
* ng-keydown
* ng-keyup
* ng-keypress
* ng-change

#### Custom Directives
你可以使用 .directive 函数来添加自定义的指令。
要调用自定义指令，HTML 元素上需要添加自定义指令名。
使用驼峰法来命名一个指令， runoobDirective, 但在使用它时需要以 - 分割, runoob-directive:
```html
<body ng-app="myApp">

<runoob-directive></runoob-directive>

<script>
var app = angular.module("myApp", []);
app.directive("runoobDirective", function() {
    return {
        restrict : "A",
        template : "<h1>自定义指令!</h1>"
    };
});
</script>

</body>
```
restrict 值可以是以下几种:
* E 作为元素名使用
* A 作为属性使用
* C 作为类名使用
* M 作为注释使用
restrict 默认值为 EA, 即可以通过元素名和属性名来调用指令。
```html
<!-- 元素名 -->
<runoob-directive></runoob-directive>
<!-- 属性 -->
<div runoob-directive></div>
<!-- 类名 -->
div class="runoob-directive"></div>
<!-- 注释 -->
<!-- 指令: runoob-directive -->
```

<a name="expression"></a>
### Expression

<a name="filter"></a>
### Filter
####过滤器语法
我们可以直接在{{}}中使用filter，跟在表达式后面用 | 分割，语法如下：
```javascript
{{ expression | filter }}
```
也可以多个filter连用，上一个filter的输出将作为下一个filter的输入（怪不得这货长的跟管道一个样。。）
```javascript
{{ expression | filter1 | filter2 | ... }}
```
filter可以接收参数，参数用 : 进行分割，如下：
```javascript
{{ expression | filter:argument1:argument2:... }}
```
除了对{{}}中的数据进行格式化，我们还可以在指令中使用filter，例如先对数组array进行过滤处理，然后再循环输出：
```html
<span ng-repeat="a in array | filter ">
```
####内置过滤器
| 过滤器				| 描述 					|
| ----------------- |:---------------------:|
| currency			| 格式化数字为货币格式。	|
| date 				| 日期格式化				|
| filter			| 从数组项中选择一个子集。	|
| orderBy			| 根据某个表达式排列数组。	|
| number			| 格式化数字				|
| lowercase			| 格式化字符串为小写。		|
| uppercase			| 格式化字符串为大写。		|
| limitTo			| 限制数组长度或字符串长度 |
| json				| 格式化json对象			|
####自定义过滤器
```javascript
var myAppModule = angular.module("myApp",[]);
	myAppModule.filter("reverse",function(){
                return function(input,uppercase){
                    var out = "";
                    for(var i=0 ; i<input.length; i++){
                        out = input.charAt(i)+out;
                    }
                    if(uppercase){
                        out = out.toUpperCase();
                    }
                    return out;
                }
            });
```

<a name="sp"></a>
## Simple Project

<a name="controllers"></a>
### Controllers

<a name="view"></a>
### View

<a name="model"></a>
### Model

<a name="scope"></a>
### Scope


<a name="mr"></a>
## Modules&Router

<a name="di"></a>
### Dependency Injection

<a name="providers"></a>
### Providers

<a name="services"></a>
### Services

<a name="factory"></a>
### Factory

<a name="router"></a>
### Router


<a name="bp"></a>
## Big Project

<a name="uir"></a>
### ui-router

<a name="pd"></a>
### Promises / Deferred

<a name="hr"></a>
### $http / $resource

<a name="broadcast"></a>
### Broadcast

- $emit只能向parent controller传递event与data
- $broadcast只能向child controller传递event与data
- $on用于接收event与data

$emit和$broadcast可以传多个参数，$on也可以接收多个参数。
在$on的方法中的event事件参数，其对象的属性和方法如下:

| 事件属性 | 目的 |
| ----------------- |:-----------------------------------------------------------------:|
| event.targetScope | 发出或者传播原始事件的作用域 |
|event.currentScope | 目前正在处理的事件的作用域 |
|event.name | 事件名称 |
|event.stopPropagation() | 一个防止事件进一步传播(冒泡/捕获)的函数(这只适用于使用`$emit`发出的事件) |
|event.preventDefault() | 这个方法实际上不会做什么事，但是会设置`defaultPrevented`为true。直到事件监听器的实现者采取行动之前它才会检查`defaultPrevented`的值。 |
|event.defaultPrevented | 如果调用 |
