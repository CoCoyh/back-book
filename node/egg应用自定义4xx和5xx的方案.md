[转载](https://github.com/eggjs/egg/issues/1086)

现在的错误处理插件是[egg-onerror](https://github.com/eggjs/egg-onerror)，但这个插件主要是优雅处理为捕获异常，也就是为了让应用不挂进行兜底，但是现在没有一种同意的业务员错误处理方案。

# 问题

## 业务校验

比如参数校验、业务演这个等等，这些并不术语异常，一般会在响应时专程对应的数据格式。常见的处理方式是接口返回错误，并在response转换

```
class User extends Controller {
  async show() {
    const error = this.check(this.params.id);
    if (error) {
      this.ctx.status = 422;
      this.ctx.body {
        message: error.message,
      };
      return;
    }

    // 继续处理
  }

  check(id) {
    if (!id) return { message: 'id is required' };
  }
}
```

但是业务场景是非常复杂的，可能在controller里面调用多层service，这样就必须把错误结果一层层传递。所以这种场景业务校验推荐使用异常的方式，类似上面的场景只需要抛出一个异常
```
class User extends Controller {
  async show() {
    this.check(this.params.id);

    // 继续处理
  }

  check(id) {
    if (!id) throw new Error('id is required');
  }
}
```

然后再中间件处理这个异常

# 异常类型区分

上面的示例也同样抛出Error，如果不写中间件处理同样回走到[oneror](https://github.com/eggjs/egg-onerror)插件，根据惠泽会打印错误日志并返回500.

这不是我们期望的，开发者希望但会正确的格式，比如status是422，body是一个含错误信息的json。所以我们需要明确已知异常和为捕获异常，并对他们做差异处理

# 标准化响应

如果在写一个api server的时候，希望响应格式是规范的，而开发者一般都比较关注正常结果，异常时会返回格式，所以对于一个API Server来说这也是非常重要的。




