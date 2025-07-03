# Eat What - 帮你决定吃什么！

这是一个简单的全栈应用，旨在帮助你决定吃什么。它提供了一个食物列表，你可以添加、更新和删除食物。

## 技术栈

*   **全栈框架:** Python FastAPI
*   **前端:** HTML, CSS, JavaScript (由 FastAPI 提供静态文件)
*   **数据库:** SQLite

## 项目结构

```
. # 项目根目录
├── src/                  # 统一的源代码目录
│   ├── main.py           # FastAPI 应用主文件，包含 API 路由和静态文件服务
│   ├── api/              # 存放 API 相关的模块
│   │   ├── __init__.py
│   │   └── schemas.py    # 定义 Pydantic 数据模型 (Food, FoodCreate 等)
│   ├── core/             # 存放核心工具、数据库连接等
│   │   ├── __init__.py
│   │   └── database.py   # 数据库连接和 SQLAlchemy 模型
│   └── static/           # 存放前端的静态文件
│       ├── index.html
│       ├── css/
│       │   └── main.css
│       └── js/
│           ├── api.js    # 前端 API 调用逻辑
│           ├── main.js
│           └── ui.js
├── data/                 # 数据文件
│   ├── foods.db          # SQLite 数据库文件
│   └── foods.json        # 原始 JSON 数据 (如果需要导入)
├── .gitignore
├── README.md
├── DEPLOYMENT.md
├── pyproject.toml        # 项目配置和依赖管理
└── uv.lock               # uv 锁文件，精确锁定依赖版本
```

## 本地运行

### 1. 克隆仓库

```bash
git clone <你的仓库URL>
cd eat_what
```

### 2. 设置 Python 环境

在项目根目录下创建并激活 Python 虚拟环境，然后安装依赖。

```bash
uv venv
uv sync
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate   # Windows
```

### 3. 启动应用

确保虚拟环境已激活，然后在项目根目录下运行：

```bash
uvicorn src.main:app --reload
```

这将启动 FastAPI 应用，默认监听 `http://127.0.0.1:8000`。你可以直接在浏览器中访问 `http://127.0.0.1:8000` 来使用应用。

## 部署

请参考 `DEPLOYMENT.md` 文件获取部署说明。
