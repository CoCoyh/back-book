[转载](https://zhuanlan.zhihu.com/p/29204311)


开始之前确保本机nodejs已经安装，检查
```
node -v
```
有输出版本号，说明已安装
首先在[npm](https://www.npmjs.com/)网站上注册一个账号，这个账号会在之后用到

# pixiv-login

pixiv-login的功能就是模拟用户登陆网站pixiv，获取cookie，安装
[源码](https://github.com/CoCoyh/npm-test)

```
npm install --save pixiv-login
```

使用：
```
const pixivLogin = require('pixiv-login');

pixivLogin({
    username: '你的用户名',
    password: '你的密码'
}).then((cookie) => {
    console.log(cookie);
}).catch((error) => {
    console.log(error);
});
```

# 开发工具
Mac平台 使用的vscode

# 初始化项目

```
mkdir npm-test
cd npm-test
npm init
```
一路回车就好

# 安装依赖

要模拟登陆，我们就需要一个http库，这里我选择了[axios](https://github.com/axios/axios)，同时获取的html字符串我们需要解析，[cheerio](https://github.com/cheeriojs/cheerio)就是首选了

```
npm i axios cheerio --save
```
现在便携index.js文件

```
const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://www.pixiv.net')
    .then(function(response) {
        const $ = cheerio.load(response.data);
        const title = $('title').text();
        debugger;
        console.log(title);
    })
    .catch(function(error) {
        console.log(error);
    });
```

# 正式开始

虽然我们最后是要写一个npm包，但是首先，我们先把获取cookie的功能实现了，然后再思考怎么封装一个npm包，供其他人使用。

进入[登陆页面](https://www.pixiv.net/)，我们先登陆一次，看看前端向后端发送了那些数据。

![loginhtml.png](https://upload-images.jianshu.io/upload_images/9403248-d41e1e7fccfbd68e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这里需要注意的是，我们要勾选**preserve log**，这样，即使页面刷新跳转了，http请求记录仍然回记录下来

![prelogin.png](https://upload-images.jianshu.io/upload_images/9403248-2feb873b7b5844c4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![prelogin1.png](https://upload-images.jianshu.io/upload_images/9403248-78da3f9e3d2862e2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![prelogin2.png](https://upload-images.jianshu.io/upload_images/9403248-9d1c85a3fcb3b499.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

可以看到，**post_key**是登陆的关键点，p站使用了该值来防止CSRF

post_key怎么获取呢？

经过页面分析，发现登陆页面，有个隐藏的表单域（后来发现，其实首页就已经写出来了）


![login.jpg](https://upload-images.jianshu.io/upload_images/9403248-2cd2255b67f3f6c8.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


可以清除看到，post_key已经写出来了，我们只需要用cheerio解析出该input的值就OK了

```
const post_key = $('input[name="post_key"]').val();
```
获取post_key

```
const axios = require('axios');
const cheerio = require('cheerio');

const LOGIN_URL = 'https://accounts.pixiv.net/login?lang=zh&source=pc&view_type=page&ref=wwwtop_accounts_index';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36';
const LOGIN_API = 'https://accounts.pixiv.net/api/login?lang=zh';


const getKey = axios({
    method: 'get',
    url: LOGIN_URL,
    headers: {
        'User-Agent': USER_AGENT
    }
}).then((response) => {
    const $ = cheerio.load(response.data);
    const post_key = $('input[name="post_key"]').val();
    const cookie = response.headers['set-cookie'].join('; ');
    if (post_key && cookie) {
        return { post_key, cookie };
    }
    return Promise.reject("no post_key");
}).catch((error) => {
    console.log(error);
});


getKey.then(({ post_key, cookie }) => {
    debugger;
})
```

注意：打开注册页时，注册页会返回一些cookie，这些cookie在登陆时也是需要随密码，用户名一起发送过去的

获取到了post_key，cookie，我们就可以愉快的把登陆数据发送给后台接口了

```
const querystring = require('querystring');
getKey.then(({ post_key, cookie }) => {
    axios({
        method: 'post',
        url: LOGIN_API,
        headers: {
            'User-Agent': USER_AGENT,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'https://accounts.pixiv.net',
            'Referer': 'https://accounts.pixiv.net/login?lang=zh&source=pc&view_type=page&ref=wwwtop_accounts_index',
            'X-Requested-With': 'XMLHttpRequest',
            'Cookie': cookie
        },
        data: querystring.stringify({
            pixiv_id: '你的用户名',
            password: '你的密码',
            captcha: '',
            g_recaptcha_response: '',
            post_key: post_key,
            source: 'pc',
            ref: 'wwwtop_accounts_index',
            return_to: 'http://www.pixiv.net/'
        })
    }).then((response) => {
        if (response.headers['set-cookie']) {
            const cookie = response.headers['set-cookie'].join(' ;');
            debugger;
        } else {
            return Promise.reject(new Error("no cookie"))
        }

    }).catch((error) => {
        console.log(error);
    });
});
```

注意其中这段代码：
```
data: querystring.stringify({
      pixiv_id: '你的用户名',
      password: '你的密码',
      captcha: '',
      g_recaptcha_response: '',
      post_key: post_key,
      source: 'pc',
      ref: 'wwwtop_accounts_index',
      return_to: 'http://www.pixiv.net/'
  })
```
⚠️注意：axios默认数据格式是json，如果你想发送**application/x-www-form-urlencoded**的数据，就需要使用**querystring模块**

如果一切正常，那么效果如下：

![loginres.png](https://upload-images.jianshu.io/upload_images/9403248-1b7a400337d57c56.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

其中，的PHPESSID和device_token就是服务器端返回的登陆标识，说明我们登陆成功了
程序运行的同时，你也很可能收到P站的登陆邮件
好了，目前为止，我们已经成功获取到了cookie，实现了最基本的功能

# 特别注意⚠️

程序不要运行太多次，因为每次运行，你就登陆一次P站，如果被P栈监测到频繁登陆，它会开启验证码登陆模式，这时，你除了需要发送用户名和密码，还需要向后台发送验证码值
```
data: querystring.stringify({
          pixiv_id: '你的用户名',
          password: '你的密码',
          captcha: '你还需要填验证码',
          g_recaptcha_response: '',
          post_key: post_key,
          source: 'pc',
          ref: 'wwwtop_accounts_index',
          return_to: 'http://www.pixiv.net/'
      })
```
也就是，**captcha**字段不再是空值了！

基本功能的完整代码

```
const axios = require('axios');
const cheerio = require('cheerio');
const querystring = require('querystring');

const LOGIN_URL = 'https://accounts.pixiv.net/login?lang=zh&source=pc&view_type=page&ref=wwwtop_accounts_index';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36';
const LOGIN_API = 'https://accounts.pixiv.net/api/login?lang=zh';


const getKey = axios({
    method: 'get',
    url: LOGIN_URL,
    headers: {
        'User-Agent': USER_AGENT
    }
}).then((response) => {
    const $ = cheerio.load(response.data);
    const post_key = $('input[name="post_key"]').val();
    const cookie = response.headers['set-cookie'].join('; ');

    if (post_key && cookie) {
        return { post_key, cookie };
    }
    return Promise.reject("no post_key");
}).catch((error) => {
    console.log(error);
});


getKey.then(({ post_key, cookie }) => {
    axios({
        method: 'post',
        url: LOGIN_API,
        headers: {
            'User-Agent': USER_AGENT,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'https://accounts.pixiv.net',
            'Referer': 'https://accounts.pixiv.net/login?lang=zh&source=pc&view_type=page&ref=wwwtop_accounts_index',
            'X-Requested-With': 'XMLHttpRequest',
            'Cookie': cookie
        },
        data: querystring.stringify({
            pixiv_id: '你的用户名',
            password: '你的密码',
            captcha: '',
            g_recaptcha_response: '',
            post_key: post_key,
            source: 'pc',
            ref: 'wwwtop_accounts_index',
            return_to: 'http://www.pixiv.net/'
        })
    }).then((response) => {
        if (response.headers['set-cookie']) {
            const cookie = response.headers['set-cookie'].join(' ;');
            console.log(cookie);
        } else {
            return Promise.reject(new Error("no cookie"));
        }

    }).catch((error) => {
        console.log(error);
    });
});
```

封装成一个npm包

登陆P站获取cookie这个功能，如果我们想让其他开发者也能方便调用，就可以考虑其封装为一个npm包发布出去

目录结构：
![workspace  .png](https://upload-images.jianshu.io/upload_images/9403248-0f209f40efd7124f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 发布npm包

## README.md
每个npm包，一般都需要配一段介绍文字，来告诉使用者如何安装使用，比如lodash的首页
新建一个README.md，填写相关信息
![npm -readme](https://upload-images.jianshu.io/upload_images/9403248-25766f0fdac5b968.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

有时，我们会看到一些npm包有很漂亮的版本号图标：

![npml-label.png](https://upload-images.jianshu.io/upload_images/9403248-9fa974ce1b72ea55.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这些图标[shieds](https://shields.io/)上制作
登陆该网站，下拉到最下面
![label1.jpg](https://upload-images.jianshu.io/upload_images/9403248-c36b32075c68118f.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入你想要的文字，版本号，颜色，然后点击按钮

![label2.jpg](https://upload-images.jianshu.io/upload_images/9403248-25a5261f82d06fd1.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

就可以得到图片的访问地址了

![label3.png](https://upload-images.jianshu.io/upload_images/9403248-3a9938efd6838f1b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

修改刚才的README.md，加上我们的版本号

## .gitignore

node_modules以及.vscode是完全不用上传的，所以为了防止发布时带上这些文件夹，我们要新建一个.gitignore

```
.vscode/
node_modules/
```

# 包发布
在终端输入
```
npm adduser
```

输入用户名，密码，邮箱即可登陆成功
**这里还有一个坑！**

如果你的npm使用的是淘宝镜像，那么是无法登陆成功的

最简单的解决方法：
```
npm i nrm -g
nrm use npm
```
nrm是个npm镜像管理工具，可以很方便的切换镜像源

登陆成功后，输入
```
npm whoami
```
如果出现了你的用户名，说明你已经成功登陆了

特别注意：

因为包名字唯一，否则发布不了

修改pacakge.json文件的name字段

npm publish
即可发布成功啦！
