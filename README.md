# 📝 文本处理工具（Mcp）

[![Node](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express)](https://expressjs.com/)

一个跑在本地的文本处理小工具：字数统计、大小写转换、文本清理、关键词提取、JSON 美化/压缩/校验。后端是一个 express 接口，前端是单文件 HTML 页面。

## 快速开始

```bash
# 安装依赖
npm install

# 启动服务
npm start

# 开发模式（改动后自动重启）
npm run dev
```

启动后访问 http://localhost:3000 使用网页界面。

## 能力清单

| 类型 | `type` | 说明 | 可选 `operation` |
| --- | --- | --- | --- |
| 统计 | `count` | 单词数、字符数、去空格字符数、行数 | — |
| 转换 | `transform` | 大小写与反转 | `uppercase` / `lowercase` / `capitalize` / `reverse` |
| 清理 | `clean` | 合并空白、去首尾空格、移除标点与特殊字符（保留中英文与数字） | — |
| 关键词 | `keywords` | 取频率最高的前 10 个词（仅长度 > 2 的英文词） | — |
| JSON | `json` | 美化、压缩、校验 | `beautify` / `minify` / `validate` |

## 接口

`POST /api/process`

```json
{
  "text": "要处理的文本",
  "type": "count",
  "operation": "uppercase"
}
```

成功返回：

```json
{ "success": true, "result": { ... } }
```

失败返回 400：

```json
{ "success": false, "error": "未知操作类型" }
```

示例：

```bash
curl -X POST http://localhost:3000/api/process \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello World","type":"count"}'
```

## 项目结构

```text
Mcp/
├─ server.js           express 服务 + 文本处理函数（唯一实现源）
├─ public/
│  └─ index.html       单文件网页界面（调 /api/process）
├─ mcp.json            MCP 客户端配置示例
├─ 测试数据.md          手工测试用样例
└─ package.json
```

## 关于 MCP：请先读这一节

`mcp.json` 给出了一个 `text-processing` 服务配置：

```json
{
  "mcpServers": {
    "text-processing": {
      "command": "node",
      "args": ["server.js"],
      "cwd": "/Users/fruge365/个人/mcp"
    }
  }
}
```

但需要如实说明：**当前 `server.js` 并没有实现 MCP 协议**。

- 项目依赖只有 `express` 与 `cors`，没有 `@modelcontextprotocol/sdk`
- `server.js` 中只有 `app.post('/api/process')` 与 `app.listen(PORT)`，**没有 stdio 传输层、没有 JSON-RPC 消息处理、没有 `initialize` / `tools/list` 响应**

因此上面的 `mcp.json` 直接用于 MCP 客户端时**不会生效**：客户端会以 stdio 方式启动进程并等待握手，而 `server.js` 只会去监听 3000 端口，握手不会应答。

若要真正作为 MCP 服务器使用，需要引入 `@modelcontextprotocol/sdk`，把现有的 `textProcessors` 包装成 `count_words` / `transform_text` / `clean_text` / `extract_keywords` 四个 tool，并通过 `StdioServerTransport` 暴露。文本处理函数本身已经集中写在 `server.js` 顶部，改造时可直接复用。

> 原 README 中"基于 Model Context Protocol 和 Vue3"及"支持 MCP 工具"的描述与代码不符：前端 `public/index.html` 是原生 HTML + JS（CDN 引入 Vue 全局构建，但未走工程化），后端未接 MCP 协议。本版已按实际代码更正。

## 常见问题

**端口被占用？**
`PORT` 支持环境变量覆盖：`PORT=3001 npm start`。

**`mcp.json` 里的 cwd 是我本机路径？**
那是作者机器上的路径，用作示例。放你自己的项目路径才能用。

**关键词提取对中文无效？**
`extractKeywords` 用 `\b\w+\b` 匹配，只对英文单词有效，中文文本几乎提取不出结果。

## 许可

仅供学习与参考使用。
