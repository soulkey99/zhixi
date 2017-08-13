测试服务器静态文件部署：
1. 下载并安装Bitvise SSH Client Installer：http:///soft/BvSshClient-Inst.exe
2. 选择左侧Load profile -> 选择配置文件'sk_test_config.tlp' -> Login，即可登录服务器。
3. 选择左侧New SFTP window，启动sftp窗口，左侧选择本地文件，右侧选择远程文件(/home/being/byzhixi/webServer)，即可上传。

本地开发调试：
1. 下载并安装Node.js(v4.x) ：  https://nodejs.org/en/
2. 启动cmd，进入webServer文件夹，运行npm install。
3. 运行node server.js 启动本地服务
4. 浏览器打开http://localhost:8053开始调试


ssh private key：
-----BEGIN RSA PRIVATE KEY-----
//
-----END RSA PRIVATE KEY-----


ssh public key：
//

