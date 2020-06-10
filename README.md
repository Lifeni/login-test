# 注册与登录测试

软件质量保证与测试报告相关的被测软件。本仓库地址仅包含前端部分，后端部分没有开源。

程序接口设计在：https://www.showdoc.cc/Lifeni?page_id=4523818236268497。

程序的流程图可以查看 `documents` 文件夹下的 `.drawio` 文件。

## 本地安装

1. 安装 [Node.js](https://nodejs.org/zh-cn/)，检查是否安装：

    ```bash
    node -v
    npm -v
    ```

2. 在本项目文件夹，按住 `shift` 右键打开 PowerShell，输入：

    ```bash
    npm install --registry https://registry.npm.taobao.org
    ```

    等一会，如果没有出现 `ERR` 就行。

3. 输入下面命令，打开 http://localhost:10010 即可：

    ```bash
    npm start
    ```

## Docker

1. 把项目克隆到有 Docker 上的设备后，在文件目录执行：

    ```bash
    docker build -t login-test:v1 .
    ```

    如果手动输入别忘了最后的 `.`。

2. 制作成镜像后运行：

    ```bash
    docker run -d -p 10010:10010 login-test:v1
    ```

3. 服务器反向代理或者直接打开 http://localhost:10010 即可。
