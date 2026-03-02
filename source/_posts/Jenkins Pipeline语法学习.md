## 1、动态步骤——when

通过stage内的when语法，可以实现pipeline的动态步骤。

```groovy
environment {
      // 根据构建id的奇偶性决定FOO是0还是1
      FOO = "${currentBuild.getNumber() % 2}"
}

stage("When") {
    when {
        // 只有master分支会执行此步骤
        branch "master"
        
        // 只有非master分支会执行此步骤
        not {
            branch "master"
        }
        
        // 只有环境变量FOO的值等于0时才执行此步骤
        environment name: "FOO", value: "0"
        
        // 自定义脚本返回true/false决定是否执行此步骤，true为执行，false为不执行
        expression {
          // 这里可以是任意的groovy脚本
          return false
        }
      }
      steps {
        echo "World"
      }
}
```

build视图：

![image-20220422181059256](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/image-20220422181059256.png)

blueOcean视图：

![image-20220422181407851](https://yangmingblog-1259175198.cos.ap-beijing.myqcloud.com/uPic/2022/image-20220422181407851.png)