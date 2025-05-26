const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

// Multer config
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Import agents
const audioEnhancer = require('./agents/agent1_audioEnhancer');
const brightnessFix = require('./agents/agent2_brightnessFix');
const subtitleAdder = require('./agents/agent3_subtitleAdder');
const noiseRemover = require('./agents/agent4_noiseRemover');

app.post('/upload', upload.single('video'), async (req, res) => {
  try {
    let filePath = req.file.path;

    filePath = await audioEnhancer(filePath);
    filePath = await brightnessFix(filePath);
    filePath = await subtitleAdder(filePath);
    filePath = await noiseRemover(filePath);

    res.download(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing video");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
