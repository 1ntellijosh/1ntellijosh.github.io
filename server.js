import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the dist directory
// Set proper headers for audio files and handle spaces in paths
app.use(express.static(join(__dirname, 'dist'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.mp3') || path.endsWith('.wav') || path.endsWith('.ogg')) {
      res.setHeader('Content-Type', path.endsWith('.mp3') ? 'audio/mpeg' : 
                    path.endsWith('.wav') ? 'audio/wav' : 'audio/ogg');
      res.setHeader('Accept-Ranges', 'bytes');
    }
  }
}));

// Handle React Router - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

