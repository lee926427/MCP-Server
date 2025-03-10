# MCP Server
### 環境設定
目前官方提供了許多[SDK](https://github.com/modelcontextprotocol), 這邊以 Typescript 作為範例

先在你想要的地方建立一個專案
```bash
mkdir mcp-server
cd mcp-server
npm init -y
npm install @modelcontextprotocol/sdk
npm install -D typescript @types/node
```
用你喜歡的 IDE 打開專案並且編輯 package.json, 將 "main": index.js 替換成 "type": "module", 最後在 scripts 裏添加 "build" 與 "inspector" 指令
```json
{
  "name": "hello-mcp",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "inspector": "npx @modelcontextprotocol/inspector node build/index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.1.0"
  },
  "devDependencies": {
    "@types/node": "^22.10.5",
    "typescript": "^5.7.2"
  }
}
```
最後設定 tsconfig.json 方便之後的開發
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./build",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
```
現在環境設定好了可以開始準備建立第一個 MCP Server

<br/>

### 建立 MCP 資源伺服器
在 src資料夾下建立一個 index.ts 檔案並且新增以下 code
```typescript
// src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const server = new Server({
  name: "mcp-server",
  version: "1.0.0",
},{
    capabilities:{
        resources:{}
    }
});

// ListResourcesRequestSchema - 告訴 MCP Client 這個 Server 現在有哪些資源
// resources - 每個資源都有 uri、name 還有選填的 mimeType/description
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources:[
            {
                uri: "student://id",
                name: "get student ID",
                mimeType: "text/plain",
                description: "get Student ID",
            }
    ]
    };
});

// ReadResourceRequestSchema - 返回資源給 MCP Client
// 配對 uri 返回對應的內容
// 內容包含了 uri 以及精確的資料
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    switch(request.params.uri){
        case "student://id":
          return {
            contents: [
              {
                uri: "student://id",
                text: "Hello, World! This is my first MCP resource.",
              },
            ],
          };
    }
    
    throw new Error("Resource not found");
});

// 使用 StdioServerTransport 實體化 Server 進行 JSON-RPC 2.0 傳輸
const transport = new StdioServerTransport();
server.connect(transport);
```
---

### 測試 MCP Server
輸入以下指令建立一個 claude_desktop_config.json
```bash
cd ~/Library/Application\ Support/Claude
touch claude_desktop_config.json
```
2. 開啟你常用的 IDE 將以下的內容貼至剛建立的檔案內
```json
{
  "mcpServers": {
  "mcpServers": {
    "mcp-server": { //這邊的名稱需與 server name 一致
      "command": "node",
      "args": ["/absolute/path/to/your/hello-mcp/build/index.js"]
    }
  }
}
```
3. 再來回到專案輸入以下指令將 server 建立出來,並且執行 MCP檢查器
```bash
npm run build 
npm run inspector
```
4. 打開瀏覽器輸入以下網址 http://localhost:5173,點擊 Connect 按鈕
5. 右側會出現以下畫面再點選 List Resources，會列出先前ListResourcesRequestSchema 所提供的 Resources
6. 點擊 Hello World Message, 右側會出現 Server 的回應
從以上的步驟中可以瞭解到
資源清單顯示了之前已設定好的資源
拿到了 MCP Server 的回應
