# README - ref

## 简介 Summary

在JavaScript中，值传递和引用传递是容易混淆的（即使已经清楚这两者的区别，但随着代码量的增多依然可能发生书写错误，从而引发糟糕的结果）；而有的时候，你可能需要将一个基本类型值转为引用，从而使你在其他地方可以修改该值。而该库的ref类便是针对这两个问题做出的解决方案，它提供了一个统一的引用包装容器以及相关的API，使得你可以创建在任何类型变量上的引用从而在不同地方对其进行修改。

## 指南 Guide

ref是一个JavaScript引用容器类，您可以自由将需要作为引用的对象或基本类型值传入，从而创立一个引用变量。

为了避免概念的混淆，我们在此要先阐明在本文档中出现的一些词语的定义：

- 引用容器：指通过`new ref(val)` 获取的ref类实例。它将把传入的`val`包裹在对应的引用对象中。

- 引用：在获取ref类实例（如`let reffer = new ref('target')`）后，访问`reffer.ref`获取的引用（如`let target_ref = reffer.ref`）。`.ref`获取的引用实际是一个形如`{ins:val}`的对象，该对象包裹传入了`val`。 

- 实际引用对象：在获取引用后，调用引用的`.ins`（继续上例，即为`target_ref.ins`）属性而获取的实际引用对象。

  >  需要注意的是，**您不应通过将实际引用对象赋值给另外一个对象**，而是应该在获取上边的引用后通过`ref.ins = ....`修改引用值，否则针对包裹的基本类型值，您的修改不会生效；并且我们不建议您通过将实际引用对象赋予其他变量后对实际引用对象进行修改，否则这样又会走上混淆的老路。引用前例来讲，您应该通过形如`target_ref.ins = 'target_change'`的形式去更改原本的指向值。
  >
  > 我们会在下一节阐述推荐的做法。

例如现在，我们有个字符串变量，它对应某人的Github链接：

```javascript
import { ref } from "./ref.js";

let url = 'https://github.com/WendaoLee'
```

我们想要令它成为一个引用，那么便可以使用`ref`将它包裹在引用容器中：

```javascript
let reffer_container = new ref(url)
```

如果您希望 **它在程序运行的全周期里都不会销毁（这是主要目的）** 或是 **避免引用容器这一变量因为在代码段内失去指向而被自动GC**，您可以调用`bind(name)`方法：

```javascript
reffer_container.bind('该引用容器的命名')
```

之后如果想在其他地方访问，只需调用ref类的静态方法`ref.getRef(name)`：

```javascript
let container_in_other_place = ref.getRef('该引用容器的命名')
```

> 请尽量**避免滥用**该方法以免造成内存溢出。

而后来，我们希望更改这个url链接，那么应该先获取它的引用，而后在引用上访问`.ins`修改值：

```javascript
let reffer = reffer_container.ref
reffer.ins = 'https://github.com/WendaoLee/WendaoLee'

//当然，您也可以直接进行修改,只是我们推荐您统一代码风格为上者，减少 . 操作符有助于提升代码的可读性
reffer_container.ref.ins = 'https://github.com/WendaoLee/WendaoLee'
```

对于取值，我们提供了一个纯净的`.val`属性，它同时为<u>引用</u>和<u>引用容器</u>所具备，访问它将会返回实际引用对象的纯净值，它的意思是您对获取的值做出的任何更改都**不会影响**到**实际引用对象**本身，**这也是我们推荐的取值方法**。

```javascript
let url_value_from_ref = reffer.val
let url_value_from_container = reffer.val 
```

对于对象，也是同样的操作。我们推荐您统一使用`ref`类创造引用，因为这能使代码中的API统一，避免不必要的混淆：

```javascript
let url_ob = {
    url:'https://github.com/WendaoLee'
}
let url_ob_container = new ref(url_ob)
let url_ob_reffer = url_ob_container.ref
url_ob_reffer.ins.url = 'https://github.com/WendaoLee/WendaoLee'
```

