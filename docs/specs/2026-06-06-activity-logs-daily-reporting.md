# Activity Logs and Daily Reporting Specification

## Feature overview

Lessora AI will record key user activity in a raw logs collection, then run a daily scheduler that aggregates the previous day's activity into a daily metric record. That metric will be sent to OpenAI for analysis and emailed to the owner account as a friendly founder-style report.

## Requested report settings

- recipient email: `jamesgenabio31@gmail.com`
- report schedule: `22:00 PST`
- audience: owner only
- OpenAI output: short summary and detailed analysis
- tone: friendly, founder voice for Lessora AI

## Current state

- user login and registration already exist in the app
- lesson plan generation already exists in the app
- no dedicated logs collection exists for the requested events
- no daily metric snapshot collection exists for the requested reporting flow
- no scheduler exists yet for this reporting use case

## Implementation approach

### Logs schema

Create a single raw logs collection that stores event records for:

- user login
- user registration
- lesson plan generated
- lesson plan subject/category selected or derived

Recommended fields:

- `userId`
- `eventType`
- `subject`
- `metadata`
- `createdAt`

Keep `metadata` flexible so additional event details can be added without schema churn.

### Daily metric schema

Create a daily summary collection that stores one aggregated record per day.

Recommended fields:

- `date`
- `totalLogins`
- `totalRegistrations`
- `totalLessonPlansGenerated`
- `lessonPlansBySubject`
- `uniqueActiveUsers`
- `summaryText`
- `detailedAnalysis`
- `emailStatus`
- `generatedAt`

This schema should store counts and AI output only, not the full raw log history.

### Scheduler

Create a scheduled service that runs at the end of the day in Pacific time.

Scheduler behavior:

1. fetch the relevant logs for the reporting window
2. aggregate counts on the server
3. write a new daily metric record
4. send the aggregated summary to OpenAI
5. store the generated summary and analysis
6. email the final report to `jamesgenabio31@gmail.com`

### OpenAI prompt

The prompt should ask for:

- a friendly, encouraging tone
- a founder-style perspective for Lessora AI
- a short executive summary
- a detailed analysis section
- practical observations and opportunities

The server should send only the aggregated metrics, not raw log documents, to keep the prompt focused.

## Behavior

- user activity is stored as raw logs as soon as the event occurs
- the scheduler runs once per day at `22:00 PST`
- the server converts logs into counts before calling OpenAI
- the final email is intended for the owner only
- the output should include both a short summary and a detailed analysis

## Dependencies

- MongoDB for the logs and daily metric collections
- existing lesson plan generation flow for event capture
- existing OpenAI integration
- existing email delivery service

## Testing

- verify logs are written when users log in, register, and generate lesson plans
- verify the daily aggregation counts match the raw logs
- verify the scheduler runs at the intended Pacific time
- verify the OpenAI response is stored in the daily metric record
- verify the email is sent to the configured recipient
