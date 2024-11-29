//使用方法：node images.js /path/to/your/image.png
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 检查是否提供了目标图片
if (process.argv.length < 3) {
  console.log('用法: node images.js <image_path> [output_directory]');
  process.exit(1);
}

// 获取目标图片路径
const imagePath = process.argv[2];

// 获取输出目录（如果提供）
const outputDir = process.argv[3] || '.';

// 检查目标图片是否存在
if (!fs.existsSync(imagePath)) {
  console.log(`File not found: ${imagePath}`);
  process.exit(1);
}

// 如果输出目录不存在，则创建它
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 定义目标尺寸和文件名
const sizes = [196, 192, 144, 96, 72, 48, 36];

// 循环调整图片尺寸并重命名
sizes.forEach(size => {
  const outputFileName = path.join(outputDir, `${size}.png`);
  sharp(imagePath)
    .resize(size, size)
    .toFile(outputFileName, (err, info) => {
      if (err) {
        console.error(`Error creating ${outputFileName}:`, err);
      } else {
        console.log(`Created ${outputFileName}`);
      }
    });
});

console.log('所有图像均已调整大小并保存。');