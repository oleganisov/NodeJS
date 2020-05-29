const fs = require('fs');
const path = require('path');

const srcDir = process.argv[2];
const destDir = process.argv[3] || 'collection_sort';
const delFlag = process.argv[4] || '0'; // 0 - don't remove source folder, 1 - remove source folder

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
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.log(err);
    }
    files.forEach((file) => {
      const srcPath = path.join(dir, file);
      const state = fs.statSync(srcPath);
      if (state.isDirectory()) {
        sortCollect(srcPath);
      }
      if (state.isFile()) {
        const letterIndex = 0;
        const destPath = path.join(destDir, file[letterIndex].toLowerCase());

        makeDir(destPath);
        fs.copyFile(srcPath, path.join(destPath, file), (err) => {
          if (err) {
            return console.log(err);
          }
        });
      }
    });
  });
};

const removeSrcFiles = (dir) => {
  fs.readdir(dir, (err, files) => {
    if (err) {
      return console.log(err);
    }
    files.forEach((file) => {
      const srcPath = path.join(dir, file);
      const state = fs.statSync(srcPath);
      if (state.isDirectory()) {
        removeSrcFiles(srcPath);
      }
      if (state.isFile()) {
        fs.unlink(srcPath, (err) => {
          if (err) {
            return console.log(err);
          }
        });
      }
    });
  });
};

const removeEmptySrcDir = (dir) => {
  let folders;
  const isDir = fs.statSync(dir).isDirectory();
  if (!isDir) {
    return;
  }
  fs.readdir(dir, (err, files) => {
    folders = files;
    if (err) {
      return console.log(err);
    }
    console.log('read: ', dir, folders);
    if (folders.length > 0) {
      folders.forEach((folder) => {
        const srcPath = path.join(dir, folder);
        removeEmptySrcDir(srcPath);
      });
      // re-evaluate files; after deleting subfolder
      // we may have parent folder empty now
      fs.readdir(dir, (err, files) => {
        if (err) {
          return console.log(err);
        }
        folders = files;
        console.log('reread: ', dir, folders);
      });
    }
    if (folders.length === 0) {
      fs.rmdir(dir, (err) => {
        if (err) {
          return console.log(err);
        }
        console.log('remove: ', dir);
      });
    }
  });
};

sortCollect(srcDir);

if (delFlag === '1') {
  removeSrcFiles(srcDir);
  removeEmptySrcDir(srcDir);
}
