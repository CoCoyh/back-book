# egg常见问题笔记


## egg日志的时区问题
问题：服务器中打印date时间是正常的，但是日志里的时间少了8小时
方法：（待亲自验证）试下加 TZ 这个环境变量来启动看看。或者自定义 formatter，看下 egg-logger 源码


## node后台快速开发框架（TypeScript）

基于egg.js后台快速开发框架，极速编码

码云：https://gitee.com/tjp0515/cool-admin-api
github：https://github.com/apgzs/cool-admin-api
bilibili：https://www.bilibili.com/video/av69398358
