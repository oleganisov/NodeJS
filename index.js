const fs = require('fs');
const path = require('path');

const srcDir = process.argv[2];
const destDir = process.argv[3] || 'collection_sort';
const delFlag = process.argv[4] || 0; // 0 - don't remove source folder, 1 - remove source folder

if (!srcDir) {
  console.log('Не указан каталог источник');
  process.exit(1);
}
if (!fs.existsSync(srcDir)) {
  console.log('Каталог источник не существует');
  process.exit(1);
}

// create root destination folder
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir);
}
// create folder inside collection if not exist
const makeDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

const sortCollect = (dir) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const srcPath = path.join(dir, file);
    const state = fs.statSync(srcPath);
    if (state.isDirectory()) {
      sortCollect(srcPath);
    }
    if (state.isFile()) {
      const destPath = path.join(destDir, file[0].toLowerCase());

      makeDir(destPath);
      fs.copyFileSync(srcPath, path.join(destPath, file));
    }
  });
};

const removeSrcFiles = (dir) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const srcPath = path.join(dir, file);
    const state = fs.statSync(srcPath);
    if (state.isDirectory()) {
      removeSrcFiles(srcPath);
    }
    if (state.isFile()) {
      fs.unlinkSync(srcPath);
    }
  });
};

const removeEmptySrcDir = (dir) => {
  const isDir = fs.statSync(dir).isDirectory();
  if (!isDir) {
    return;
  }
  let files = fs.readdirSync(dir);
  console.log('read: ', dir, files);
  if (files.length > 0) {
    files.forEach((file) => {
      const srcPath = path.join(dir, file);
      removeEmptySrcDir(srcPath);
    });
    // re-evaluate files; after deleting subfolder
    // we may have parent folder empty now
    files = fs.readdirSync(dir);
    console.log('reread: ', dir, files);
  }
  if (files.length === 0) {
    console.log('remove: ', dir);
    fs.rmdirSync(dir);
  }
};

sortCollect(srcDir);

if (delFlag === '1') {
  removeSrcFiles(srcDir);
  removeEmptySrcDir(srcDir);
}
