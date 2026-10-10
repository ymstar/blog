---
title: "Temporal (二) ——为什么要用Temporal？"
pubDate: 2022-03-19 19:40:53
category: "工作流引擎"
tags: ["工作流引擎","Temporal"]
---

大家好，我是阿呆，一个不务正业的程序员，不愿躺平的年轻人。

上一篇文章我们介绍了一下Temporal的一些基础概念和简单的架构设计。今天我们来说一说，为什么要用Temporal。

因为对复杂的分布式系统进行抽象，是Temporal很重要的一部分。我们先来想想为什么要用分布式。分布式系统是为了实现我们服务的扩展性，在系统负载发生变化时，随时扩展我们的服务能力。也就是说分布式系统实现了我们应用程序的高可靠、高性能和可扩展性。

但是使用分布式系统就要面临一个问题：下游应用程序随时可能会发生故障，尤其是在规模比较大的时候，发生故障是很常见的事情。

在传统的系统中，通常会投入大量的资源到组件之间的健康检查、健康状态的可视化、设计执行的超时约束、执行失败的重试以及保证状态一致性上。这种系统一般都是无状态服务、数据库、cron作业和任务队列的一个组合体。随着系统的扩展，如果想要响应异步事件、与外部资源进行通信或者监听一个复杂的事物状态时候，会给系统带来比较大的挑战。

那Temporal是怎么做的呢？Temporal直接把服务端、数据库、cron作业、任务队列、主机进程和SDK组合封装在了Temporal Platform里，这样就能直接解决故障。

我们来看一张对比图：

![Temporal与传统系统](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/temporal-vs-traditional-1665beb60df23b23c6112ec68ef2df00.svg)

乍一看上去是不是差不多？但其实有几个方面存在着重大的差异。

## 失败

对于传统系统，如果一个函数执行失败，就无法再恢复了，因为所有执行状态都丢失了。函数执行等待的时间越长，失败的可能性就越大。另外通常函数的执行具有有限的生命周期，通常以分钟为单位。

而对于Temporal，Workflow Execution在失败后是完全可以恢复的，同时Temporal对工作流的执行没有最后的期限，可以执行无限长时间。

## 状态

对于传统系统，一个函数执行失败或者停止，意味着所有的执行状态就丢失了。我们的应用程序必须监听服务的响应来重启服务并执行重试。这个重试是从初始状态开始的。

而Temporal失败恢复时是从最新的失败状态恢复的，也就是说可以保留所有的执行进度。

## 通信

使用传统系统，是无法与函数执行进行通信的。

使用Temporal的Signals和Queries，可以将数据发送到 Workflow Execution 或从中查询一些数据。

说了这么多，也不是很清楚？我么来看一个例子。订阅在我们生活中是非常常见的，例如我们订阅每个月的报纸，每个月续费的会员也是订阅，我们就以订阅为例，看一下传统系统和Temporal分别是怎么设计的。

先来梳理一下订阅的业务逻辑：

1. 客户注册一个具有使用期限的服务，即订阅成功
2. 使用期限结束后，如果客户没有取消，则每月收取一次费用
3. 客户可以通过电子邮件收到扣费的通知，也可以随时取消订阅

我们先来看第一种设计方案：**以数据库为中心的设计**

客户订阅的状态存在数据库，然后应用程序定期去扫描数据库表查找特定客户的订阅状态，然后执行操作例如扣费或者取消订阅，同时更新数据库状态。

这么做看山去没设么问题，但是会存在一些缺点：

- 客户的订阅状态很快会买你的复杂多样，例如由于下游服务故障或者不可用导致扣款失败或发送电子邮件失败，那这个时候客户的订阅状态是没办法确定的；
- 如果一次调用失败了，例如扣款失败，然后重试的过程可能会持续很长时间，同时这个重试的过程还不能占用过多的外部资源；
- 如果客户的订阅状态损坏了，需要额外的程序来处理
- 数据库具有性能和伸缩性瓶颈，同时对与这种需要不断轮询的场景，效率不是很高。

另一种常用的设计是**基于队列系统**，使用定时服务和队列，订阅状态变更时发送到队列，然后服务消费并更新数据库。定时服务可以安排队列的轮询或者数据库操作。

虽然这种方法显示出更好的扩展性，但编程模型可能变得非常复杂且容易出错，因为排队系统、定时服务和数据库之间通常没有事务更新。

我们最后来看看Temporal是怎么做的。

Temporal的核心思想是吧我们的业务逻辑封装成一个Workflow，我们来看一下：

```java
package io.temporal.sample.workflow;

import io.temporal.activity.ActivityOptions;
import io.temporal.sample.activities.SubscriptionActivities;
import io.temporal.sample.model.Customer;
import io.temporal.workflow.Workflow;
import java.time.Duration;

/** 定义一个Workflow的实现. 注意这就是一个POJO对象. */
public class SubscriptionWorkflowImpl implements SubscriptionWorkflow {

  private int billingPeriodNum;
  private boolean subscriptionCancelled;
  private Customer customer;

  /*
   * 定义Activity的一个配置项，不需要关心
   */
  private final ActivityOptions activityOptions =
      ActivityOptions.newBuilder().setStartToCloseTimeout(Duration.ofSeconds(5)).build();

  // 定义一个Activity，暂时也不需要关心
  private final SubscriptionActivities activities =
      Workflow.newActivityStub(SubscriptionActivities.class, activityOptions);

  @Override
  public void startSubscription(Customer customer) {
    // 设置工作流变量——订阅客户
    this.customer = customer;

    // 给客户发送欢迎邮件
    activities.sendWelcomeEmail(customer);

    // 开始试用期，用户也可以在这个过程中取消订阅
    Workflow.await(customer.getSubscription().getTrialPeriod(), () -> subscriptionCancelled);

    // 如果在试用期就取消了订阅，就发送一个取消订阅邮件
    if (subscriptionCancelled) {
      activities.sendCancellationEmailDuringTrialPeriod(customer);
      // 这个用户的订阅就结束了，直接结束掉Workflow
      return;
    }

    // 试用期已经结束, 开始收费直到订阅到期或者取消订阅
    while (billingPeriodNum < customer.getSubscription().getMaxBillingPeriods()) {

      // 向用户收取使用费
      activities.chargeCustomerForBillingPeriod(customer, billingPeriodNum);

      // 等待用户支付，或者取消订阅
      Workflow.await(customer.getSubscription().getBillingPeriod(), () -> subscriptionCancelled);

      // 如果取消订阅，发送邮件
      if (subscriptionCancelled) {
        activities.sendCancellationEmailDuringActiveSubscription(customer);

        // 订结束
        break;
      }

      // 订阅周期加1
      billingPeriodNum++;
    }

    // 整个订阅已经结束，通知用户购买新的订阅
    if (!subscriptionCancelled) {
      activities.sendSubscriptionOverEmail(customer);
    }
  }

  @Override
  public void cancelSubscription() {
    subscriptionCancelled = true;
  }

  @Override
  public void updateBillingPeriodChargeAmount(int billingPeriodChargeAmount) {
    customer.getSubscription().setBillingPeriodCharge(billingPeriodChargeAmount);
  }

  @Override
  public String queryCustomerId() {
    return customer.getId();
  }

  @Override
  public int queryBillingPeriodNumber() {
    return billingPeriodNum;
  }

  @Override
  public int queryBillingPeriodChargeAmount() {
    return customer.getSubscription().getBillingPeriodCharge();
  }
}
```

如果下游处理服务宕机或没有响应，**chargeCustomerForBillingPeriod**被阻塞一天或更长时间是完全可以的。同理，直接在 Workflow 代码内部休眠 30 天是完全正常的操作。这是非常有可能的，因为基础设施故障不会影响工作流状态——包括线程、阻塞调用和任何变量。

Temporal Platform实际上对开放工作流执行的数量没有可伸缩性限制，因此即使您的应用程序有数亿客户，也可以反复使用此代码。

也许你看这段代码还有是有一些不理解，里边的Workflow和Activity的概念又是什么。没关系，从下篇文章开始，我们就正式进入核心概念的介绍，到那个时候再回过头来看我想就能看懂了。

我是阿呆，我们明天见。