const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// 設定靜態檔案服務
app.use(express.static(path.join(__dirname, 'public')));

// 設定 multer 的儲存引數
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  //filename: (req, file, cb) => {
  //  cb(null, `${Date.now()}-${file.originalname}`); // 日期加原檔名
  //}
  filename: (req, file, cb) => {
    // 使用Buffer儲存二進制編碼後再解碼, 避免中文檔名出現亂碼
    cb(null, `${Buffer.from(file.originalname,'binary').toString()}`)
  }
});

const upload = multer({ storage: storage });

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
    const tableRows = files.map(file => `
      <tr>
        <td><a href="/uploads/${file}">${file}</a></td>
        <td>
          <form action="/delete/${encodeURIComponent(file)}" method="post">
            <button type="submit" class="btn btn-danger btn-sm">Delete</button>
          </form>
        </td>
      </tr>`).join('');
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Uploaded Files</title>
        <link rel="stylesheet" href="/css/bootstrap.min.css">
      </head>
      <body>
        <div class="container">
          <h1 class="mt-5">Uploaded Files</h1>
          <table class="table">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <a href="/" class="btn btn-secondary mt-3">Upload another file</a>
        </div>
      </body>
      </html>
    `;
    res.send(html);
  });
});

// 處理刪除文件的路由
app.post('/delete/:fileName', (req, res) => {
  const fileName = decodeURIComponent(req.params.fileName);
  const filePath = path.join(__dirname, 'uploads', fileName);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).send('Unable to delete file.');
    }
    res.redirect('/files');
  });
});

// 設定靜態檔案服務以提供上傳的文件
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
