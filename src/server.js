const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());

// Configurar o MongoDB Atlas
const dbURI = 'mongodb+srv://matheusfiaschi:y8U6NKUMAhGD0sdY@cluster0.w3im8xf.mongodb.net/';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(port, () => console.log(`Servidor rodando na porta ${port}`)))
  .catch(err => console.log(err));

// Definir Schema e Modelo
const itemSchema = new mongoose.Schema({
  nome: String,
  valor: Number
});

const Item = mongoose.model('Item', itemSchema);

// Rotas
app.get('/', (req, res) => {
  res.send('API está funcionando!');
});

app.get('/itens', async (req, res) => {
  try {
    const itens = await Item.find();
    res.status(200).json(itens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/itens', async (req, res) => {
  const { nome, valor } = req.body;
  try {
    const novoItem = new Item({ nome, valor });
    const itemSalvo = await novoItem.save();
    res.status(201).json(itemSalvo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
