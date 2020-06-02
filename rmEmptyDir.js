const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const rmdir = promisify(fs.rmdir);

const removeEmptySrcDir = async (dir) => {
  const stats = await stat(dir);
  if (!stats.isDirectory()) {
    return;
  }
  let files = await readdir(dir);
  console.log('read: ', dir, files);
  if (files.length > 0) {
    const recursiveRemovalPromises = files.map((file) =>
      removeEmptySrcDir(path.join(dir, file))
    );
    await Promise.all(recursiveRemovalPromises);

    // re-evaluate files; after deleting subfolder
    // we may have parent folder empty now
    files = await readdir(dir);
    console.log('reread: ', dir, files);
  }

  if (files.length === 0) {
    console.log('remove: ', dir);
    await rmdir(dir);
  }
};

module.exports = removeEmptySrcDir;
