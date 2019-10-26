# 语法笔记二：having与where

尽管看起来这两个自居都做相同的事情，但是他们以不同的方式来做。实际上，它们的功能是相辅相成的。

- WHERE自居用于过度来自结果的记录。过滤在进行任何分组之前发生。
- HAVING子句用于从数组中过滤值。

## Where子句

```
SELECT   COUNT(SalesOrderID)
FROM     Sales.SalesOrderDetail
```

