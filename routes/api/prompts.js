const router = require("express").Router();
const { store } = require("@/Controllers/PromptController");
const { store: storeRequest } = require("@/Requests/PromptRequest");

router.post("/", storeRequest, store);

module.exports = router;
