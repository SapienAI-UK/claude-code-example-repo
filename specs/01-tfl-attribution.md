# 01 · Credit TfL on every page

**Shows:** the agent loop (find, read, edit, check), your first permission prompts, planning a small change

## Goal

TfL's open data terms ask apps that use its data to credit it. Add the credit once so that it appears on every page of Gapwatch.

## Context

- Pages live in `src/app/`
- TfL open data terms: https://tfl.gov.uk/info-for/open-data-users/

## Requirements

- Every page shows "Powered by TfL Open Data", linking to TfL's open data page.
- It's added in one place, not copied into each page.
- It's visible to signed-out visitors too, on the login page.

## Acceptance criteria

- [ ] The credit appears on `/login`, `/`, `/trends` and `/admin`
- [ ] The credit is a link to TfL's open data page
- [ ] The markup exists in exactly one file
- [ ] `npm test`, `npm run lint` and `npm run build` pass

## Out of scope

- Styling beyond the existing plain look (the brand comes later)

## Try it

> "Add a 'Powered by TfL Open Data' credit to every page."

Then try the same request again on a fresh branch, starting in plan mode (Shift+Tab), and compare.

## Watch for

- You didn't say which file to change. How does Claude find it? Note the order of tools it uses: search, read, edit, check.
- Does Claude run lint, tests or build before it says it's done? Where did it learn that's expected?
- Which commands run without asking, and which trigger a permission prompt? Look for the answer in `.claude/settings.json`.
- Was plan mode worth it for a change this small?
