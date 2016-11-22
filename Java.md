# JAVA规范

## 目录
1. [文件名称](#FileName)
1. [文件组织](#FileStructure)
1. [缩进](#Indent)
1. [注释](#Note)
1. [声明](#Declare)
1. [语句](#Statement)
1. [空白](#Blank)
1. [命名规范](#Naming)
1. [编程惯例](#Program)
1. [代码示例](#Code)

1. [GIT](#Git)
1. [源文件](#Sourcefile)
1. [Javadoc](#Javadoc)
1. [微服务&组件规范](#MicroService)

## <a name="Git">文件名称</a>
这部分列出了常用的文件名及其后缀

### 文件后缀
Java 软件使用下面文件后缀:
文件类别    | 后缀
-----------|--------
Java 源文件 | .java
Java 字节码 | .class

### 常见文件名称
常见文件名称包括:

文件名称     | 用法
--------------|-----
`GNUmakefile` | makefiles的首选文件名。我们使用 `gnumake`来构建软件.
`README`      | 概述特定目录下所含内容的文件的首选文件名.

## <a name="FileStructure">文件组织</a>
一个文件由被空行分割而成的段落以及标识每个段落的可选注释共同组成。

超过2000行的程序难以阅读，应该尽量避免。

正确编码格式的范例，见 ["Java 源文件案例"](#Code).

### Java 源文件
每个Java源文件都包含一个单一的公共类或接口。若私有类和接口与一个公共类相关联，可以将它们和公共类放入同一个源文件。公共类必须是这个文件中的第一个类或接口。

Java 源文件还遵循以下规则：

- 开头注释
- 包和引入语句
- 类和接口声明 

### 开头注释
所有的源文件都应该在开头有一个C语言风格的注释，其中列出类名、版本信息、日期和版权声明:

```java

	/*
	 * Classname
	 * 
	 * Version information
	 *
	 * Date
	 * 
	 * Copyright notice
	 */

```

### 包和引入语句
在多数 Java 源文件中，第一个非注释行是 `package` 语句。在它之后可以跟 `import` 语句。例如 :

```java

	package java.awt;
	
	import java.awt.peer.CanvasPeer;

```  

### 类和接口声明
T下表描述了类和接口声明的各个部分以及它们出现的先后次序。见 ["Java 源文件案例"](#SourceDemo) 一个包含注释的例子.

class/interface 声明的各个部分 | 注解
------------------------------------|-------
Class/interface 文档注释 (`/**...*/`) | 详见 ["文档注释"](#DocumentDeclare)
`class`或`interface` 声明 | 
Class/interface 实现注释 (`/*...*/`), 如果有必要的话 | 该注释应包含任何有关整个类或接口的信息，而这些信息又不适合作为 class/interface  文档注释.
Class (`static`) 变量 | 先是`public`class 变量,接着是 `protected`,再是包级别 (没有访问修饰符), 再是 `private`.
实例变量 | 先是 `public` class 变量,接着是 `protected`,再是包级别 (没有访问修饰符), 再是 `private`.
构造器 |
方法 | 这些方法应该按功能，而非作用域或访问权限，分组。例如，一个私有的类方法可以置于两个公有的实例方法之间。其目的是为了更便于阅读和理解代码.

## <a name="Indent">缩进</a>

## <a name="Note">注释</a>
Java 有两类注释: implementation comments（实现注释）和 documentation comments（文档注释）。 实现注释常见于 C++,使用 `/*...*/`,和 `//`。文档注释 (也称为"doc comments") 是 Java 独有的,使用 `/**...*/`。文档注释可以通过 javadoc 工具转成 HTML 文件。

实现注释用以注释代码或者特殊的实现。 文档注释从 implementation-free (实现自由)的角度描述代码的规范。它可以被那些手头没有源码的开发人员读懂。

注释应被用来给出代码的总览，并提供代码自身没有提供的附加信息。注释应该仅包含与阅读和理解程序有关的信息。例如，相应的包如何被建立或位于哪个目录下之类的信息不应包括在注释中。

在注释里，对设计决策中重要的或者不是显而易见的地方进行说明是可以的，但应避免提供代码中己清晰表达出来的重复信息。多余的的注释很容易过时。通常应避免那些代码更新就可能过时的注释。

**注意:** 频繁的注释有时反映出代码的低质量。当你觉得被迫要加注释的时候，考虑一下重写代码使其更清晰。

注释不应写在用星号或其他字符画出来的大框里。

注释不应包括诸如制表符和回退符之类的特殊字符。

### 实现注释的格式
实现注释的格式主要有4种: block（块）, single-line（单行）, trailing（尾端）, 和 end-of-line（行末）.

#### 块注释
块注释通常用于提供对文件，方法，数据结构和算法的描述。块注释被置于每个文件的开始处以及每个方法之前。它们也可以被用于其他地方，比如方法内部。在功能和方法内部的块注释应该和它们所描述的代码具有一样的缩进格式。

块注释之首应该有一个空行，用于把块注释和代码分割开来，比如：

```java

	/*
	 * Here is a block comment.
	 */

```
块注释可以以/*-开头，这样indent(1)就可以将之识别为一个代码块的开始，而不会重排它。

```java

	/*-
	 * Here is a block comment with some very special
	 * formatting that I want indent(1) to ignore.
	 *
	 *    one
	 *        two
	 *            three
	 */

```

**Note:** 如果你不使用indent(1)，就不必在代码中使用/*-，或为他人可能对你的代码运行indent(1)作让步。详见于 5.2 节 "Documentation Comments"

#### 单行注释
短注释可以显示在一行内，并与其后的代码具有一样的缩进层级。如果一个注释不能在一行内写完，就该采用块注释(参见"5.1.1 块注释")。单行注释之前应该有一个空行。以下是一个 Java 代码中单行注释的例子：:

```java

	if (condition) {

	    /* Handle the condition. */
	    ...
	}

```

#### 尾端注释
极短的注释可以与它们所要描述的代码位于同一行，但是应该有足够的空白来分开代码和注释。若有多个短注释出现于大段代码中，它们应该具有相同的缩进。

以下是一个Java代码中尾端注释的例子：

```java

	if (a == 2) {
	    return TRUE;            /* special case */
	} else {
	    return isPrime(a);      /* works only for odd a */
	}

```

#### 行末注释
注释界定符 `//` ，可以注释掉整行或者一行中的一部分。它一般不用于连续多行的注释文本；然而，它可以用来注释掉连续多行的代码段。以下是所有三种风格的例子：

```java

	if (foo > 1) {
	
	    // Do a double-flip.
	    ...
	}
	else
	    return false;          // Explain why here.
	
	//if (bar > 1) {
	//
	//    // Do a triple-flip.
	//    ...
	//}
	//else
	//    return false;

```

#### <a name="DocumentDeclare">文档注释</a>
注意：此处描述的注释格式之范例，参见["Java 源文件范例"](page11.md)。

更多细节，详见"How to Write Doc Comments for Javadoc"，里面包含了文档注释标签的信息(@return, @param, @see): 

[链接](http://www.oracle.com/technetwork/java/javase/documentation/index-137868.html)

更多关于文档注释和 javadoc，详见 javadoc 主页

[这里](http://www.oracle.com/technetwork/java/javase/documentation/codeconventions-141999.html#)

文档注释描述Java的类、接口、构造器，方法，以及字段(field)。每个文档注释都会被置于注释定界符 `/**...*/`之中，一个注释对应一个类、接口或成员。该注释应位于声明之前：

```java

	/**
	 * The Example class provides ...
	 */
	public class Example { ...

```

注意顶层(top-level)的类和接口是不缩进的，而其成员是缩进的。描述类和接口的文档注释的第一行(`/**`)不需缩进；随后的文档注释每行都缩进1格(使星号纵向对齐)。成员，包括构造函数在内，其文档注释的第一行缩进4格，随后每行都缩进5格。

若你想给出有关类、接口、变量或方法的信息，而这些信息又不适合写在文档中，则可使用实现块注释(见5.1.1)或紧跟在声明后面的单行注释(见5.1.2)。例如，有关一个类实现的细节，应放入紧跟在类声明后面的实现块注释中，而不是放在文档注释中。

文档注释不能放在一个方法或构造器的定义块中，因为Java会将位于文档注释之后的第一个声明与其相关联。

## <a name="Declare">声明</a>

## <a name="Statement">语句</a>

## <a name="Blank">空白</a>

## <a name="Naming">命名规范</a>

## <a name="Program">编程惯例</a>

## <a name="Code">代码示例</a>
### <a name="SourceDemo">Java 源文件示例</a>
下面的例子，展示了如何合理布局一个包含单一公共类的Java源程序。接口的布局与其相似。更多信息参见 ["类和接口声明"](page03.md) and ["文档注释"](#DocumentDeclare)

```java
	
	/*
	 * @(#)Blah.java        1.82 99/03/18
	 *
	 * Copyright (c) 1994-1999 Sun Microsystems, Inc.
	 * 901 San Antonio Road, Palo Alto, California, 94303, U.S.A.
	 * All rights reserved.
	 *
	 * This software is the confidential and proprietary information of Sun
	 * Microsystems, Inc. ("Confidential Information").  You shall not
	 * disclose such Confidential Information and shall use it only in
	 * accordance with the terms of the license agreement you entered into
	 * with Sun.
	 */
	
	
	package java.blah;
	
	import java.blah.blahdy.BlahBlah;
	
	/**
	 * Class description goes here.
	 *
	 * @version 1.82 18 Mar 1999
	 * @author Firstname Lastname
	 */
	public class Blah extends SomeClass {
	    /* A class implementation comment can go here. */
	    
	    /** classVar1 documentation comment */
	    public static int classVar1;
	
	    /**
	     * classVar2 documentation comment that happens to be
	     * more than one line long
	     */
	    private static Object classVar2;
	
	    /** instanceVar1 documentation comment */
	    public Object instanceVar1;
	
	    /** instanceVar2 documentation comment */
	    protected int instanceVar2;
	
	    /** instanceVar3 documentation comment */
	    private Object[] instanceVar3;
	
	    /** 
	     * ...constructor Blah documentation comment...
	     */
	    public Blah() {
	        // ...implementation goes here...
	    }
	
	    /**
	     * ...method doSomething documentation comment...
	     */
	    public void doSomething() {
	        // ...implementation goes here...
	    }
	
	    /**
	     * ...method doSomethingElse documentation comment...
	     * @param someParam description
	     */
	    public void doSomethingElse(Object someParam) {
	        // ...implementation goes here...
	    }
	}

```

## <a name="Git">GIT</a>
* 开发人员需自行fork个人repo，fork时请确保同步选项选中，fork后先将master, release, staging, test, dev分支设置为不经过pull request不可变更
* 不得提交有工具生成的文件和目录如：.iml, .idea, target
* 所有文件必须LF换回，不得提交CRLF换行的文件，请自行修改GIT设置
* 提交注释如下:

  ```javascript
  任务号：GP-610
  提交者：张XX
  提交事项：签约平台和PC工作站首页改版，根据权限配置增加使用指南
  ```

## <a name="Sourcefile">源文件</a>
* 除下面特别说明意外以Google-Java-Style-Guide为准
  * 4.2 缩进4个空格
  * 4.4 代码行字符限制120，package、import除外
  * 4.6.3 不要使用变量对齐
  * 4.8.2 局部变量前面要加final，不要给同一个变量多次赋值
  * 4.8.8 对应比较长的数字加上下划线分隔，如：3_000_000_000L
  * 6.2 捕获异常时要避免直接使用Exception

## <a name="MicroService">微服务</a>
* 必装：JDK8、IDEA、Maven、Redis、mysql、Git
* 选装：Sonarqube、SQLyog、SourceTree、TortoiseGit
* 本地开发配置文件为：application-local.yml
* 在VM options里面配置：-Dspring.cloud.bootstrap.enabled=false -Dspring.profiles.active=local
* flyway sql脚本文件命名：V2__HMS_1234_ddl.sql，不同环境的脚本文件名要保持一致。文件名里面要体现jira号和ddl、dml
* 本地编译通过后才能提交代码合并请求，今后开发和测试的Jenkins build要开启单元测试，单元测试失败会导致build失败，请务必单元测试通过后发合并请求
* 禁用@SuppressWarnings("all")，慎用@SuppressWarnings("unused")，建议使用IDE的Suppress for ...
