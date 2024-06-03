const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
  res.redirect('/files');
});

// 處理顯示文件列表的路由
app.get('/files', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan files.');
    }
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>File List</title>
      </head>
      <body>
        <h1>Uploaded Files</h1>
        <ul>
          ${files.map(file => `<li><a href="/uploads/${file}">${file}</a></li>`).join('')}
        </ul>
        <a href="/">Upload another file</a>
      </body>
      </html>
    `);
  });
});

// 設定靜態檔案服務以提供上傳的文件
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
