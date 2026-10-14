# TfL client

Fetches line status from the TfL Unified API and turns it into Gapwatch's types. Full guide: @../../../docs/tfl-api.md

Rules that always apply here:

- **Severity categories come from `severity.ts`.** Code anywhere in the app classifies a TfL severity code with `categorise()`, `isDisrupted()` or `compareSeverity()`, so the mapping lives in one place.
- **One status per line, the worst one.** TfL can report several statuses for a line at once; `parse.ts` keeps the worst.
- **`line_id` is the stable key.** Line names change (the Overground lines were renamed in 2024), so match and store by id.
