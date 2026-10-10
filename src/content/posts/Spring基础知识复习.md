---
title: "Spring基础知识复习"
pubDate: 2021-04-25 15:55:48
category: "java"
tags: ["Spring","基础知识"]
---

> 嘿，朋友，好久不见，我是阿呆。

今天来复习下spring的一些基础概念。

# 基本概念

- 控制反转：在spring中，Bean统一由spring自动管理，无需开发人员关心，称之为控制反转

- 依赖注入：是控制反转的一种体现方式，在编写复杂应用程序时，应保证程序类之间尽可能独立，从而使单元测试时互不影响，这些程序类之间通过依赖注入实现依赖关系

- 横切关注点：程序中跨越多个点的功能，这些功能点在概念上独立于业务逻辑，比如日志记录、声明性事务、缓存等等

- 面向切面：是一种思想，旨在将横切关注点从他们所影响的对象中抽离出来，spring借助面向切面可以实现诸如方法拦截器等功能

## 加载Bean的方式

- BeanFactory：最简单的容器，主要提供依赖注入，比较老，依旧存在是因为向后兼容

- FileSystemXmlApplicationContext：从指定完成路径的XML文件中加载bean

- ClassPathXmlApplicationContext：从项目的CLASSPATH中的XML文件加载bean

- WebXmlApplicationContext：加载一个web应用程序范围内的XML文件中的bean

## Bean的配置元数据

- class：指定bean对应的class引用路径

- name：bean的唯一标识

- scope：bean的作用域

- constructor-arg：bean得构造函数参数，引用类型用“ref”

- properties：bean的属性值

- autowiringmode：注入方式

- lazy-initializationmode：延迟加载，在使用该bean时才去实例化

- init-method：自定义初始化方法

- destroy-method：自定义销毁方法

## Bean的作用域

- singleton：单例，每次请求bean的实例时得到的都是同一个实例，默认值

- prototype：原型，每次请求时都创建一个新的bean

- request：每次HTTP请求都会创建一个新的bean，只针对WebApplicationContext

- session：同一个HTTPSession共享一个Bean，不同Session使用不同的Bean，仅适用于WebApplicationContext环境

- global session：一般用于Portlet应用环境，该运用域仅适用于WebApplicationContext环境

## IOC（Inversion of Control）控制反转

控制——谁？控制什么？

反转——反转什么？如何反转？    

> **所谓 IOC ，就是由 Spring IOC 容器来负责对象的生命周期和对象之间的关系**

传统Java应用程序：直接在对象内部通过new()的方式主动创建对象，造成强依赖，高耦合

IOC：对象交给容器来管理，由容器统一创建，客户端程序向容器请求对应的对象实例，实现解耦

所以：

控制——IOC容器控制对象及外部资源的获取

反转——反转对象的创建和管理权，从应用程序主动控制转为被动接受

## DI（Dependency Injection）依赖注入

依赖——谁和谁的依赖？

注入——谁？在哪？注入了什么？

> 由容器动态的将某个依赖关系注入到组件中

所以：

依赖——应用程序对某个（些）对象的依赖，或容器中对象之间的依赖

注入——IOC容器自动向应用程序中注入应用程序所依赖的对象

IOC和DI是对同一个概念的不同角度的描述
