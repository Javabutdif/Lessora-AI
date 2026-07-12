# Daily Report JSON Format Specification

## Feature overview

The daily AI report should return structured JSON so the backend can render the email from known fields instead of raw model prose.

## Required output

OpenAI should return a JSON object with:

- `summaryText`
- `detailedAnalysis`
- `highlights`

## Behavior

- the backend sends aggregated metrics to OpenAI
- the model returns JSON only
- the email renderer reads the JSON fields directly
- the email includes summary, detailed analysis, and a short highlights list

## Constraints

- keep the existing daily report flow
- avoid adding extra parsing layers
- keep the JSON shape small and stable
