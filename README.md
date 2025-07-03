# 今天吃什么？

这是一个帮助你决定今天吃什么的小应用，特别为苏州大学天赐庄校区定制。

## 特性

*   **美食列表管理:** 添加、删除和搜索美食。
*   **美食详情:** 每个美食包含名称、图片、位置和标签。
*   **响应式布局:** 美食列表以自适应网格形式展示。
*   **美食转盘:** 通过转盘随机选择一个美食。
*   **前后端分离:** 数据通过 RESTful API 从后端获取和管理。

## 技术栈

### 前端

*   **HTML5:** 页面结构。
*   **CSS3:** 页面样式，包括响应式布局。
*   **JavaScript (Vanilla JS):** 页面交互和逻辑。

### 后端

*   **Node.js:** 后端运行时环境。
*   **Express.js:** 用于构建 RESTful API 的 Web 框架。
*   **SQLite:** 轻量级文件型数据库，用于存储美食数据。

## 项目结构

```
/eat_what/
├── frontend/             # 前端应用
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── assets/
│       │   └── styles/   # CSS 样式文件
│       │       └── main.css
│       └── js/           # JavaScript 模块
│           ├── api.js    # 处理对后端 API 的请求
│           ├── main.js   # 应用入口，事件监听
│           └── ui.js     # 负责所有 DOM 操作和界面更新
│
├── backend/              # 后端 API 服务
│   ├── package.json
│   ├── server.js         # Express 服务器核心配置
│   ├── database.js       # 数据库连接和初始化
│   ├── foods.db          # SQLite 数据库文件
│   └── api/
│       ├── routes/       # API 路由定义
│       │   └── foodRoutes.js
│       └── controllers/  # 业务逻辑处理
│           └── foodController.js
│
└── data/                 # 初始数据文件
    └── foods.json
```

## 设置与运行

请按照以下步骤设置并运行项目。

### 1. 克隆仓库

```bash
git clone <your-repository-url>
cd eat_what
```

### 2. 启动项目

在项目根目录 (`/eat_what/`) 下，运行以下命令来同时启动前端和后端服务：

```bash
npm install # 安装根目录依赖，主要是 concurrently
npm run start-all
```

`start-all` 脚本会同时启动后端服务器（在 `http://localhost:3000`）和前端服务（在 `http://localhost:8080`）。

**注意:** 首次运行后端时，`foods.db` 数据库文件将自动创建，并从 `data/foods.json` 导入初始美食数据。

## 使用说明

*   **查看美食:** 页面加载后，将显示从后端获取的美食列表。
*   **添加美食:** 点击“添加新美食”按钮，填写信息后提交。
*   **删除美食:** 点击美食卡片上的“删除”按钮。
*   **搜索美食:** 在搜索框中输入关键词过滤美食。
*   **随机选择:** 点击“开始选择！”按钮，转盘将随机选择一个美食。

## 未来可能的增强

*   **图片上传功能:** 允许用户上传美食图片，而不是只提供 URL。
*   **用户认证:** 实现用户登录/注册，允许用户管理自己的美食列表。
*   **更丰富的筛选和排序选项。**
*   **后端数据持久化到文件:** 实现后端 API 写入 `foods.json` 文件，而不是仅依赖数据库。
*   **更友好的 UI/UX。**