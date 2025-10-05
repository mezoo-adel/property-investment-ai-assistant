document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing form...");

  const form = document.getElementById("property-form");
  const areasSelect = document.getElementById("areas");
  const propertyTypeSelect = document.getElementById("property_type");
  const maxBudgetSlider = document.getElementById("max_budget");
  const maxBudgetValue = document.getElementById("max_budget_value");
  const loadingDiv = document.getElementById("loading");
  const resultsDiv = document.getElementById("results");

  // Button elements
  const submitBtn = document.getElementById("submit-btn");
  const btnText = document.getElementById("btn-text");
  const btnLoading = document.getElementById("btn-loading");
  const loadingText = document.getElementById("loading-text");

  console.log("Elements found:", {
    form: !!form,
    areasSelect: !!areasSelect,
    propertyTypeSelect: !!propertyTypeSelect,
    maxBudgetSlider: !!maxBudgetSlider,
    maxBudgetValue: !!maxBudgetValue,
    submitBtn: !!submitBtn,
  });

  // AI-like loading messages
  const loadingMessages = [
    "Initializing AI analysis...",
    "Scanning property database...",
    "Analyzing market trends...",
    "Calculating investment scores...",
    "Evaluating rental yields...",
    "Comparing property values...",
    "Generating recommendations...",
    "Finalizing analysis...",
  ];

  let currentMessageIndex = 0;
  let loadingInterval = null;

  // Fetch data for form controls
  const populateFormControls = async () => {
    try {
      console.log("Fetching form data...");
      const response = await fetch("/api/assesment/form-data");
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Form data received:", data);

      // Clear existing options and add default option for areas
      areasSelect.innerHTML = "";
      const defaultAreaOption = document.createElement("option");
      defaultAreaOption.value = "";
      defaultAreaOption.textContent = "Select an area";
      areasSelect.appendChild(defaultAreaOption);

      // Populate areas
      data.areas.forEach((area) => {
        const option = document.createElement("option");
        option.value = area;
        option.textContent = area;
        areasSelect.appendChild(option);
      });

      // Clear existing options and add default option for property types
      propertyTypeSelect.innerHTML = "";
      const defaultTypeOption = document.createElement("option");
      defaultTypeOption.value = "";
      defaultTypeOption.textContent = "Select property type";
      propertyTypeSelect.appendChild(defaultTypeOption);

      // Populate property types
      data.propertyTypes.forEach((type) => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        propertyTypeSelect.appendChild(option);
      });

      // Set up budget slider
      maxBudgetSlider.min = data.minPrice;
      maxBudgetSlider.max = data.maxPrice;
      maxBudgetSlider.value = Math.floor(data.maxPrice * 0.7); // Set to 70% of max as default
      maxBudgetValue.textContent = `${Number(
        maxBudgetSlider.value,
      ).toLocaleString()} AED`;

      console.log("Form populated successfully");
    } catch (error) {
      console.error("Error populating form:", error);
      // Show user-friendly error
      areasSelect.innerHTML = "<option>Error loading areas</option>";
      propertyTypeSelect.innerHTML =
        "<option>Error loading property types</option>";
    }
  };

  // Form validation function
  const validateForm = () => {
    const errors = [];

    if (!areasSelect.value) {
      errors.push("Please select an area");
    }

    if (!propertyTypeSelect.value) {
      errors.push("Please select a property type");
    }

    const minBedrooms = parseInt(document.getElementById("min_bedrooms").value);
    if (isNaN(minBedrooms) || minBedrooms < 0) {
      errors.push("Please enter a valid number of bedrooms (minimum 0)");
    }

    const minYield = parseFloat(document.getElementById("min_yield").value);
    if (isNaN(minYield) || minYield < 0 || minYield > 100) {
      errors.push("Please enter a valid yield percentage (0-100)");
    }

    return errors;
  };

  // Enhanced loading state management
  const startLoading = () => {
    submitBtn.disabled = true;
    btnText.classList.add("hidden");
    btnLoading.classList.remove("hidden");
    loadingDiv.style.display = "block";
    resultsDiv.style.display = "none";
    resultsDiv.innerHTML = "";

    // Start cycling through loading messages
    currentMessageIndex = 0;
    loadingText.textContent = loadingMessages[0];

    // Clear any existing interval
    if (loadingInterval) {
      clearInterval(loadingInterval);
    }

    loadingInterval = setInterval(() => {
      currentMessageIndex = (currentMessageIndex + 1) % loadingMessages.length;
      loadingText.textContent = loadingMessages[currentMessageIndex];
    }, 1500); // Faster cycling for better UX
  };

  const stopLoading = () => {
    submitBtn.disabled = false;
    btnText.classList.remove("hidden");
    btnLoading.classList.add("hidden");
    loadingDiv.style.display = "none";

    if (loadingInterval) {
      clearInterval(loadingInterval);
      loadingInterval = null;
    }
  };

  // Handle regular JSON response
  const handleResponse = async (response) => {
    resultsDiv.style.display = "block";
    resultsDiv.innerHTML =
      '<div class="prose max-w-none"><div class="animate-pulse text-blue-600">🤖 AI is analyzing your request...</div></div>';

    try {
      const data = await response.json();
      console.log("Response received:", data);

      if (data.success) {
        // Display the AI analysis content
        const content = data.content || "No analysis content received";

        // Show analysis statistics
        const statsHtml = `
                    <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 class="text-lg font-semibold text-blue-800 mb-2">Analysis Summary</h3>
                        <div class="grid grid-cols-2 gap-4 text-sm text-blue-700">
                            <div><strong>Properties Analyzed:</strong> ${
                              data.propertiesAnalyzed || 0
                            }</div>
                            <div><strong>Total Properties Found:</strong> ${
                              data.totalPropertiesFiltered || 0
                            }</div>
                        </div>
                        ${
                          data.filters
                            ? `
                            <div class="mt-3 text-sm text-blue-600">
                                <strong>Applied Filters:</strong>
                                ${
                                  data.filters.areas
                                    ? `Area: ${data.filters.areas}, `
                                    : ""
                                }
                                ${
                                  data.filters.property_type
                                    ? `Type: ${data.filters.property_type}, `
                                    : ""
                                }
                                ${
                                  data.filters.max_budget
                                    ? `Max Budget: ${Number(
                                        data.filters.max_budget,
                                      ).toLocaleString()} AED, `
                                    : ""
                                }
                                ${
                                  data.filters.min_bedrooms
                                    ? `Min Bedrooms: ${data.filters.min_bedrooms}, `
                                    : ""
                                }
                                ${
                                  data.filters.min_yield
                                    ? `Min Yield: ${data.filters.min_yield}%`
                                    : ""
                                }
                            </div>
                        `
                            : ""
                        }
                    </div>
                `;

        // Render markdown content
        try {
          const htmlContent = marked.parse(content);
          resultsDiv.innerHTML = `<div class="prose max-w-none">${statsHtml}${htmlContent}</div>`;
        } catch (markdownError) {
          // Fallback to plain text if markdown parsing fails
          console.warn(
            "Markdown parsing failed, using plain text:",
            markdownError,
          );
          resultsDiv.innerHTML = `<div class="prose max-w-none">${statsHtml}<pre class="whitespace-pre-wrap">${content}</pre></div>`;
        }

        console.log("Analysis displayed successfully");
      } else {
        // Handle error response
        throw new Error(data.message || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Response handling error:", error);
      resultsDiv.innerHTML = `<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                <strong>Error:</strong> ${error.message}
            </div>`;
    }
  };

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      alert("Please fix the following errors:\n\n" + errors.join("\n"));
      return;
    }

    startLoading();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/assesment/find-top-properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          alert("Validation errors:\n\n" + errorData.errors.join("\n"));
        } else {
          alert("Server error: " + (errorData.message || "Unknown error"));
        }
        return;
      }

      // Handle regular JSON response
      await handleResponse(response);
    } catch (error) {
      console.error("Error fetching properties:", error);
      resultsDiv.innerHTML = `<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                <strong>Connection Error:</strong> ${error.message}
            </div>`;
      resultsDiv.style.display = "block";
    } finally {
      stopLoading();
    }
  });

  // Update budget value display
  maxBudgetSlider.addEventListener("input", () => {
    maxBudgetValue.textContent = `${Number(
      maxBudgetSlider.value,
    ).toLocaleString()} AED`;
  });

  populateFormControls();
});
