const router = require("express").Router();
const AssesmentController = require("@/Controllers/AssesmentController");
const { validateFindTopProperties } = require("@/Requests/assesment");

router.get("/form-data", AssesmentController.getFormData);
router.post("/find-top-properties", validateFindTopProperties, AssesmentController.findTopProperties);

module.exports = router;
