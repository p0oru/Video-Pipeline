const { exec } = require('child_process');

module.exports = function removeNoise(inputPath) {
  return new Promise((resolve, reject) => {
    const outputPath = inputPath.replace(/\.mp4$/, '-denoised.mp4');
    const command = `ffmpeg -i ${inputPath} -af "highpass=f=200, lowpass=f=3000" -c:v copy ${outputPath}`;

    exec(command, (err) => {
      if (err) reject(err);
      else resolve(outputPath);
    });
  });
};
