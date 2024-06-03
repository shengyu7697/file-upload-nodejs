const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0'; // 監聽所有網路介面

// 設定 multer 的儲存引數
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// 設定靜態檔案服務
app.use(express.static(path.join(__dirname, 'public')));

// 處理文件上傳的路由
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send(`File uploaded: ${req.file.originalname}`);
});

// 啟動伺服器
app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
