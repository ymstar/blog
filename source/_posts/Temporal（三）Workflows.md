---
title: Temporal（三）Workflows
date: 2022-05-11 14:00:22
cover: /img/Random-img/22.jpg
categories: 
- 工作流引擎
tags: 
- 工作流引擎
- Temporal
top: false
---

在Temporal文档中，对Workflow的描述分为了Workflow Type、Workflow Definition和Workflow Execution。我们先来了解一下这些概念的定义，才能理解它的使用。

先来看下这三个概念之间的关系：

![Workflow 概念](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/image-20220511141123798.png)

## Workflow Type

Workflow的类型，其实就是一个Workflow的name，因为Temporal是通过name来区分工作流的，所以工作流的name就代表了类型，同时同一Worker内不能有重名的Workflow。

既然是一种类型，就可以执行多次，那么每次执行，就会实例化为一个Workflow Execution。

同时这些Workflow的name，是Worker的队列之间隔离的，也就是说如果你有多个Worker，都有名叫Workflow-1的工作流，但是具体实现不同，那么在不同的Worker里会映射到不同的工作流定义，也就是Workflow Definition。

## Workflow Definition

工作流定义，这个很好理解，就是你描述具体Workflow执行的代码，也就是开发人员来定义的部分。

目前Temporal支持的SDK有Go、Java、PHP和TypeScript。

虽然是开发人员来定义的流程，但是Temporal对于工作流定义的代码还有一些限制：

1. ### 代码必须具备确定性

    这句话怎么理解？我们先来看一下不具备确定性的代码有哪些。

    比如我们在代码里存在分支判断，但是分支判断的条件，是不确定的，也就是随着你执行的次数或者时间到推移，每次调用这段代码可能得到的结果都不是确定的，那么就代表这段代码不具备确定性，这种代码写在Workflow里是不允许的。

    针对workflow而言，如果一个Workflow Execution已经发起之后，就不能再修改Workflow Definition的代码了。比如我们开启了一个定时的Workflow，但是在定时器到达之前，重新修改并提交了Workflow Definition的代码，那么到定时器触发的时候，工作流将执行失败。

    那么怎么避免这种不确定性呢？

    Temporal提供的方案是对Workflow进行版本化管理，版本化我们后面再说。还有就是Temporal API提供了一些对于非确定性的替代方案，比如提供了等待、随机数等方法。

2. ### 尽量的处理可能发生的异常

    开发人员不需要关心工作流在执行过程中由于Worker进程或者Temporal集群发生故障而导致的中断，因为这样的中断Temporal是可以恢复的。

    但是需要处理代码中可能出现的异常，因为这是唯一可能导致工作流失败的原因。

## Workflow Execution

工作流执行，表示一种工作流类型对应的一种工作流定义的一次执行流程。

每个Workflow Execution都有自己的本地状态，并且拥有本地状态的独占访问权。所有的Workflow Execution之间并行执行，并且通过Signals互相通信，也可以利用Activities和外部环境通信。

Workflow Execution的执行历史事件最大限制为50000个，数据存储最大限制为50MB。每产生10000个事件会产生一个警告，达到50000个事件或者数据达到50MB时，工作流将会被强制停止

虽然单次Workflow Execution对于大小和吞吐量是有一定限制的，但是Temporal允许数百万到数十亿个工作流通知执行。

Workflow Execution具有以下特点：

- ### 持久性

    一次Workflow Execution就是我们对Workflow Definition的执行，无论这个过程会持续几秒还是几年，这就是所谓的持久性。

- ### 可靠性

    可靠性代表在Workflow Execution执行过程中对故障的响应能力。Temporal对于由于技术设施中断导致的故障具有很好的恢复性，可以保持Workflow Execution在中断时的状态，以及从最新的状态恢复执行。

- ### 可扩展性

    可扩展性是指Temporal的负载能力。Temporal集群和Worker进程的设计和性质，让Temporal可以支撑数十亿个工作流同时执行。

- ### 支持异步调用

    其实Workflow Execution就是再重复向Temporal平台发送指令和等待指令返回的过程。

    ![Temporal原理](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/image-20220511160807978.png)

    在进行下面这些动作时，支持异步阻塞等待：

    1. 开启一个子工作流时，可以在子工作流开启后阻塞，知道子工作流执行结果返回；
    2. 发送Signal时，可以在发送Signal之后阻塞，等待Signal返回；
    3. 开始Activity执行时，可以在开启Activity后阻塞，直到Activity执行结果返回；
    4. 向一个Workflow Execution发送取消请求时，可以异步等待请求结果；
    5. 开启定时器时，可以阻塞流程，直到定时器触发；
    6. 通过调用await方法主动阻塞流程。

- ### 有状态的

    Workflow Execution的状态分为Open和Closed两种：

    ![Workflow Execution状态](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/image-20220511162242499.png)

    只有Running状态属于Open，无论是正在处理流程还是在阻塞等待，状态都体现为Running。

    Closed包含六种状态，表示工作流已经结束，六种状态分别为：

    1. Completed：Workflow Execution已经成功结束；
    2. Continued-As-New：定时Workflow到达定时周期时，开启新的Workflow，之前的Workflow会变成此状态；
    3. Terminated：Workflow Execution被终止；
    4. Cancelled：Workflow Execution被取消，意味着成功处理了一个取消请求；
    5. Failed：Workflow Execution发生异常并执行失败；
    6. Timed Out：Workflow Execution触发了超时限制；

上面说到一个Workflow Execution的执行时长是没有限制的，但是对于事件的个数和数据量是有限制的。所以还是尽量不要去屑无限期运行的工作流。如果真的有无限期执行的需求，可以使用Continue-As-New功能，结束本工作流，并启动一个具有相同WorkflowId并且RunId不同的Workflow Execution。

通过定期“Continue-As-New”可以合理解决单次执行的大小和吞吐量限制。

## Workflow Id

Workflow Id是Workflow Execution的流程标识符，是可以自定义的具有业务语义的一串字符串，例如客户id或者订单id等。

在一个namespace内，对于同一个Workflow Id，最多只有一个Workflow Execution处于Open状态，也就是Running。如果尝试开启一个与正在Running的Workflow 具有相同Id的Workflow，会提示“Workflow execution already started”。

一个Workflow Execution可以通过Namespace+Workflow Id+Run Id来唯一标识。

## Workflow Id 重用策略

通过配置Workflow Id Reuse Policy，可以指定开启新Workflow Execution时可不可以使用已有的Workflow Id。

但是需要注意，一个新的Workflow Execution永远不可能与处于Open状态Workflow Execution有相同的工作流 ID。

Workflow Id Reuse Policy有三个可选值：

- **Allow Duplicate** : 允许使用先前已经Closed的Workflow Execution的Id，无论Closed状态是什么。如果没有指定，这个是默认值。
- **Allow Duplicate Failed Only** : 只有当Workflow Execution的Closed状态不是Completed时，才允许重用Id。
- **Reject Duplicate** : 无论什么情况都不允许重用Id

注意：命名空间内的Workflow Execution是可以设置保留期限的。例如设置为30天，则只能看到近30天内的Workflow Execution。Workflow Id 重用策略也只会对有效期内的Workflow  Execution进行Id对比。

## Run Id

Run Id 是一个Workflow Execution的全局唯一标识。

## Child Workflow

子工作流是由另一个工作流产生的工作流。任何一个工作流（包括子工作流）都可以产生子工作流。

工作流在开启子工作流时，必须等待子工作流创建成功，但是可以选择同步或者异步等待子工作流执行结果。

子工作流上可以设置Parent Close Policy（父关闭策略），来指定当父工作流到达Closed状态时的动作。

如果子工作流使用了Continue-As-New，那么在父工作流眼中，视为一个Workflow Execution。

### 	什么时候使用Child Workflow？

- 突破工作流执行历史事件的限制

    例如，一个Workflow Execution是没有足够的空间来生成100000个Activity执行的，但是如果由一个工作流开启1000个子工作流，每个子工作流生成1000个Activity，就可以实现1000000个Activity的执行。

    但是另一方面，子工作流的部分事件，在父工作流里也是要维护的，所以理论上单个父工作流产生不超过1000个子工作流。

- 考虑将子工作流视为独立的服务

    子工作流也是一个普通的工作流，由Worker来负责调度执行，而不是父工作流管理，所以子工作流可以作为一个完全独立的服务。这也意味着父子之间不会共享任何的本地状态，和普通工作流一样，只能通过Signal进行通信。

- 用单个工作流来代表单个资源

    例如，管理主机升级的工作流，可以为每个主机生成一个子工作流。

### 	Parent Close Policy

这个配置只对子工作流生效。决定了当父工作流到达Closed状态时（Completed, Failed, or Timed out），子工作流会发生什么。有以下三个可选值：

- **Abandon** : 子工作流不会受到任何影响
- **Terminate** : 默认值，子工作流被强制关闭
- **Request Cancel** : 给子工作流发送一个取消请求

## Temporal 定时任务

Temporal作为一个工作流引擎，定时任务必不可少。

在开启Workflow Execution时，可以指定”cronSchedule“选项，设置一个Cron表达式，来配置Workflow的执行周期。开始workflow后，workflow会立刻创建并处于Running状态，但是不会立刻调度执行，而是有一定的delay，直到到达Cron表达式所指定的下一次时间。

只有在当前执行状态为Completed、Failed或Timed Out后，才会触发下一次运行。也就是说，如果设置了重试策略，并且运行失败或超时，则将首先根据重试策略进行重试，直到运行完成或重试策略已经用尽。如果到达根据 Cron 计划的下一次运行时间，但是由于当前运行仍处于Open状态（包括重试），则服务器将跳过下一次计划的运行。

### 	Cron

Temporal里的Cron表达式比较特殊，只有5位，分别为：

![Temporal Cron](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/image-20220512101811220.png)

而且需要特别注意，Temporal里的Cron表达式，默认是以UTC时区解析的，国内使用的话，要在你的目标时间上减去8小时之后，再生成Cron表达式。

启动一个定时Workflow之后，什么时候能停下来呢？

一种方式是直接使用API调用terminate命令，定时workflow会立刻终止，状态为Terminated。

另一种方式是等到workflow到达超时限制时间，会自动结束，状态为Timedout。

使用API发送Cancellation请求，只会影响当前的执行，不会取消整个定时。



## 最后

本文详细介绍了Temporal里Workflow的概念，下一篇文章，详解Activity！

我是阿呆，一个不务正业的程序员，我们明天见！