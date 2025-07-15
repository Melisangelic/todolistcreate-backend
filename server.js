const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

// ✅ Tüm kaynaklara izin vermek için:
app.use(cors());

app.use(express.json());

const DATA_FILE = './tasks.json';

// Test için ana route
app.get('/', (req, res) => {
  res.send('Görev listesi API çalişiyor!');
});

// Görevleri getir
app.get('/tasks', (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.json([]);
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  res.json(JSON.parse(data));
});

// Yeni görev ekle
app.post('/tasks', (req, res) => {
  const newTask = req.body;
  let tasks = [];
  if (fs.existsSync(DATA_FILE)) {
    tasks = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  }
  tasks.push(newTask);
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks));
  res.status(201).json({ message: 'Görev eklendi' });
});

// Görev sil
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  let tasks = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  tasks = tasks.filter(task => task.id !== id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks));
  res.json({ message: 'Görev silindi' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu çalişiyor: http://localhost:${PORT}`);
});
