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

  // Format property analysis content for better readability
  const formatPropertyAnalysis = (content) => {
    if (!content) return '<p>No analysis content received</p>';
    
    // Split content into sections and format
    let formattedContent = content
      // Add line breaks after periods followed by capital letters (new sentences)
      .replace(/\.\s+([A-Z])/g, '.<br><br>$1')
      // Format property IDs and codes
      .replace(/(DXB\d+)/g, '<strong class="text-blue-600">$1</strong>')
      // Format prices in AED
      .replace(/AED\s+([\d,]+)/g, '<span class="font-semibold text-green-600">AED $1</span>')
      // Format percentages
      .replace(/(\d+\.?\d*%)/g, '<span class="font-semibold text-purple-600">$1</span>')
      // Format property areas/locations
      .replace(/—\s*([A-Za-z\s]+?)(?=\s|$)/g, '— <em class="text-indigo-600">$1</em>')
      // Format investment scores
      .replace(/Investment score:\s*([\d.]+)/g, 'Investment score: <strong class="text-orange-600">$1</strong>')
      // Format yields
      .replace(/Yield:\s*([\d.]+%)/g, 'Yield: <strong class="text-green-600">$1</strong>')
      // Format completion years
      .replace(/Completion:\s*(\d{4})/g, 'Completion: <strong>$1</strong>')
      // Add spacing around main sections
      .replace(/(Top \d+ selections|Portfolio summary|Investment briefing|Ranking method)/g, '<h3 class="text-lg font-bold text-gray-800 mt-6 mb-3">$1</h3>')
      // Format strengths and risks
      .replace(/Strengths:/g, '<strong class="text-green-700">Strengths:</strong>')
      .replace(/Risks:/g, '<strong class="text-red-700">Risks:</strong>')
      // Format price ranges and specifications
      .replace(/(\d+\s*BR,?\s*\d+\s*BA)/g, '<span class="bg-gray-100 px-2 py-1 rounded text-sm">$1</span>')
      .replace(/(\d+,?\d*\s*sqft)/g, '<span class="bg-blue-100 px-2 py-1 rounded text-sm">$1</span>');

    // Wrap in proper HTML structure
    return `
      <div class="property-analysis">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 md:p-6 rounded-lg border border-blue-200 mb-4 md:mb-6">
          <h2 class="text-lg md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">🏢 Property Investment Analysis</h2>
          <div class="text-gray-700 leading-relaxed space-y-2 md:space-y-4 text-sm md:text-base">
            ${formattedContent}
          </div>
        </div>
      </div>
    `;
  };

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

  // Clear field error
  const clearFieldError = (fieldId) => {
    const errorDiv = document.getElementById(`${fieldId}-error`);
    const field = document.getElementById(fieldId);
    if (errorDiv) {
      errorDiv.classList.add('hidden');
      errorDiv.textContent = '';
    }
    if (field) {
      field.classList.remove('border-red-500');
      field.classList.add('border-gray-300');
    }
  };

  // Show field error
  const showFieldError = (fieldId, message) => {
    const errorDiv = document.getElementById(`${fieldId}-error`);
    const field = document.getElementById(fieldId);
    if (errorDiv) {
      errorDiv.classList.remove('hidden');
      errorDiv.textContent = message;
    }
    if (field) {
      field.classList.add('border-red-500');
      field.classList.remove('border-gray-300');
    }
  };

  // Validate individual field
  const validateField = (fieldId) => {
    clearFieldError(fieldId);
    const field = document.getElementById(fieldId);
    let isValid = true;

    switch (fieldId) {
      case 'areas':
        if (!field.value || field.value.trim() === '') {
          showFieldError(fieldId, 'Please select an area');
          isValid = false;
        }
        break;
      
      case 'property_type':
        if (!field.value || field.value.trim() === '') {
          showFieldError(fieldId, 'Please select a property type');
          isValid = false;
        }
        break;
      
      case 'min_bedrooms':
        const bedrooms = parseInt(field.value);
        if (isNaN(bedrooms) || bedrooms < 0 || bedrooms > 10) {
          showFieldError(fieldId, 'Please enter a valid number of bedrooms (0-10)');
          isValid = false;
        }
        break;
      
      case 'min_yield':
        const yield_ = parseFloat(field.value);
        if (isNaN(yield_) || yield_ < 0 || yield_ > 100) {
          showFieldError(fieldId, 'Please enter a valid yield percentage (0-100)');
          isValid = false;
        }
        break;
    }

    return isValid;
  };

  // Form validation function
  const validateForm = () => {
    const fields = ['areas', 'property_type', 'min_bedrooms', 'min_yield'];
    let allValid = true;

    fields.forEach(fieldId => {
      if (!validateField(fieldId)) {
        allValid = false;
      }
    });

    return allValid;
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
                    <div class="mb-4 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 class="text-base md:text-lg font-semibold text-blue-800 mb-2">Analysis Summary</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm text-blue-700">
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
                            <div class="mt-3 text-xs md:text-sm text-blue-600">
                                <strong>Applied Filters:</strong>
                                <div class="mt-1 flex flex-wrap gap-1">
                                ${
                                  data.filters.areas
                                    ? `<span class="bg-blue-100 px-2 py-1 rounded text-xs">Area: ${data.filters.areas}</span>`
                                    : ""
                                }
                                ${
                                  data.filters.property_type
                                    ? `<span class="bg-blue-100 px-2 py-1 rounded text-xs">Type: ${data.filters.property_type}</span>`
                                    : ""
                                }
                                ${
                                  data.filters.max_budget
                                    ? `<span class="bg-blue-100 px-2 py-1 rounded text-xs">Budget: ${Number(
                                        data.filters.max_budget,
                                      ).toLocaleString()} AED</span>`
                                    : ""
                                }
                                ${
                                  data.filters.min_bedrooms
                                    ? `<span class="bg-blue-100 px-2 py-1 rounded text-xs">Bedrooms: ${data.filters.min_bedrooms}+</span>`
                                    : ""
                                }
                                ${
                                  data.filters.min_yield
                                    ? `<span class="bg-blue-100 px-2 py-1 rounded text-xs">Yield: ${data.filters.min_yield}%+</span>`
                                    : ""
                                }
                                </div>
                            </div>
                        `
                            : ""
                        }
                    </div>
                `;

        // Format and render content
        const formattedContent = formatPropertyAnalysis(content);
        resultsDiv.innerHTML = `<div class="prose max-w-none">${statsHtml}${formattedContent}</div>`;

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

  // Add real-time validation event listeners
  const addValidationListeners = () => {
    // Validate on blur (when user leaves field)
    ['areas', 'property_type', 'min_bedrooms', 'min_yield'].forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener('blur', () => validateField(fieldId));
        field.addEventListener('change', () => validateField(fieldId));
      }
    });

    // Clear errors on focus
    ['areas', 'property_type', 'min_bedrooms', 'min_yield'].forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener('focus', () => clearFieldError(fieldId));
      }
    });
  };

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      // Scroll to first error field
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
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
  addValidationListeners();
});
