const { fullPath, read } = require("@/utils/fileSystem");
const OpenAI = require("openai");
const prompts = require("@/public/dataset/ai_prompts.json");
const {
  systemPrompt,
  replaceVariables,
} = require("@/Services/AssesmentService");

const findTopProperties = async (req, res) => {
  try {
    console.log("findTopProperties called with:", req.body);

    // Parse properties data
    let allProperties = require("@/public/dataset/dubai_properties.json");
    let market_summary = require("@/public/dataset/market_summary.json");

    // Extract filter criteria from request
    const { areas, property_type, max_budget, min_bedrooms, min_yield } =
      req.body;

    console.log("Filter criteria:", {
      areas,
      property_type,
      max_budget,
      min_bedrooms,
      min_yield,
    });

    // Filter properties based on criteria
    let filteredProperties = allProperties.filter((property) => {
      // Filter by area if specified
      if (areas && areas.trim() !== "" && property.area !== areas) {
        return false;
      }

      // Filter by property type if specified
      if (
        property_type &&
        property_type.trim() !== "" &&
        property.property_type !== property_type
      ) {
        return false;
      }

      // Filter by max budget if specified
      if (max_budget && property.price_aed > parseInt(max_budget)) {
        return false;
      }

      // Filter by minimum bedrooms if specified
      if (min_bedrooms && property.bedrooms < parseInt(min_bedrooms)) {
        return false;
      }

      // Filter by minimum yield if specified
      if (min_yield && property.rental_yield_percent < parseFloat(min_yield)) {
        return false;
      }

      return true;
    });

    console.log(
      `Filtered ${filteredProperties.length} properties from ${allProperties.length} total properties`,
    );

    // Sort by investment score (highest first)
    const topProperties = filteredProperties.sort(
      (a, b) => b.investment_score - a.investment_score,
    );
    // .slice(0, 10);  take top 10

    console.log(`Selected top ${topProperties.length} properties`);

    // Prepare AI input with filtered properties
    let input = [...systemPrompt, ...prompts["find_top_properties"]];

    input = replaceVariables(input, {
      AREAS: areas,
      PROPERTY_TYPE: property_type,
      MAX_BUDGET: max_budget,
      MIN_BEDROOMS: min_bedrooms,
      MIN_YIELD: min_yield,
      PROPERTIES: JSON.stringify(topProperties),
      MARKET_SUMMARY: JSON.stringify(market_summary),
    });

    console.log("OpenAI API Key exists:", !!process.env.OPENAI_API_KEY);
    console.log("OpenAI Model:", process.env.OPENAI_MODEL);

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log("Starting OpenAI API call...");

    try {
      const completion = await client.responses.create({
        input,
        model: process.env.OPENAI_MODEL,
      });

      const content = completion.output_text || "No response generated";

      console.log("AI analysis completed successfully");

      // Return regular JSON response
      res.json({
        content,
        success: true,
        message: "Analysis completed successfully",
        propertiesAnalyzed: topProperties.length,
        totalPropertiesFiltered: filteredProperties.length,
        filters: {
          areas,
          property_type,
          max_budget,
          min_bedrooms,
          min_yield,
        },
      });
    } catch (aiError) {
      console.error("OpenAI API error:", aiError.message);

      res.status(500).json({
        success: false,
        message: `AI service error: ${aiError.message}`,
        error: aiError.message,
      });
    }
  } catch (error) {
    console.error("Error in findTopProperties:", error);
    console.error("Error details:", error.message);

    res.status(500).json({
      success: false,
      message: "Error processing your request",
      error: error.message,
    });
  }
};

const getFormData = async (req, res) => {
  try {
    const properties = require("@/public/dataset/dubai_properties.json");

    const areas = [...new Set(properties.map((p) => p.area))];
    const propertyTypes = [...new Set(properties.map((p) => p.property_type))];
    const prices = properties.map((p) => p.price_aed);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    res.json({
      areas,
      propertyTypes,
      minPrice,
      maxPrice,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching form data", error });
  }
};

module.exports = {
  findTopProperties,
  getFormData,
};
