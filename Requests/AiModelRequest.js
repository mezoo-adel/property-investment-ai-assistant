const store = (req, res, next) => {
  const errors = [];
  const payload = req.body;

  if (!payload?.name) errors.push({ name: "Name is required" });
  if (!payload?.secret_key)
    errors.push({ secret_key: "Secret key is required" });
  //   if (payload?.description == undefined) errors.push({ description: "Description key is missing" });
  //   if (payload?.is_active == undefined) errors.push({ is_active: "Is active key is missing" });

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  next();
};

module.exports = { store };
