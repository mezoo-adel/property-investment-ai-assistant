const { fullPath, read } = require("@/utils/fileSystem");
const OpenAI = require("openai");
const prompts = require("@/public/dataset/ai_prompts.json");
const {
  systemPrompt,
  replaceVariables,
} = require("@/Services/AssesmentService");

const findTopProperties = async (req, res) => {
  let input = [...systemPrompt, ...prompts["find_top_properties"]];
  let properties = await read(fullPath("public/dataset/dubai_properties.json"));
  let market_summary = await read(
    fullPath("public/dataset/market_summary.json"),
  );

  // Replace variables across the nested structure
  input = replaceVariables(input, {
    AREAS: "Jumeirah",
    PROPERTY_TYPE: "Apartment",
    MAX_BUDGET: "1000000",
    MIN_BEDROOMS: "2",
    MIN_YIELD: "5",
    PROPERTIES: properties,
    MARKET_SUMMARY: market_summary,
  });

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL,
    input,
  });
};

module.exports = {
  findTopProperties,
};
