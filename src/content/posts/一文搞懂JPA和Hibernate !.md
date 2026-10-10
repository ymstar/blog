---
title: "一文搞懂JPA和Hibernate !"
pubDate: 2022-06-30 22:24:55
category: "Java"
tags: ["JPA","Hibernate","ORM框架"]
featured: true
---

看到标题，可能有人会问，这都2022年了，怎么还有人在用（学）Hibernate？

问的没毛病，确实目前Hibernate在国内用的比较少了，几乎都已经是Mybatis的天下了，但总是会有那么一小部分人或者团队选择使用Hibernate（比如我们~）。再者，技多不压身，多学一门技术总没坏处。

但是有没有发现一个问题，就是由于这东西过于古老，现在碰到一个问题，网上几乎都是12年左右甚至零几年的答案，用过来用过去，只是让程序跑起来了，但是为什么跑起来了，怎么工作的，还是一头雾水？

本人在使用（踩坑）的过程中也一直在想，为什么不能有那么一篇文章，把Hibernate这玩意彻底讲明白，一看就会的那种！

别着急，这不！它就来了！

好了废话不多说，我们直奔主题！

## 一、什么是Hibernate？

回答这个问题之前，先来回顾一下，我们如果想要操作数据库的话，都有哪些方式？

最直接也是最常见的就是直接写SQL了对吧，那还有没有其他的方式呢？

数据库是由一张张表组合起来的，表又是由一个个字段构成，字段有不同的类型，这是不是很像面向对象里的对象概念。

如果能把数据库表字段，一对一映射到对象属性上，那这张表也就被映射成了一个对象，操作数据库的方式就可以转换为操作这个对象！

没错，Hibernate就是这样一种实现。

> Hibernate是一个访问数据库的持久层框架，通过建立实体类和数据库表之间的关系，来实现面向对象的数据库操作，而非面向SQL。

这种将应用程序的对象模型映射到数据库表的技术实现，也称为**ORM框架**。Hibernate不仅可以实现Java类到数据库表的映射，还可以实现Java数据类型到SQL数据类型的映射。

怎么理解呢，就是你Java类里定义一个String类型的属性，可以通过注解的方式，映射到数据库层的varchar，并且指定长度，另外，对复杂的数据对象和集合属性，Hibernate也能提供很好的映射支持。

后面我们通过代码演示加深理解。

其实Hibernate的这一系列能力，并不完全是它自己的，它是基于一个叫做JPA的规范而实现的。

那么问题来了，JPA又是啥？

## 二、什么是JPA？

JPA全称叫做Java Persistence API，也就是一套java持久层API，它是Sun公司提出的一个Java持久化规范，主要是为了规范和简化Java对象的持久化工作。

Hibernate其实只是众多实现了JPA规范的框架之一。

那么JPA到底定了哪些规范呢？ORM框架为什么要遵守这个规范，它有什么过人之处？

首先，对象和表之间的映射关系是需要通过一系列元数据来描述的，比如字段类型的映射，表名的映射等等，JPA就为这个描述提供了两种方式，分别是XML和注解。

其次，完成对象和表的映射后，我们需要进行CRUD，所以JPA也提供了对应的API来实现这些操作，从而告别繁琐的SQL。

最后也是最牛逼的一点，定义了一种面向对象查询的语言——JPQL，彻底告别SQL ！



所以到这里，我们应该清楚了，JPA是规范，Hibernate是实现此规范的一个框架。

那到这里基本就可以开始上手也代码了。

但是实际上，我们现在使用Hibernate都不会直接使用，什么意思呢？

用Java肯定离不开Spring，那么Spring有没有提供这方面的支持呢？

别说，还真有！

那就是Spring Data JPA！这又是个神马东西？！

## 三、Spring Data JPA是啥？

首先Spring Data是Spring社区的一个子项目，主要负责数据库访问相关的API。

Spring Date JPA就是在实现了JPA规范的基础上，对JPA框架的又一层封装。主要是想统一ORM框架的持久层访问操作。

实现JPA规范的ORM框架有很多，如果需要在不同的ORM框架间切换的话（虽然不太可能发生），还是需要编写不同的代码，而使用Spring Data JPA就可以避免这个情况。

Spring Data JPA给我们提供了持久层访问的基础类（接口），后续的代码中我们主要使用这些类（其实在实际开发中也主要是这些类）。

那么Spring Data JPA和HIbernate以及JPA的关系又是什么呢？

我们来总结一下：

JPA是一个**规范**！

Hibernate是一个实现了JPA规范的**框架**！

Spring Data JPA也实现了JPA规范，但它不是框架，而是对ORM框架的一层抽象和封装，其实底层用的就是Hibernate！



好了，到这里我们已经理解了三个最容易搞混的概念！那么赶紧来上手试试！

## 四、准备工作

开始之前我们先创建一个springboot项目（都2022年了，大家都用boot），并添加一些必要的依赖：

```yaml
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.0</version>
    </parent>

    <dependencies>
        <!--lombok支持-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!--Spring Data JPA 的springboot版-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!--数据库连接支持-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-starter</artifactId>
            <version>1.1.22</version>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <!--swagger-->
        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger2</artifactId>
            <version>2.9.2</version>
        </dependency>
        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger-ui</artifactId>
            <version>2.9.2</version>
        </dependency>
        <dependency>
            <groupId>io.swagger</groupId>
            <artifactId>swagger-annotations</artifactId>
            <version>1.5.20</version>
        </dependency>
    </dependencies>
```

因为涉及到数据库表的操作，需要配置一个数据源，以及jpa相关的配置（application.yaml）：（数据库地址和账户自行更换）

jpa相关的配置我们后面会解释，先跑起来再说！

```
spring:
  application:
    name: hibernateExample
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://url:3306/database?useUnicode=true&characterEncoding=utf-8&nullCatalogMeansCurrent=true&serverTimezone=Asia/Shanghai&enabledTLSProtocols=TLSv1.2
    username: username
    password: password
  jpa:
    generate-ddl: true
    hibernate:
      ddl-auto: update
      naming:
        implicit-strategy: org.hibernate.boot.model.naming.ImplicitNamingStrategyLegacyJpaImpl
        physical-strategy: org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
    properties:
      hibernate:
        show_sql: false
        connection:
          driver_class: com.mysql.cj.jdbc.Driver
        default_batch_fetch_size: 16
        dialect: org.hibernate.dialect.MySQL57InnoDBDialect
        enable_lazy_load_no_trans: true
        generate_statistics: false
        globally_quoted_identifiers: false
        javax:
          cache:
            missing_cache_strategy: create
        jdbc:
          batch_size: 200
        order_inserts: true
        order_updates: true
```

准备一个启动类：

```java
@EnableSwagger2
@EnableConfigurationProperties
@SpringBootApplication
public class HibernateApplication {
    public static void main(String[] args) {
        SpringApplication.run(HibernateApplication.class, args);
    }
}
```

## 五、小试牛刀

万事俱备，只欠Java类！

我们以一个简单的面向对象实例来做这次实验——电脑的拆分。

先从简单粗暴的拆分开始：

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity // Entity 注解表明本类是一个数据库实体映射类
@Table(name = "computer") // Table 注解用来指定这个对象对应的数据库表名，以及定义索引等
public class ComputerEntity implements Serializable {
    /**
     * 主键ID
     */
    @Id // Id 注解表明本字段是主键
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 这里可以指定主键值的生成策略
    @Column(name = "id", unique = true, nullable = false)  // Column 注解来做属性和表字段的映射
    private Integer id;

    /**
     * 显示器
     */
    @Column(name = "display", nullable = false, length = 100)
    private String display;

    /**
     * 键盘
     */
    @Column(name = "keyboard", nullable = false, length = 200)
    private String keyboard;

    /**
     * CPU
     */
    @Column(name = "cpu", nullable = false)
    private String cpu;

    /**
     * 存储器
     */
    @Column(name = "memory")
    private String memory;
}
```

Computer类里定义了一些电脑所需的部分，并且都是简单的String类型，先试着启动一下项目，看看会不会自动创建表。

项目启动成功，查看数据库，会发现自动创建了computer表，看下字段：

![表结构](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/image-20220701002342499.png)

字段的类型自动识别为了varcahr，并且长度是我们在Column注解上指定的长度，不指定的话默认为255。

怎么样！就是这么神奇！

现在表是有了，我们试着来对这个表做一些增删改查。

涉及到数据的操作，就要用到Spring Data JPA了，定义一个repository：

```java
@Repository
public interface ComputerRepository extends JpaRepository<ComputerEntity, Integer> {
}
```

继承Data JPA提供的基础Repository，需要指定要操作的数据对象，以及主键类型，并打上@Repository注解。

这样一来我们的ComputerRepository就继承了一些基础的增删改查的能力：

![image-20220713153129944](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/image-20220713153129944.png)

简单搞一个service来使用一下这些能力：ComputerServiceImpl里实现了基本的增删改查方法。

```java
@Service
public class ComputerServiceImpl implements ComputerService {
    @Autowired
    private ComputerRepository computerRepository;

    @Override
    public void createComputer(ComputerEntity entity) {
        computerRepository.save(entity);
    }

    @Override
    public void deleteComputerById(Integer id) {
        computerRepository.deleteById(id);
    }

    @Override
    public void updateComputer(Integer id, ComputerEntity entity) {
        ComputerEntity computer = computerRepository.getReferenceById(id);
        computer.setKeyboard(entity.getKeyboard());
        computer.setCpu(entity.getCpu());
        computer.setDisplay(entity.getDisplay());
        computer.setMemory(entity.getMemory());
        computerRepository.save(computer);
    }

    @Override
    public List<ComputerEntity> getAllComputers() {
        return computerRepository.findAll();
    }
}
```

还需要一个controller来进行浏览器调用：

```java
@Api
@RestController
@RequestMapping("/api/computers")
public class ComputerController {

    @Autowired
    private ComputerService computerService;

    @ApiOperation("新增Computer")
    @PostMapping
    public void createComputer(@RequestBody ComputerEntity entity) {
        computerService.createComputer(entity);
    }

    @ApiOperation("删除Computer")
    @DeleteMapping("{computerId}")
    public void deleteComputer(@PathVariable(value = "computerId") Integer id) {
        computerService.deleteComputerById(id);
    }

    @ApiOperation("更新Computer")
    @PutMapping("{computerId}")
    public void updateComputer(@PathVariable(value = "computerId") Integer id,
                               @RequestBody ComputerEntity newEntity) {
        computerService.updateComputer(id, newEntity);
    }

    @ApiOperation("获取所有Computer")
    @GetMapping
    public List<ComputerEntity> getComputers() {
        return computerService.getAllComputers();
    }
}
```

然后启动项目，启动成功后，访问http://localhost:8080/swagger-ui.html，就可以看到我们的API接口了：

![image-20220713150656899](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/image-20220713150656899.png)

我们先调用创建接口创建几条数据，主键id不需要传，会自动生成：

![image-20220713151027313](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/image-20220713151027313.png)

查看数据库，成功创建五条数据：

![image-20220713151056295](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/image-20220713151056295.png)

将id为5的数据修改一下：

![image-20220713151219240](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/image-20220713151219240.png)

数据更新成功：

![image-20220713151245790](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/image-20220713151245790.png)

删除id为1的数据：

![image-20220713151331001](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/image-20220713151331001.png)

删除成功：

![image-20220713151349440](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/image-20220713151349440.png)

查询所有数据：

![image-20220713151453627](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/image-20220713151453627.png)

到这里，使用hibernate操作简单的数据表，已经不在话下了！

但是我们现在的computer类的属性全部为string，会自动映射成varchar，那如果是复杂的对象类型或者集合，还能搞定吗？

如果多个表之间存在级联关系的话，hibernate又是如何处理的呢？

别急，我们慢慢来探索一下。

## 六、更上一层楼

