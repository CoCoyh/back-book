# 基于NodeWeb框架Chair

![转载](https://yq.aliyun.com/articles/2921)

Chair是支付宝前端团队推出的，基于Node.js的web框架，适用于大部分的Web应用。
本文简要介绍Chair的设计思想、功能架构和开发状况。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-23-f4cbc1e289897a6f96dec2616425fce112235f34.png?Expires=1571828802&OSSAccessKeyId=TMP.hd5mTG7KBTQPqFWaE9it19o5XfvR5WRatCHqVnC2tSYKHXTSm9vjsMrjhwnLysCrZnq9FQzHqbpG5dk77og6pcrTi5xhDTZfv5sTqcVVrgxiDzCd57dPvWTayZyXhQ.tmp&Signature=sK1zrvNPn6Txb%2FzGjvOZ6nkze7Y%3D)

## 一、Chair的由来和设计思想
历史上，支付宝前端项目都是直接基于Java后端开发的。这种架构下，前端工程师做出网页模板（基于velocity模板引擎的vm文件），交给后端的Java引擎渲染。支付宝采用的Java引擎是名为Sofa的MVC框架。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-23-15143350_6Iga.jpg?Expires=1571828853&OSSAccessKeyId=TMP.hd5mTG7KBTQPqFWaE9it19o5XfvR5WRatCHqVnC2tSYKHXTSm9vjsMrjhwnLysCrZnq9FQzHqbpG5dk77og6pcrTi5xhDTZfv5sTqcVVrgxiDzCd57dPvWTayZyXhQ.tmp&Signature=I3c7dSOcqnw9v%2B2U6XlqAzI8AKU%3D)


对于前端工程师来说，这种架构有很多不方便的地方。首先，需要了解后端的实现，并且依赖开发环境中的dev服务器进行调试开发；其次，开发细节需要与后端的Java工程师沟通，交流成本相当大；最后，难以发起技术创新，因为只要涉及后端的调整，推动起来非常困难。在前端技术日新月异的今天，这已经越来越成为前端工程师心中的痛。

Chair框架就是在这种背景下诞生的，我们希望通过加入一个Node层，加速前端开发，提升研发效率，提高网站整体性能和系统的可维护性。

作为Sofa的替代，Chair直接与底层的Java服务通信，而客户端浏览器则与Chair通信，这样就不使用Sofa了。前端工程师因此可以完全不碰Java，使用熟悉的JavaScript语言，同时在浏览器和服务器两端进行快速迭代。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-23-15143350_f8Ft.jpg?Expires=1571828956&OSSAccessKeyId=TMP.hd5mTG7KBTQPqFWaE9it19o5XfvR5WRatCHqVnC2tSYKHXTSm9vjsMrjhwnLysCrZnq9FQzHqbpG5dk77og6pcrTi5xhDTZfv5sTqcVVrgxiDzCd57dPvWTayZyXhQ.tmp&Signature=INW5JKLPV%2Fhkht%2FV8PCgk7wD4H0%3D)


事实上，Chair这个名字就是来自跟Sofa的对比，因为两者都能坐人，但是椅子（Chair）比沙发（Sofa）轻多了。支付宝已经有了沙发，我们想再为它添一把椅子。

Chair为前端开发，带来了很多便利。

- 提高了研发效率，前端工程师直接可以改动服务器，避免了与Java后端不必要的沟通成本。
- 更清晰的职责划分，前端针对表现层（View）开发，后端针对业务和数据（Controller和Model）开发。
- 更好的⼯程化，前端自己就能完成单元测试、集成测试和自动发布。
- 节省人工，同样的组件（比如模板和路由）只需要写一次，不用再为浏览器和服务器各写一遍了。
- 预期的性能提升，Node作为服务器端时，有很强的HTTP请求处理能力。
目前，Chair已经投入了生产环境，与Sofa各自支持着不同的支付宝Web应用。预计不远的将来，会出现更多基于Chair的Web应用。


## 二、Chair的结构
Chair的基础代码，是基于Koa框架的再开发，使用的语言是下一代JavaScript——ECMAScript 6，模板引擎是Nunjucks，但也可选用其他引擎。同时兼容Velocity模板，现有绝⼤部分模板⽂件⽆需修改也能正常渲染。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-23-15143350_4irn.jpg?Expires=1571828840&OSSAccessKeyId=TMP.hd5mTG7KBTQPqFWaE9it19o5XfvR5WRatCHqVnC2tSYKHXTSm9vjsMrjhwnLysCrZnq9FQzHqbpG5dk77og6pcrTi5xhDTZfv5sTqcVVrgxiDzCd57dPvWTayZyXhQ.tmp&Signature=lhov9FNIbo6l%2FOawObSGCeNpm04%3D)

整个框架从浏览器到服务器，一共分成五层：

- 路由层（routers）：适配不同路径的HTTP请求
- 中间件层（middlewares）：加工HTTP请求
- 控制器层（controllers）：部署业务逻辑
- 服务层（services）：提供内部的统一API，供不同业务调用
- 代理层（proxy）：负责与Java服务通信，提供统一格式的数据
除了模板引擎以外，Chair还部署了一些功能组件，比如mock（数据模拟）和logger（日志器）。

Chair根据业务实际需求和现有架构高度定制。虽然从结构上看，Chair可以提供完整的后端功能，但目前主要用于模板渲染和路由。真正的业务逻辑和数据处理，还是要交给后端的Java服务。

## 三、性能提升
Node的加入，为很多功能提供了很大的性能改进。根据压测的结果，使用Chair（下图的web）比使用原来的方案（下图的portal），响应时间和系统负载能力至少提高一倍以上。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-23-50b0e33f4c9d1d8e04d5699db1e20c6967a65f19.png?Expires=1571829002&OSSAccessKeyId=TMP.hd5mTG7KBTQPqFWaE9it19o5XfvR5WRatCHqVnC2tSYKHXTSm9vjsMrjhwnLysCrZnq9FQzHqbpG5dk77og6pcrTi5xhDTZfv5sTqcVVrgxiDzCd57dPvWTayZyXhQ.tmp&Signature=YYVES%2FhGmNN%2FxqCrSLrWnfJgoPY%3D)

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-23-775fa1ffb50d7c87c711fa843def8db066dd7cce.png?Expires=1571829014&OSSAccessKeyId=TMP.hd5mTG7KBTQPqFWaE9it19o5XfvR5WRatCHqVnC2tSYKHXTSm9vjsMrjhwnLysCrZnq9FQzHqbpG5dk77og6pcrTi5xhDTZfv5sTqcVVrgxiDzCd57dPvWTayZyXhQ.tmp&Signature=IcF2R1RVUWkE%2Br6oLXzNn%2BptTGw%3D)
