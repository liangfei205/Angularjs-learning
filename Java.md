# JAVA 规范

## 目录
0. GIT
1. [源文件](#Sourcefile)
2. [格式](#Formatting)
3. [命名约定](#Naming)
4. [编程实践](#ProgrammingPractices)
5. [Javadoc](#Javadoc)
6. [微服务&组件规范](#ms)

## GIT
* MS-HMS需开发人员自行fork个人repo，fork时请确保同步选项选中，fork后先将master, release, staging, test, dev分支设置为不经过pull request不可变更
* 不得提交有工具生成的文件和目录如：.iml, .idea, target
* 所有文件必须LF换回，不得提交CRLF换行的文件，请自行修改GIT设置
* 提交注释为<JIRA Key>:<JIRA Summary>后跟具体注释（可考虑换回）如：HMS-1210:测试环境反复注册eureka，升级到Brixton.SR3

## 源文件
* 除下面特别说明意外以Google-Java-Style-Guide为准
  * 4.2 缩进4个空格
  * 4.4 代码行字符限制120，package、import除外
  * 4.6.3 不要使用变量对齐
  * 4.8.2 局部变量前面要加final，不要给同一个变量多次赋值
  * 4.8.8 对应比较长的数字加上下划线分隔，如：3_000_000_000L
  * 6.2 捕获异常时要避免直接使用Exception

## 微服务
* 必装：JDK8、IDEA、Maven、Redis、mysql、Git
* 选装：Sonarqube、SQLyog、SourceTree、TortoiseGit
* 本地开发配置文件为：application-local.yml
* 在VM options里面配置：-Dspring.cloud.bootstrap.enabled=false -Dspring.profiles.active=local
* flyway sql脚本文件命名：V2__HMS_1234_ddl.sql，不同环境的脚本文件名要保持一致。文件名里面要体现jira号和ddl、dml
* 本地编译通过后才能提交代码合并请求，今后开发和测试的Jenkins build要开启单元测试，单元测试失败会导致build失败，请务必单元测试通过后发合并请求
* 禁用@SuppressWarnings("all")，慎用@SuppressWarnings("unused")，建议使用IDE的Suppress for ...