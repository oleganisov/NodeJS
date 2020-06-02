const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const removeEmptySrcDir = require('./rmEmptyDir');

const srcDir = process.argv[2];
const destDir = process.argv[3] || 'collection_sort';
const delFlag = process.argv[4] || '0'; // 0 - don't remove source folder, 1 - remove source folder

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const copyFile = promisify(fs.copyFile);
const rename = promisify(fs.rename);
const mkdir = promisify(fs.mkdir);

const sortCollect = async (dir) => {
  const files = await readdir(dir);

  await Promise.all(
    files.map(async (file) => {
      const srcPath = path.join(dir, file);
      const stats = await stat(srcPath);
      if (stats.isDirectory()) {
        sortCollect(srcPath);
      } else {
        const letterIndex = 0;
        const destPath = path.join(destDir, file[letterIndex].toLowerCase());

        await mkdir(destPath, { recursive: true });
        if (delFlag === '1') {
          await rename(srcPath, path.join(destPath, file));
        } else {
          await copyFile(srcPath, path.join(destPath, file));
        }
      }
    })
  );
};

(async () => {
  try {
    await sortCollect(srcDir);
    if (delFlag === '1') {
      await removeEmptySrcDir(srcDir);
    }
  } catch (err) {
    console.log(err);
  }
})();
