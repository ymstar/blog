---
title: "Jenkins Pipeline语法学习"
pubDate: 2021-06-01 00:00:00
category: "DevOps"
tags: ["Jenkins", "Pipeline"]
---

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
