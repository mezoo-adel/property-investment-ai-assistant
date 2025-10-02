const { fullPath, append, checkDir, createDir } = require("@/utils/fileSystem");

const fileName = new Date().toISOString().split("T")[0]; //? 2025-10-01

const directory = fullPath(`logs`);
if (!checkDir(directory)) createDir(directory);

module.exports = (message) => {
  const currentTime = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
  append(fullPath(`logs`, `${fileName}.log`), `${currentTime}: ${message}\n`);
};
