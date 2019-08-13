![](https://upload-images.jianshu.io/upload_images/9403248-4d9248d6fb157d02.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 前沿

Electron应用在开发以后，本地运行build只能打包相对于的环境。如在Mac下运行只能打包dmg不能兼顾其他平台。为了解决这个痛点，就有了这篇文章。

简单说一下构建和发布流程：主要是配置工具[elertron-builder](https://github.com/electron-userland/electron-builder)，配置[Travis](https://travis-ci.org/)一构建Linux和Mac应用，配置[appveyor](https://www.appveyor.com/)以构建Windows应用，当提交到GitHub代码后，CI自动拉去代码，运行 electron-builder相关命令，生成一个平台的安装包，并将安装包推送到GitHub Release中。

