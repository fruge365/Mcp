# 文本处理 MCP

基于 Model Context Protocol 和 Vue3 的文本处理工具。

## 功能特性

- **文本统计**: 统计字数、字符数、行数
- **文本转换**: 大小写转换、首字母大写、文本反转
- **文本清理**: 移除多余空格和特殊字符
- **关键词提取**: 分析文本并提取高频关键词
- **JSON处理**: JSON美化、压缩和验证

## 安装和运行

1. 安装依赖:
```bash
npm install
```

2. 启动服务器:
```bash
npm start
```

3. 访问 http://localhost:3000 使用Web界面

## MCP 使用

作为 MCP 服务器使用时，支持以下工具:

- `count_words`: 统计文本
- `transform_text`: 转换文本格式
- `clean_text`: 清理文本
- `extract_keywords`: 提取关键词

## API 接口

POST `/api/process`
```json
{
  "text": "要处理的文本",
  "type": "count|transform|clean|keywords|json",
  "operation": "uppercase|lowercase|capitalize|reverse|beautify|minify|validate"
}
```