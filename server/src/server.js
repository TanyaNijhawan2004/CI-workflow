import express from 'express';
import * as dotenv from 'dotenv';
import connectDB from './mongodb/db.js';
import cors from 'cors';
import Note from './mongodb/models/notemodel.js';
import path from 'path';

dotenv.config();


const app = express();
app.use(cors({
  origin: '*'
}));

// Middleware
app.use(express.json());

const router = express.Router();
app.options('*', cors());

const __dirname = path.resolve();
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// GET all notes
router.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    // res.json(notes); // Make sure to return the notes array as the response
    res.status(200).json(notes??{message: "No notes found"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// POST a new note
router.post('/api/notes', async (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
  });

  try {
    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/api/test", (req, res) => {
  res.json({message: "Hello World"});
})

// Register the router middleware
app.use(router);

const server = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(3500, () => console.log('Server is running on port 3500'));
  } catch (error) {
    console.log(error);
  }
};

server();

export default app;

