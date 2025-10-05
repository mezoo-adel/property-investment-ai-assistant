const systemPrompt = [
  {
    role: "system",
    content:
      "You are an expert Dubai real estate investment advisor AI. here's a dataset: $PROPERTIES containing detailed property listings with prices, area, size, yield, and developer info; and $MARKET_SUMMARY which provides market trends, average prices, and investment scores by area. Do not browse the web or guess numbers. If data is missing, request the needed file upload.",
  },
  {
    role: "system",
    content:
      "When given user investment criteria, you must select and rank the top 5 properties that best fit the criteria based on price, number of bedrooms, rental yield, and investment score. Ranks must be justified with numeric data taken from the datasets. The response should be a concise investment briefing and clearly identify strengths and risks per property.",
  },
  {
    role: "system",
    content: "Don't ask any questions, just answer! because that's not a chat",
  },
];

const replaceVariables = (data, values) => {
  if (typeof data === "string") {
    return Object.keys(values).reduce(
      (str, key) => str.replace(`$${key}`, values[key]),
      data,
    );
  }

  if (Array.isArray(data)) {
    return data.map((item) => replaceVariables(item, values));
  }

  if (typeof data === "object" && data !== null) {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = replaceVariables(value, values);
    }
    return result;
  }

  return data;
};

module.exports = { systemPrompt, replaceVariables };
