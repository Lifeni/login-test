# 注册与登录测试

与软件质量保证与测试报告相关的被测软件，本项目相关的密码和数据仅用于测试。

## 本地安装

1. 安装 [Node.js](https://nodejs.org/zh-cn/)，检查是否安装：

   ```bash
   node -v
   npm -v
   ```

2. 替换国内淘宝镜像源（如果你是第一次用 Node）：

   ```bash
   npm config set registry https://registry.npm.taobao.org
   ```

3. 在本项目文件夹，按住 `shift` 右键打开 PowerShell，输入：

   ```bash
   npm install
   ```

   等一会，如果没有出现 `ERR` 就行。

4. 输入下面命令，会自动打开浏览器：

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