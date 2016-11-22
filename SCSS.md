# SCSS规范

<a name="Catlog"></a>
## 目录
- [00 序言](#c00)
- [01 目录结构](#c01)
- [02 代码风格](#c02)
- [03 基本变量](#c03)
- [04 全局样式](#c04)
- [05 基本UI组件](#c05)
- [06 布局风格](#c06)
- [07 scss开发技巧](#c07)

## <a name='c00'>序言</a>
遵守合理的SCSS开发规范，可以减少前端代码数量、维护代码整洁度，帮助新加入的成员更快的理解代码，并且编写的代码也会保持良好的风格。此规范结合了医生端app的部分代码，通用性将有所降低。

本规范是结合项目实践总结而来，故很多内容建立在特定的使用情形下，如果在使用过程中难以理解本规范请先阅读[SCSS基础规范](http://www.css88.com/archives/5505)，这将帮助你理解SCSS开发中最基础的规范规则。

**[⬆ 回到顶部](#Catlog)**

## <a name='c01'>01 目录结构</a>

```
scss
┠ components 基本组件
┠ commons 通用布局
┠ mixins 储存宏
┠ reset 重置ionic自带的样式
┠ pages 每个html文件对应的scss文件
　┠ [subcategory] 可以设立子目录进行整理
　┗ _pageName.scss
┠ variables.scss 储存全局变量
┠ global.scss 储存基本的通用代码
┗ project_name.scss scss文件主入口

lib
┠ bourbon@4.2.7 一个很棒的mixins库 通过npm安装
┗ iconfont 字体图标 手动更新
```

**[⬆ 回到顶部](#Catlog)**

## <a name='c02'>02 代码风格</a>

#### 02.1 Class命名风格

使用class时，要保证以下几点

* 让他人易于理解语意
* 让他人易于理解结构
* 让他人方便修改
* 不要把class用的和id一样
* 合理分行
* 新增组件和全局变量时 及时更新文档

```
// 使用全小写字母命名，单词之间用短横线分割
// 不正确
.TopImg
.topImg
.top_img

// 正确
.top-img
```

```
// 对可以分离的一个(大)整体使用 *-box 
// 对可以分离且 样式大量重复 的部分使用 *-item
// 注意名词单复数使用
	
<div class="inputs-list-box">
	<div class="input-item">
		<input/>
	</div>
	<div class="input-item">
		<input/>
	</div>
	...
</div>
```
	
```
// 在一个 *-box *-item 内部还需要对element包裹div需要使用 *-ct (content的缩写)
// 通常需要设置布局属性时(position etc.) 使用 *-ct 

<div class="article-item">
	<div class="cover-ct">
		<img/>
	</div>
	<div class="text-ct">
		<p></p>
	</div>
	<div class="label-ct">
		<label></label>
		<label></label>
	</div>
</div>
```

```
// 组件会以特定前缀命名 component-*
// 通常组件中的dom结构也是固定的
	
<div class="component-title">
	<p class="title"></p>
</div>
```
	
```
// 常用非指定样式class命名
// 非指定样式是指此class没有特定的全局样式 只是为了统一语义化

// .avatar 头像
// .text 文字
// .btn 按钮(button的缩写 避免使用button 会和ionic造成冲突)
// .title 标题
// .headline 标题(只表示文章标题)
// .red-point 消息数量提示

// 如果需要对上面的内容进行布局时 增加 -ct 在class后面
<div class="avatar-ct">
	<div class="avatar" style="background-image:url();">
</div>
```

```
// 常用指定样式class命名
// 指定样式是指此class已经设置好特定的样式 只需要在dom中使用就会有效
// 注意 指定的样式可能在全局声明 也可能在组件中声明

// 详见第四章
```

``` 
// 综合上面的全部内容 我们可以得到一个完整的dom结构和class命名规范
<div class="entries-list-box box">
	<div class="entry-item">
		<p class="icon-ct">
			<span class="icon"></span>
		</p>
		<p class="text-ct">
			<span class="title">备忘</span>
			<span class="des">请设置备忘内容</span>
		</p>
		<p class="arrow-ct">
			<span class="icon ion-ios-arrow-right"></span>
		</p>
	</div>
	<div class="entry-item">
		...
	</div>
	...
</div>
```

#### 02.02 id命名规则

1.约定每个html页面都只配置一个id，保证页面之间的特殊样式不会互相污染。约定每个html页面都会有一个同名scss文件，且使用短横线划分的全小写字母id作为根节点

```
// voiceMeeting.html
<ion-view id="voice-meeting">
	...
</ion-view>

// _voiceMeeting.scss
#voice-meeting {
	...
}
```

2.对于表示某部分DOM的特殊性、唯一性、公用性，可以使用id进行标示

```
// index.html 
<toast id="toast-box">
	<p>加载成功</p>
</toast>
```

#### 02.03 SCSS变量使用

声明变量在SCSS中是最基础的功能，但是如果能了解其中的妙处，可以让样式开发变得事半功倍。

变量按作用范围主要分为两种：

* 全局变量
* 局部变量

由于SCSS可以进行值计算，所以全局变量主要声明了样式中最基本的、最重要的、大量重复使用的参数。而局部变量则是在作用域范围内生效的变量，易于拆分和修改。全局变量的内容请参考[第03章](#c03)。

局部样式通常在scss的嵌套中使用，由于样式多涉及到数值的声明和修改，而大量的数值又很容易混淆，无法摸清楚数值之间的逻辑关系，如图：

```
.item {
	padding: 10px 15px;
	
	.avatar-ct {
		flaot: left;
		width: 24px;
		height: 24px;
	}
	
	.text-ct {
		float: left;
		height: 24px;
		width: calc(100% - 54px);
		line-height: 12px;
	}
}
```

我们通过上面的代码，大概可以知道这是一个左右结构的布局，左侧是正方形的头像右侧是文字。但是如果我们尝试修改和深入理解这段代码就会有很多不方便的地方。

比如我们很难掌握数值之间的逻辑关系，比如你能一眼看出`54px` 和`15px`之间的关系么？一旦修改可能有复杂的牵扯。再来看看下面的代码：

```
// 我们声明三个变量来简化代码，并且通过变量名称我们也可以大概了解到变量的语义。
// 并且我们知道了数值之间的关系，尤其是涉及到计算的部分。这是一个正方形的头像；头像的高度和文字块的高度一致；
// 如果需求变更，头像尺寸增大，那么我们只需要改变变量，所有的数值都会更新。

.item {
	$viewport-gutter: 15px;
	$avatar-ct-size: 24px;
	$lines-count: 2;
	
	padding: 10px $viewport-gutter;
	
	.avatar-ct {
		flaot: left;
		width: $avatar-ct-size;
		height: $avatar-ct-size;
	}
	
	.text-ct {
		float: left;
		height: $avatar-ct-size;
		width: calc(100% - $avatar-ct-size - $viewport-gutter * 2);
		line-height: $avatar-ct-size / $lines-count;
	}
}
```

#### 02.04 SCSS属性与值

为了保证更容易的阅读、定位代码，我们约定scss的属性声明顺序必须依照以下规则：

```
// 结构性 属性优先(严格)：
// 文档流和布局相关的属性
display
position, left, top, right etc.
overflow, float, clear etc.
box-sizing
margin, padding
width, height

// 表现性属性(非严格)：
background, border etc.
font, color etc.

// 这样做的好处是，开发人员浏览属性时可以快速知道某属性是否被声明，并且和布局相关的属性可以在一开始就能读到
```

通常我们都尽可能的使用缩写属性来简化代码，但有时候过度简化会增加代码阅读难度，所以我们本着易于理解的原则做出以下约定：

```
// padding margin 属性如果缩写值超过2个就应该独立声明
// 不准确
{ padding: 0 10px 5px 15px; } // tips：如果真的有这种标注 那你应该找UI好好谈谈 或者设计一个更好的结构去避免
{ padding: 0 20px 15px; }

// 准确
{ 
	padding: 0 10px;
	padding-bottom: 5px;
	padding-left: 15px;
}
{
	padding: 0 20px;
	padding-bottom: 15px;
}
```

**[⬆ 回到顶部](#Catlog)**

## <a name='c03'>03 全局变量</a>

#### 03.01 全局变量列表

* colors 
* font  全局字体设置
* font-colors 
* font-size
* positions  一些全局定位 边距等


#### 03.02 全局变量增加规则

1.命名应该清晰准确。

```
准确：$primary-color，不准确：$special-color
// 主要色值 要比 特殊色值 更准确
```

2.使用 xs/sm/md/lg/xl 等来区分不同数值的变量。

```
准确：$gutter-sm，不准确：$gutter-special
// 小号边距 要比 特殊边距 更准确
```

3.使用全小写字母，使用短横线分词

```
准确：$primary-color
不准确：$primaryColor
不准确：$Primary-color
```

**[⬆ 回到顶部](#Catlog)**

## <a name='c04'>04 全局样式</a>
全局样式包含了**指定样式**、**Placeholder**、**Mixin**。


#### 04.01 指定样式Class列表
让开发者可以通过直接增加和删除class来控制样式，这样的Class被称为**指定样式**。

```
// 对数字使用特殊字体
.number-font-family {
	font-family: $number-font-family;
}

// 给文字元素增加省略号 (:after)
.ellipsis {
	&:after {
		content: '...';
	}
}

// 给box增加上下的分割线、增加上下margin和margin控制器、默认背景色
.box {
	@include thin-border(vertical);
	margin: $vertical-gutter 0;
	@extend %box-margin-ctrl;
	background-color: white;
}

```

#### 04.02 Placeholder列表
```
// 清除浮动样式 (:after)
%cf {
	&:after {
		content: '';
		display: table;
		clear: both;
	}
}

// 重置 ion-item 样式
%ion-item-reset {
	.item {
		margin: 0;
		padding: 0;
		border: none;
		
		&>div.item-content {
			padding: 0;
		}
	}
}


// 主要控制box级别的上下margin 
%box-margin-ctrl { 
	&.margin { 
		margin-top: $vertical-gutter; 
		margin-bottom: $vertical-gutter; 
	} 
	&.margin-top { 
		margin-top: $vertical-gutter; 
	} 
	&.margin-bottom { 
		margin-bottom: $vertical-gutter; 
	} 
	&.no-margin { 
		margin-top: 0; 
		margin-bottom: 0; 
	} 
	&.no-margin-top { 
		margin-top: 0; 
	} 
	&.no-margin-bottom { 
		margin-bottom: 0; 
	} 
}


// span间距清除
%letter-spacing-reset {
	& {
		letter-spacing: -0.5em;
		
		span {
			letter-spacing: normal;
		}
	}
}


```

#### 04.03 Mixin列表
```
// 用于设置只有0.5px的描边样式
// 注意 调用处会增加 position: relative; 属性

@mixin thin-border ([$direction, $color, $border-radius]) 
// 接受三个参数
// $direction: top, bottom, left, right, vertical, all;
// $color: 色值;
// $border-radius: rem;


// 增加特殊的thin-border样式
@mixin thin-guide-line ([$color, $left]);
// 接受两个参数
// $color: 色值;
// $left: 分割线左边空余的距离


// 移除thin-border
@mixin remove-thin-border([$direction])
// 接受一个参数
// $direction: top, bottom, left, right, vertical, all;


// 裁切多行文字 并增加省略号
@mixin trim-text-block($line-count)
// 接受一个参数
// $line-count: number;
 
```

#### 04.02 全局样式增加规则

* 重复使用三次的样式可以考虑增加全局样式。
* 重复使用的属性组合 且 值几乎不变 可考虑增加placeholder。
* 重复使用的属性组合 且 值会有变化 可考虑增加mixin。

**[⬆ 回到顶部](#Catlog)**

## <a name='c05'>05 基本UI组件</a>

基本UI组件通常覆盖了常用的样式，避免开发过程中代码的重复，通常在高保真图出来时，要先分析哪些部分可以成组，然后先编写组件。

组件通常保证了页面样式的一致性，可以做到一处修改全局更新的效果。

* 组件文件名要以大写字母开头
* 组件命名要加前缀 component-*
* 即使组件只有一种子组件 也需要加Class default

#### 05.01 基本UI组件列表

```
// _Button.scss 按钮相关样式
// _AvatarList.scss 头像列表
// _Entry.scss 入口项相关样式
// _Empty-block.scss 文字占位块相关样式
// _Input.scss 输入相关样式(开发中) 
// _List.scss 列表相关样式
// _Textarea.scss 长文字输入相关样式
// _Title.scss 标题相关样式
// ...

// 样式具体使用方法在文件内编写

// 可查看demo页 
```
#### 05.02 基本UI组件增加规则

**[⬆ 回到顶部](#Catlog)**

## <a name='c06'>06 布局风格</a>

**[⬆ 回到顶部](#Catlog)**

## <a name='c07'>07 scss开发技巧</a>

#### 07.01 消除两个span之间的间距

```
<p>
	<span>字母</span>
	<span>汉字</span>
</p>

p {
  letter-spacing: -0.25em;
  
  span {
    letter-spacing: normal;
  }
}
```

#### 07.02 垂直居中

```
<div class="box">
	<div class="item"></div>
</div>

.box {
	position: relative;
}

.item {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
}
```

**[⬆ 回到顶部](#Catlog)**
