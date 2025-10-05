
const router = require("express").Router();
const { fullPath } = require("@/utils/fileSystem");

router.get("/", (req, res) => {
  res.sendFile(fullPath("views/index.html"));
});

module.exports = router;