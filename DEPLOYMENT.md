### 本地服务器部署计划 (无需 sudo 权限)

**目标：** 使 `eat_what` 应用在你的 Linux 服务器上可被本地网络中的其他设备访问，且部署过程尽量避免 `sudo` 权限。

**重要提示：** 防火墙规则通常需要 `sudo` 权限才能修改。如果你的 Linux 电脑启用了防火墙，并且你希望其他设备能够访问你的应用，你可能仍然需要手动使用 `sudo` 来开放端口。这个步骤超出了“不需要 sudo 权限”的范围，但对于外部访问是必要的。

---

#### **第一阶段：修改后端监听地址**

为了让后端服务器能够响应来自本地网络中其他设备的请求，我们需要让它监听所有网络接口（`0.0.0.0`）。

1.  **修改 `backend/server.js`：**
    *   找到 `app.listen` 这一行。
    *   将其修改为监听 `0.0.0.0`。

    ```javascript
    // backend/server.js
    const PORT = process.env.PORT || 3000;
    // ...
    app.listen(PORT, '0.0.0.0', () => { // 修改这一行
        console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
    ```

#### **第二阶段：启动后端服务 (无需 sudo)**

1.  **在你的 Linux 电脑上，打开终端。**
2.  **进入 `backend` 目录：**
    ```bash
    cd /home/sido/projects/eat_what/backend
    ```
3.  **安装依赖（如果尚未安装）：**
    ```bash
    npm install
    ```
4.  **启动后端服务并使其在后台运行：**
    使用 `nohup` 命令可以在你关闭终端后，进程仍然继续运行。
    ```bash
    nohup node server.js &
    ```
    *   `nohup`：防止进程在终端关闭时终止。
    *   `&`：将进程放到后台运行。
    *   你可以在当前目录下找到 `nohup.out` 文件，其中包含了服务器的日志输出。

#### **第三阶段：启动前端服务 (无需 sudo)**

你的前端 `frontend/package.json` 中已经配置了 `npm start` 脚本来运行 `live-server`。我们将利用这一点。

1.  **在你的 Linux 电脑上，打开一个新的终端窗口。**
2.  **进入 `frontend` 目录：**
    ```bash
    cd /home/sido/projects/eat_what/frontend
    ```
3.  **安装依赖（如果尚未安装）：**
    ```bash
    npm install
    ```
4.  **启动前端服务并使其在后台运行：**
    ```bash
    nohup npm start &
    ```
    *   `npm start` 会执行 `live-server --port=8080`。
    *   同样，日志会输出到 `nohup.out` 文件。

#### **第四阶段：防火墙设置 (可能需要 sudo)**

如果你的 Linux 电脑启用了防火墙（例如 `ufw`），你需要允许外部设备访问后端和前端的端口。**这一步通常需要 `sudo` 权限。**

*   **允许后端端口 (3000)：**
    ```bash
    sudo ufw allow 3000/tcp
    ```
*   **允许前端端口 (8080)：**
    ```bash
    sudo ufw allow 8080/tcp
    ```
*   **检查防火墙状态：**
    ```bash
    sudo ufw status
    ```
    如果你无法使用 `sudo` 或不想修改防火墙，那么其他设备将无法访问你的应用，除非防火墙默认是关闭的。

#### **第五阶段：从其他设备访问**

1.  **获取你的 Linux 电脑的 IP 地址：**
    在终端中运行：
    ```bash
    ip a
    ```
    查找 `inet` 后面的地址，通常是 `192.168.x.x` 或 `10.0.x.x`。
2.  **在本地网络中的其他设备上，打开浏览器访问：**
    *   **前端：** `http://你的Linux电脑IP地址:8080`
    *   **后端 API：** 前端会自动连接到 `http://你的Linux电脑IP地址:3000/api`
