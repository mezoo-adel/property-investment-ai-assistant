const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");

const checkDir = (dir) => fs.existsSync(dir);
const createDir = (dir) => fs.mkdirSync(dir);
const deleteDir = (dir) => fs.rmdirSync(dir);

const fullPath = (...target) => path.resolve(process.cwd(), ...target);
const read = (file) => fsPromises.readFile(file, "utf-8");
const write = (file, data) => fsPromises.writeFile(file, data);
const append = (file, data) => fsPromises.appendFile(file, data);
const deleteFile = (file) => fsPromises.unlink(file);

module.exports = {
  deleteFile,
  fullPath,
  read,
  write,
  append,
  checkDir,
  createDir,
  deleteDir,
};
