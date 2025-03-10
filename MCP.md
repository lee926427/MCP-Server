
# MCP (Model Context Protocol)介紹

MCP 全名為 Model Context Protocol，由 Claude 母公司 Anthropic 所發布的一個 AI 與外部資源互動的協議，簡化了 AI 即插即用服務的開發。與其他可能需要為每個 AI 模型進行客製化實現的整合方法不同，MCP 提供了一種適用於不同 LLM 的標準化方法, 採用 JSON-RPC 2.0 進行溝通。

## 透過 MCP 可以做到哪些事情？
- 讀取檔案和資料庫
- 執行命令
- 存取 API 例如: Github、Google Map、Slack…etc
- 與本地工具交互 例如: Git、、System File…etc
- 还有更多！

## MCP 運作的方式:
- [MCP Server](./SERVER.md)
- [MCP Client](./CLIENT.md)

## Core Concept
Resources ( 資源 )
資源是重要的概念也是唯一向 LLM 公開唯讀資料的方式。它可以是任何具有可讀取內容的東西，可當成 API 的 GET，例如：
電腦上的文件
資料庫記錄
API 回應
應用程式數據
系統資訊

每個資源都有：
唯一的 URI（例如file:///example.txt或database://users/123）
顯示名稱
元資料（MIME 類型）(Optional)
描述（文字）(Optional)

有以下幾個情境可以應用:
### Documentation Server
```bash
// 公開公司的文件
"docs://api/reference" -> API 文件
"docs://guides/getting-started" -> 使用者指南
```
>使用者: "您能解釋一下我們的 API 速率限制政策嗎？"<br/>
>AI 助理: "讓我查看 API 文檔…根據文檔，每分鐘最多可以發送 100 個請求…"<br/>


### Log Analysis Server
```bash
"logs://system/today" -> Today's system logs
"logs://errors/recent" -> Recent error messages
```
>使用者: "今天有什麼錯誤?"<br/>
>AI 助理: "正在查看今天的紀錄, 我看到有三個錯誤…"<br/>

### Customer Data Server
```bash
"customers://profiles/summary" -> Customer overview
"customers://feedback/recent" -> Latest feedback
```

>使用者: "最近客戶回饋的整體情緒是什麼?"
>AI 助理: "分析最近的反饋，顧客大多持積極態度，但是…"

<br/>

## Prompts(提示詞)
透過可重複利用的樣板語句, 幫助 LLMs 更精確的決定工具與伺服器有效的互動
<br/>

## Tools(工具)
LLMs 透過工具與伺服器產生互動,不像 Resources、Prompts , 工具會產生額外的電腦計算, 可以當成 POST、PATCH 跟 DELETE 來使用, 
值得注意的是建立好的 Tool 只會出現在 MCP tools 裡面, 透過與 AI 的對話會參考 Tool 的 description 作為使用依據

類似以下情境:
```bash
name: "add_song"
arguments: {
  singer: "可米小子",
  type: "song",
  name: "青春紀念冊",
  cover: "image.jpg"
}
```
>使用者: 我想新增可米小子的歌，青春紀念冊，封面圖: image.jpg<br/>
>AI 助理: 好的，幫你新增至歌單…<br/>