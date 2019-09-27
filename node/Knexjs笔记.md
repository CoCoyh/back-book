# Knexjs笔记

knex方法分类：

操作table的方法，属于Schema Builder，对应create、drop、alter等
操作column的方法，属于Schema Builder，如设置键的类型，设置主键，外键等
执行SQL请求的方法，属于Query Builder，对应select、insert、update、delete等

其他方法

knex安装

```
#以Mysql为例
sudo npm install knex --save
sudo npm install mysql --save
```

knex初始化

```
const knex = require('knex')({
  client: 'mysql', //指明数据库类型，还可以是mysql，sqlite3等等
  connection: { //指明连接参数
    host : '127.0.0.1',
    user : 'liuyueyi',
    password : 'password',
    database : 'example'
  },
  debug: true, //指明是否开启debug模式，默认为true表示开启
  pool: { //指明数据库连接池的大小，默认为{min: 2, max: 10}
    min: 0,
    max: 7,
  },
  acquireConnectionTimeout: 10000, //指明连接计时器大小，默认为60000ms
  migrations: {
    tableName: 'migrations' //数据库迁移，可选
  }
});
```


