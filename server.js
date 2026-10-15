const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/fiction_db')
  .then(() => console.log('Database Connected Successfully'))
  .catch(err => console.log(err));

const Character = mongoose.model('Character', new mongoose.Schema({
  name: String,
  shortDescription: String,
  gender: String,
  role: String,
  currentLocation: String,
  accompaniedBy: [String], 
  specialDetails: String
}));

// Read All
app.get('/api/characters', async (req, res) => res.json(await Character.find()));

// Write New
app.post('/api/characters', async (req, res) => {
  req.body.accompaniedBy = req.body.accompaniedBy.split(',').map(c => c.trim());
  res.json(await new Character(req.body).save());
});

// Update Existing (The Edit Interrupt)
app.put('/api/characters/:id', async (req, res) => {
  req.body.accompaniedBy = req.body.accompaniedBy.split(',').map(c => c.trim());
  const updatedChar = await Character.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedChar);
});

// Delete (The Erase Interrupt)
app.delete('/api/characters/:id', async (req, res) => {
  await Character.findByIdAndDelete(req.params.id);
  res.json({ message: 'Character Deleted' });
});

app.listen(5000, () => console.log('Backend running on Port 5000'));