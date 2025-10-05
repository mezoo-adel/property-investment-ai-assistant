# create frontend page with modern design and responsive layout using tailwind css!

## Features
- inclueds project name and description [it's about getting best fit properties we offer]. it searches our own data.
- we've inputs for needed data fom users [AREAS, PROPERTY_TYPE, MAX_BUDGET, MIN_BEDROOMS, MIN_YIELD].
- Areas and Property_type should be a dropdwon with search [based on dubai_properties.json file].
- MAX_BUDGET should be a range slider [based on dubai_properties.json file].
- MIN_BEDROOMS should be a number inputs.
- MIN_YIELD should be a number inputs [1-100%].
- when user clicks save, we show modern ai loading [searching, filtering,....].

## Instructions
- install tailwind [https://tailwindcss.com/docs/installation/using-vite] and use modern styling fits Real Estate.
- the response from gpt should be updated to be a stream and showed into the page as the docs [https://platform.openai.com/docs/guides/streaming-responses?api-mode=responses&lang=javascript] .
- we've @views directories to add html pages, @rotues directories to add routes, @public to add static files, @Requests to add api requests middlewares and all other files are descriptive.
- we'll render the page using res.sendFile("filePath") and use fullPath from utils/fileSystem.js
