const { exec } = require('child_process');

module.exports = function fixBrightness(inputPath) {
  return new Promise((resolve, reject) => {
    const outputPath = inputPath.replace(/\.mp4$/, '-brightness.mp4');
    const command = `ffmpeg -i ${inputPath} -vf "eq=brightness=0.06:contrast=1.2" ${outputPath}`;

    exec(command, (err) => {
      if (err) reject(err);
      else resolve(outputPath);
    });
  });
};
