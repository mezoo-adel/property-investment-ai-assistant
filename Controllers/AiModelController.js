const AiModel = require("@/Models/AiModel");

const store = async (req, res) => {
  const model = await AiModel.create(req.body);
  res.json({ message: "Model created successfully", model });
};

module.exports = { store };
