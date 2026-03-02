---
title: Temporal (一) ——强大的分布式工作流引擎
date: 2022-03-19 19:14:25
cover: /img/Random-img/37.jpg
categories: 
- 工作流引擎
tags: 
- 工作流引擎
- Temporal
---

提起任务管理框架，你会想到哪些？XXLJob？Quartz？Elastic-job？SchedulerX...

上述这些确实是曾经比较优秀的任务调度引擎，没错，曾经。因为一个非常优秀的任务调度引擎——Temporal，正在崛起。

那Temporal又是何方神圣？从来都没有听说过，怎么就一下就把市面上其他的引擎都干成了曾经？

## **0、Temporal是什么？**

我们先来看下Temporal官网上，一句简短的概括介绍：

> Temporal is the simple, scalable open source way to write and run reliable cloud applications.

翻译过来大概就是：

> **Temporal是一种简单而且可扩展的开源方案，用来编写和运行可靠的云应用程序。**

听起来有点绕，再来看下Temporal的GitHub主页上的一句话：

> *Temporal is a microservice orchestration platform which enables developers to build scalable applications without sacrificing productivity or reliability. Temporal server executes units of application logic, Workflows, in a resilient manner that automatically handles intermittent failures, and retries failed operations.*

这个就把比较通俗易懂了，来翻译一下：

> **Temporal是一个微服务编排平台，可以让开发者在不牺牲生产力和可靠性的情况下构建高可用的应用程序。Temporal服务端负责以弹性的方式执行应用程序的最小逻辑单元——Workflows，并且能自动处理间歇性故障和重试失败的操作。**

听起来是不是很厉害？你可能会注意到，Workflow是什么东西？别急，我们下面就会重点说它。

我们先来简单了解下Temporal的由来。

Temporal是Uber基于Cadence的一个分支项目，拥有Cadence的全部特性，于2020年2月发布了第一个release版本，到目前已经发布到1.15.2版本了，更新速度惊人的快。

至于Cadence，大家可以自行去查阅，不是我们的重点，只需要知道，有了Temporal，就不再需要Cadence就可以了。

对于Temporal，有一个[官方的视频](http://www.youtube.com/watch?v=f-18XztyN6c)，是在YouTube上的，有能力打开的读者可以自行看看，看不懂也没关系，我们这个系列的文章会带你深入了解这个东西。

**今天的这篇文章，我们先从架构的角度，看看Temporal的设计是什么样的。**

## **1、Temporal的架构设计**

这里先说一个很重要的概念，叫做Workflow Executions。在Temporal里叫做可重入流程运行时，它是可扩展并且可靠的。从名称上也可以看出，它是可重入的。说白了它就是指一次Workflow的执行。

我们来看一张图：

![Temporal基础架构](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/v2-cadf49b8f5e4f0556e69359a661cb831_1440w.jpg)

这张图上有几个概念：Workflows、Temporal Application、Workflow Executions和Temporal Platform。

其中Workflow Executions我们上面说过了，把它理解为Workflow的一次执行；Workflow我们上边也有提到，是Temporal执行的最小逻辑单元，这个是由我们自己来定义开发的。我们分别来看一下这些概念。

### 1.1 Temporal Application & Workflow Execution

Temporal Application从图上可以看出来，它其实是一个虚拟的概念，它代表着一组Workflow Execution。

每个Execution都拥有一个本地状态，并且对这个状态具有独占访问权，也就是其他Workflow是不能直接访问的。同时Workflow之间是并行去执行的，之间互不影响，如果Workflow之间需要通信的话，会通过消息传递的方式来进行。我们之后的文章里也会详细的介绍Workflow的通信方式。

一个Temporal Application可以包含数百万到数十亿个Workflow Execution。你可能会担心这么大的数量级，不会存在资源消耗或者不足的情况吗？实际上，Workflow Execution是非常轻量级的，消耗的资源非常小。例如，一个Workflow Execution如果被挂起（假设处于等待状态），其实这个时候WorkflowExecution根本不会消耗热河计算资源。

上面我们提到，Workflow Execution是可重入的过程。那可重入是啥意思呢？可重入是指一个过程是可恢复的、反应式的。那什么又是可恢复？什么又是反应式？

> 可恢复的：是指进程在因执行失败，或者因执行等待而暂停后，可以继续执行的能力。
>
> 反应式的：是指进程可以对外部事件作出反应的能力。

基于这些能力，就赋予了Workflow Execution一个很重要的能力，就是在执行一个Workflow的时候，这个Workflow只执行一次，直到完成。也就是无论你把这个Workflow设置成执行几秒还是几年，无论系统负载如何，无论发生任意故障，都不会影响Workflow的执行。挂掉会自动重启，失败会自动重试，就是这么牛*。

### 1.2、Temporal Platform

Temporal Platform是由Temporal集群和一系列Worker进程组成的，这些组件一起为Workflow Execution创建了一个运行时。

![Temporal Platform](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/v2-00c561142943224feda7e815bc03d919_1440w.jpg)

这张图里也有几个关键的概念，Workers、Temporal Cluster、Temporal Cloud。

Worker其实就是所有连接Temporal Server的客户端，就像我们连接Redis、kafka一样。当然我们的Workflow也是在Worker上去定义，这部分是由我们来操控的，并且执行我们具体的Workflow代码。

Worker和Temporal Cluster之间通过gRPC远程调用实现通信，这部分其实也是Temporal帮我们封装好了的，不必关心。

至于Temporal Cluster，也就是Server端，也是由我们开发者来操作部署的，也就是这部分能力是开源的。而Temporal Cloud，就是Temporal去维护的了。

## 2、SDK支持

Temporal目前支持四种SDK，其他的语言还在开发当中，支持的四种分别是GO、Java、PHP和TypeScript。

利用SDK可以开发我们的应用程序，然后交给Temporal Platform来保证持久性、可靠性和扩展性。

## 3、Temporal Client

Temporal Client也是一个比较重要的概念，每个SDK里都包含一个Temporal Client，它提供了一组与Temporal Cluster通信的API。

也就是说我们对Workflow Execution的基本操作都是通过Temporal Client来发起的。比如开启、查询、发送signal信号、等待结果、获取Workflow Execution列表等。

## 4、结语

我们今天的文章就先到这里，只是一些宏观上的概念，先对Temporal有一个大体的认识。

我们下一篇文章，来说一下Temporal和其他同类服务之间有什么区别，它有什么竞争力？为什么要使用Temporal等，敬请期待哦。





