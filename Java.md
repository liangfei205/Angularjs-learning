# JAVA规范

## 目录
1. [文件名称](#FileName)
1. [文件组织](page03.md)
1. [缩进](page04.md)
1. [注释](page05.md)
1. [声明](page06.md)
1. [语句](page07.md)
1. [空白](page08.md)
1. [命名规范](#Naming)
1. [编程惯例](#Programming)
1. [代码示例](#Code)

1. [GIT](#Git)
1. [源文件](#Sourcefile)
1. [Javadoc](#Javadoc)
1. [微服务&组件规范](#ms)

## 文件名称
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

## <a name="ms">微服务</a>
* 必装：JDK8、IDEA、Maven、Redis、mysql、Git
* 选装：Sonarqube、SQLyog、SourceTree、TortoiseGit
* 本地开发配置文件为：application-local.yml
* 在VM options里面配置：-Dspring.cloud.bootstrap.enabled=false -Dspring.profiles.active=local
* flyway sql脚本文件命名：V2__HMS_1234_ddl.sql，不同环境的脚本文件名要保持一致。文件名里面要体现jira号和ddl、dml
* 本地编译通过后才能提交代码合并请求，今后开发和测试的Jenkins build要开启单元测试，单元测试失败会导致build失败，请务必单元测试通过后发合并请求
* 禁用@SuppressWarnings("all")，慎用@SuppressWarnings("unused")，建议使用IDE的Suppress for ...
