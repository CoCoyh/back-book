# 使用node-clinic快速定位性能问题

1. 安装

```
npm install -g clinic
```

2. 启动服务

```
clinc doctor -- node app.js
```

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-11-19-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-11-19%20%E4%B8%8B%E5%8D%885.30.04.png?Expires=1574160110&OSSAccessKeyId=TMP.hgn5dhzSWarRbngXG5bcsViwkKjQJKYo88u9PN1VbzngRQu5TpA4sX18jchtgVKc38xLy1nGBbGyW1po5kPpjQk5yuQwB3toowqRfFiokQkX1gvmn2m3ipYUP4BinW.tmp&Signature=vXxRmqR3tSOUwdMFrXq5Yn6ATrE%3D)

3. 跑一次压测

```
ab -c 10 -n 10000 http://127.0.0.1:7001/DouyinApp
```

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-11-19-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-11-19%20%E4%B8%8B%E5%8D%885.42.37.png?Expires=1574160175&OSSAccessKeyId=TMP.hgn5dhzSWarRbngXG5bcsViwkKjQJKYo88u9PN1VbzngRQu5TpA4sX18jchtgVKc38xLy1nGBbGyW1po5kPpjQk5yuQwB3toowqRfFiokQkX1gvmn2m3ipYUP4BinW.tmp&Signature=zToCPZ3Dnhsub2cWvhiulYvdG7k%3D)


