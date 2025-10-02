const router = require("express").Router();
const { store } = require("@/Controllers/AiModelController");

router.post("/", store);

module.exports = router;
