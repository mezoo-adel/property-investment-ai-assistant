const deactivateAllModels = async () => {
  await AiModel.updateMany({ is_active: true }, { is_active: false });
};

const getActiveModel = async () => {
  const model = await AiModel.findOne({ is_active: true });
  model.secret_key = encryptDecrypt(model.secret_key, "decrypt");
  return model;
};

module.exports = {
  deactivateAllModels,
  getActiveModel,
};
