const validateFindTopProperties = (req, res, next) => {
    const { areas, property_type, max_budget, min_bedrooms, min_yield } = req.body;
    const errors = [];

    // Check required fields
    if (!areas || areas.trim() === '') {
        errors.push('Area is required');
    }
    
    if (!property_type || property_type.trim() === '') {
        errors.push('Property type is required');
    }
    
    if (!max_budget) {
        errors.push('Maximum budget is required');
    }
    
    if (!min_bedrooms) {
        errors.push('Minimum bedrooms is required');
    }
    
    if (!min_yield) {
        errors.push('Minimum yield is required');
    }

    // Validate numeric fields
    const budgetNum = parseFloat(max_budget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
        errors.push('Budget must be a positive number');
    }

    const bedroomsNum = parseInt(min_bedrooms);
    if (isNaN(bedroomsNum) || bedroomsNum < 0 || bedroomsNum > 10) {
        errors.push('Bedrooms must be a number between 0 and 10');
    }

    const yieldNum = parseFloat(min_yield);
    if (isNaN(yieldNum) || yieldNum < 0 || yieldNum > 100) {
        errors.push('Yield must be a number between 0 and 100');
    }

    if (errors.length > 0) {
        return res.status(400).json({ 
            message: 'Validation failed', 
            errors: errors 
        });
    }

    // Convert to proper types
    req.body.max_budget = budgetNum;
    req.body.min_bedrooms = bedroomsNum;
    req.body.min_yield = yieldNum;

    next();
};

module.exports = {
    validateFindTopProperties,
};
