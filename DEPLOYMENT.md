### 本地服务器部署计划 (无需 sudo 权限)

**目标：** 使 `eat_what` 应用在你的 Linux 服务器上可被本地网络中的其他设备访问，且部署过程尽量避免 `sudo` 权限。

**重要提示：** 防火墙规则通常需要 `sudo` 权限才能修改。如果你的 Linux 电脑启用了防火墙，并且你希望其他设备能够访问你的应用，你可能仍然需要手动使用 `sudo` 来开放端口。这个步骤超出了“不需要 sudo 权限”的范围，但对于外部访问是必要的。

---

#### **第一阶段：修改后端监听地址**

FastAPI 默认监听 `127.0.0.1`。为了让应用能够响应来自本地网络中其他设备的请求，我们需要让它监听所有网络接口（`0.0.0.0`）。

当你使用 `uvicorn` 启动 FastAPI 应用时，可以通过 `--host` 参数指定监听地址。

**重要提示：CORS 配置**

在 `src/main.py` 中，CORS 配置 `allow_origins=["*"`]` 允许所有来源访问。在生产环境中，出于安全考虑，你应该将其限制为你的前端域名，例如 `allow_origins=["https://your-frontend-domain.com"]`。

#### **第二阶段：启动应用服务 (无需 sudo)**

1.  **在你的 Linux 电脑上，打开终端。**
2.  **进入项目根目录：**
    ```bash
    cd /home/sido/projects/eat_what/
    ```
3.  **设置 Python 环境：**
    在项目根目录下创建并激活 Python 虚拟环境，然后安装依赖。
    ```bash
    uv venv
    uv sync
    source .venv/bin/activate  # Linux/macOS
    # .venv\Scripts\activate   # Windows
    ```
4.  **启动 FastAPI 应用：**
    确保虚拟环境已激活，然后在项目根目录下运行：
    ```bash
    uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
    ```
    *   `--host 0.0.0.0`：让 FastAPI 监听所有网络接口。
    *   `--port 8000`：指定 FastAPI 监听的端口。
    *   `--reload`：开发模式下，代码修改后自动重启。

    *   如果你想在后台运行，并将所有输出保存到日志文件，可以使用 `nohup` 和 `&`：
        ```bash
        nohup uvicorn src.main:app --host 0.0.0.0 --port 8000 > app.log 2>&1 &
        ```
        *   `nohup`：防止进程在终端关闭时终止。
        *   `>` `app.log`：将标准输出重定向到 `app.log` 文件。
        *   `2>&1`：将标准错误输出也重定向到标准输出（即 `app.log`）。
        *   `&`：将进程放到后台运行。

#### **第四阶段：防火墙设置 (可能需要 sudo)**

如果你的 Linux 电脑启用了防火墙（例如 `ufw`），你需要允许外部设备访问应用的端口。

*   **允许应用端口 (8000)：**
    ```bash
    sudo ufw allow 8000/tcp
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
    *   `http://你的Linux电脑IP地址:8000`