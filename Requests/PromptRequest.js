const store = (req, res, next) => {
  const errors = [];
  const payload = req.body;

  if (!payload?.name) errors.push({ name: "Name is required" });
  if (!payload?.prompts) errors.push({ prompts: "Prompts is required" });

  if (payload?.prompts?.length)
    payload.prompts.forEach((prompt) => {
      if (!prompt.role) errors.push({ role: "Role is required" });
      if (!prompt.content) errors.push({ content: "Content is required" });
    });

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
};

module.exports = { store };
