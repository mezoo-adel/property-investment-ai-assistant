const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello World From API" });
});

router.use("/ai-models", require("./ai-models"));
router.use("/prompts", require("./prompts"));
router.use("/assesment", require("./assesment"));

module.exports = router;
