---
title: "Spring的最新大瓜你吃到了吗"
pubDate: 2022-03-30 11:10:32
category: "Java"
tags: ["java","spring"]
---

大家好，我是阿呆，一个不务正业的程序员。

昨晚的Spring大瓜，你们吃到了吗？如果你还不知道，那么赶紧往下看！

大早上在地铁上，像往常一样刷着手机，看看订阅号，看看知乎，看看微博。突然就看到了一个让我精神抖擞的消息：Spring出了一个比上次Log4j更大的漏洞！

什么？不是说 log4j 的漏洞就是见证历史了吗？难道历史这么快就要翻篇了吗？这是搁这叠 buff 呢？

赶紧来看看这是个什么漏洞：

![漏洞描述](https://mmbiz.qpic.cn/mmbiz_jpg/ELQw2WCMgt3aJ2pquEjTIcpzH7qibR3JxBw8wYvmQG4GWMAyHDg2vVcagVq9gKSE165fA2mrpUf82mw4bSEmxIA/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)

好家伙，有惊无险啊，原来是 jdk9 及以上的版本才有影响啊。那我就放心了。毕竟我现在用的还是jdk8，可以安心搬砖了。

但是毕竟作为一个技术人员，必须要搞清楚它到底是怎么回事。

所以到公司赶紧奔赴吃瓜一线：Spring的GitHub issue页面

![Spring的GitHub issue页面](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/image-20220330124758519.png)

通过过滤，我们可以看到几个疑似漏洞的两个issue，也就是前两个，我们分别来看一下：

![RCE 0 Day](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/image-20220330152624046.png)

可以说是什么也没有，只说了影响全版本的注入漏洞，随后就被官方结束掉了，并留下了一句话：

> 如果你想报告一个安全问题，那么请通过这个专用的页面进行报告，抱拳了。

确实没什么有用的信息，我们再来看看另外一个：

![issue #28075](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/image-20220330154530659.png)

可以看到这个PR其实是在2022年2月19号就提出的，大体意思就是SerializationUtils 这个序列化的工具类有点问题，会留下一些口子，建议弃用这个方法。

有趣的是，这个PR里就提到了RCE。从提出开始，官方对这个PR一直有关注，知道昨天被官方合并。同时还对这个工具类的文档进行了一波更新：

![文档更新](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/image-20220330155501221.png)

我们直接来看更新好的文档吧：

![反序列化方法docs](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/image-20220330155618515.png)

大概意思就是说：

> 这个工具将在 Spring Framework 6.0 中被弃用，因为它使用了 Java 对象序列化，允许任意代码的运行，并以成为许多远程代码执行（RCE）漏洞的来源而闻名。倾向于使用外部工具（可序列化为JSON、XML或任何其他格式），该工具会定期检查和更新来避免 RCE。

从文档上的更新来说，即使是这个东西导致 Spring 出现了 RCE  0day 漏洞，但是目前也并没有修复，只是堵住了未来版本的口子。

当然，至于这个 PR 和 Spring RCE 0day 之间关系到底如何，还得等更详细的信息出来之后再，上述只是我个人的判断。

既然没吃到什么瓜，我们就来看看一些关于这个事情的段子吧。

![段子一](https://mmbiz.qpic.cn/mmbiz_png/ELQw2WCMgt3aJ2pquEjTIcpzH7qibR3JxL54J1aAFWm1gibKOWHsIAcD5LBZabWC2BIRziaoQRM6QJbcx5mf9V18Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

![段子二](https://mmbiz.qpic.cn/mmbiz_png/ELQw2WCMgt3aJ2pquEjTIcpzH7qibR3JxPJ0mJJNG5K0dHpOfgiaoDiaTvQibLcNlibkuiauuehuyyR9Wb7WtUCIeZyA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

![段子三](https://wx4.sinaimg.cn/mw1024/eab03d57gy1h0rmguk4idj20n00b574w.jpg)

好了，今天的瓜就吃到这里，关注我的公众号【Coder阿呆】，阅读更多有趣内容！

我是阿呆，一个不务正业的程序员~