const Prompt = require("@/Models/Prompt");

const store = async (req, res) => {
  let { name, prompts } = req.body;

  const model = await Prompt.create({
    name,
    prompts,
  });

  ({ name, prompts } = model);

  res.json({
    message: "Model created successfully",
    data: { name, prompts },
  });
};

module.exports = { store };
