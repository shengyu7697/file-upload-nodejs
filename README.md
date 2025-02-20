# file upload
寫一個node.js檔案上傳的網頁給我，可以上傳任何檔案類型，使用 ejs 技術，用 bootstrap 美化前端介面，要有上傳後的檔案列表
後來沒用ejs

## 支援功能
支援以下幾個功能
- 檔案上傳
- 顯示檔案列表
- 要能刪除
- 要能支援中文檔案名稱的上傳與顯示

## 安裝步驟
首先，建立一個新的目錄並初始化 npm 專案：
```bash
mkdir file-upload
cd file-upload
npm init -y
```
接著，安裝 Express 和 Multer：
```bash
npm install express multer
```

在專案目錄中建立一個 uploads 目錄來存放上傳的檔案：
```bash
mkdir uploads
```
在專案目錄中執行以下指令來啟動伺服器：
```bash
node server.js
```
伺服器啟動後，打開瀏覽器並訪問 http://localhost:3000，你會看到一個簡單的文件上傳表單。選擇一個文件並點擊上傳按鈕，上傳的文件將會被保存到 uploads 目錄中。
這樣就完成了一個簡單的 Node.js 文件上傳網頁。

## 讓區網的人可以連上這個網頁
修改 server.js
```
const PORT = 3000;
const HOST = '0.0.0.0'; // 監聽所有網路介面
app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
```