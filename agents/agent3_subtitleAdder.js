const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

module.exports = function addSubtitles(inputPath) {
  return new Promise((resolve, reject) => {
    const videoDir = path.dirname(inputPath);
    const baseName = path.basename(inputPath, path.extname(inputPath)); // no extension
    const srtPath = inputPath.replace(/\.mp4$/, '.srt');
    const outputPath = inputPath.replace(/\.mp4$/, '-subtitled.mp4');

    // Step 1: Run Whisper to generate the .srt file
    const whisperCmd = `whisper "${inputPath}" --model small --language English --output_format srt --output_dir "${videoDir}"`;

    console.log('⏳ Running Whisper for subtitle generation...');
    exec(whisperCmd, (err, stdout, stderr) => {
      if (err) {
        console.error('❌ Whisper failed:', stderr);
        return reject(err);
      }

      // Step 2: Check if SRT file was created
      if (!fs.existsSync(srtPath)) {
        return reject(new Error(`SRT file not found: ${srtPath}`));
      }

      // Step 3: Burn subtitles using ffmpeg
      const ffmpegCmd = `ffmpeg -i "${inputPath}" -vf "subtitles='${srtPath.replace(/\\/g, "\\\\")}'" "${outputPath}"`;

      console.log('🎞️ Adding subtitles to video with FFmpeg...');
      exec(ffmpegCmd, (err2) => {
        if (err2) {
          console.error('❌ FFmpeg subtitle overlay failed:', err2);
          return reject(err2);
        }

        console.log('✅ Subtitles added successfully.');
        resolve(outputPath);
      });
    });
  });
};
