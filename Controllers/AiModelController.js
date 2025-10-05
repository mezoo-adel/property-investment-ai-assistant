const AiModel = require("@/Models/AiModel");
const encryptDecrypt = require("@/utils/encryptDecrypt");
const { deactivateAllModels } = require("@/Services/AiModelService");

const store = async (req, res) => {
  let { name, secret_key } = req.body;

  let description = req.body.description;
  let is_active = req.body.is_active ?? true;
  secret_key = encryptDecrypt(secret_key, "encrypt");

  //deactivate other models
  if (is_active) await deactivateAllModels();

  const model = await AiModel.create({
    name,
    description,
    secret_key,
    is_active,
  });

  ({ name, description, is_active } = model);

  res.json({
    message: "Model created successfully",
    data: { name, description, is_active },
  });
};

module.exports = { store };
