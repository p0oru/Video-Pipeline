const { exec } = require('child_process');
const path = require('path');

module.exports = function enhanceAudio(inputPath) {
  return new Promise((resolve, reject) => {
    const outputPath = inputPath.replace(/\.mp4$/, '-audio-enhanced.mp4');
    const command = `ffmpeg -i ${inputPath} -af "loudnorm" -c:v copy ${outputPath}`;

    exec(command, (err) => {
      if (err) reject(err);
      else resolve(outputPath);
    });
  });
};
