const router = require("express").Router();
const { store } = require("@/Controllers/AiModelController");
const { store: storeRequest } = require("@/Requests/AiModelRequest");

router.post("/", storeRequest, store);

module.exports = router;
