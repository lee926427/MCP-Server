# MCP Project
    
- [MCP 介紹](./MCP.md)
- [MCP Server](./SERVER.md)
- [MCP Client](./CLIENT.md)

## 環境建置
1. 下載 Node.js
2. 下載 docker 然後執行以下命令
```bash
docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=admin postgres
```
3. 建立 Server
```bash
npm install
npm run build
```
4. 建立 claude_desktop_config.json
```bash
cd ~/Library/Application\ Support/Claude
touch claude_desktop_config.json
```
5. 將以下內容貼至剛建立的檔案內
```json
{
  "mcpServers": {
    "mcp-server": {
      "command": "node",
      "args": ["/absolute/path/to/your/hello-mcp/build/index.js"]
    }
  }
}
```
6. 執行 MCP 檢查器
```bash
npm run inspector
```
7. 打開瀏覽器輸入以下網址 http://localhost:5173,點擊 Connect 按鈕
8. 右側會出現以下畫面再點選 List Resources，會列出先前ListResourcesRequestSchema 所提供的 Resources
9. 點擊 Hello World Message, 右側會出現 Server 的回應

