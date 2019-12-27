# shell入门

## 什么是shell脚本

### 示例

看个例子：

```shell
#!bin/sh
cd ~
mkdir shell_tut
cd shell_tut

for ((i = 0; i < 10; i ++)) ; do
  touch test_$i.txt
done
```

### 解释

- 第一行： 指定脚本解释器，这里是用/bin/sh
- 第二行： 切换到当前用户的home目录
- 第三行： 创建一个目录shell_tut
- 第四行： 切换到shell_tut
- 第五行： 循环条件，一共循环10次
- 第六行： 创建一个test_0～9.txt文件
- 第七行： 循环体结束


### shell和shell脚本的概念

shell是指一种应用程序，这个应用程序提供了一个界面，用户通过这个界面访问操作系统内核的服务。Ken Thompson的sh是第一种Unix Shell，Window Explore是一个典型的图形界面Shell

shell脚本（Shell Script），是一种为shell编写的脚本程序。业界所说的shell通常都是指shell脚本，但读者朋友要知道，shell和shell script是两个不同的概念。由于习惯的原因，简洁起见，本文出现的“shell编程”都是指shell脚本编程，不是指shell自身（如Windows Explore扩展开发）。

## 环境

shell编程跟Java、PHP编程一样，只要有一个能编写代码的文本编辑器和一个能解释执行的脚本解释器就可以了

### OS

当前主流的操作系统都支持shell编程，本文档所述的shell编程是指Linux下的shell，讲的基本都是POSIX标准下的功能，所以，也适用于Unix及BSD（如Mac OS）


### Linux

Linux默认安装就带了shell解释器

### Mac OS

Mac OS 不仅带了sh、bash这两个最基础的解释器，还内置了ksh、csh、zsh等不常用的解释器
