# AI-Powered Dubai Property Investment Assistant

## 📌 Project Idea & Requirements

**Goal:** Build a Node.js platform for smart real estate investment analysis and property exploration, utilizing AI-powered insights and real Dubai market data—without relying on online search or scraping.

**Key Features:**
- File upload for market datasets and property PDF documents
- AI functions that analyze, compare, and recommend properties based on available data
- REST API for property queries, analytics, and user interactions
- Modern, scalable backend codebase (ready for expansion to NestJS)

**Requirements:**
1. Users can upload data files (CSV, JSON, PDF) containing Dubai property data and investment reports.
2. Users can query and filter properties using REST endpoints (budget, location, type, yield, etc).
3. AI-powered endpoints provide:
   - Investment analysis for individual properties
   - Recommendations based on user preferences
   - Comparison of multiple properties
   - Document analysis for uploaded property PDFs
4. Real-time notifications and intelligent feedback for users.

---

## 📊 About the Data

This project uses pre-provided real estate data files:
- **`dubai_properties_dataset.csv` / `json`**: Contains 426+ sample property listings for Dubai, with fields like area, type, price, yield, developer, size, amenities, and investment scores.
- **`Dubai-Real-Estate-Dataset-Q1-2025.pdf`**: Official market report useful for sample document analysis and AI extraction of insights.
- **`market_summary.json`**: General statistics about the Dubai property market for contextual analysis.

**How It's Used:**
- All property search, AI analysis, and recommendation endpoints depend on these local data files, **not online queries or scraping**—making the system portable and demo-ready.

---

## 🧠 System Analysis

**Inputs:**
- Uploaded CSV/JSON—structured listings
- Uploaded PDFs—market or property reports
- User request parameters (budget, area, type, investment goal)

**Processing (Core Logic):**
- Load and parse data files into in-memory collections
- API routes allow users to:
   - List and filter properties
   - Analyze investment return and risks
   - Upload and parse property documents
   - Generate AI-powered advice (using prompt functions)
   - Compare multiple investment options

**Outputs:**
- Recommended property selections with scoring and AI explanations
- Detailed analytics (ROI, growth, risk, pricing, etc)
- Parsed/extracted document highlights
- User alerts or notifications

---

## 🏗 Design & Structure

```
dubai-property-ai/
├── server.js                   # Main Express server entry
├── package.json                # Project dependencies
├── routes/
│   ├── properties.js           # Property search, filter, compare
│   ├── ai-analysis.js          # AI endpoints (recommendation, analysis, comparison)
│   ├── file-upload.js          # Document/file upload endpoints
│   └── market-data.js          # Market stats & summary endpoints
├── services/
│   ├── dataProcessor.js        # Utils for loading/parsing CSV/JSON/PDF
│   ├── aiService.js            # AI prompt logic & OpenAI interaction
│   └── calculationService.js   # ROI, risk, and growth analysis
├── data/
│   ├── dubai_properties_dataset.json
│   ├── dubai_properties_dataset.csv
│   ├── market_summary.json
│   └── Dubai-Real-Estate-Dataset-Q1-2025.pdf
├── uploads/                    # For uploaded property docs
└── public/                     # Minimal frontend (optional)
    ├── index.html
    └── app.js
```

**Design Considerations:**
- Clean, modular code for simple migration to NestJS or other stacks
- All major Node.js crash course concepts applied (file system, events, streams, async, REST, JWT, etc)
- AI is used for *analysis logic*, not for searching or sourcing data
- Can be extended with new data uploads at any time

---

## 🚀 Summary

This project is both market- and interview-ready, showing:
- Mastery of Node.js and full-stack architecture
- AI prompt engineering and document intelligence
- UAE-centric, high-impact PropTech product skills
- Strong separation of data layer, business logic, and presentation layer

You can now start implementing based on the structure above!
