# Voice and tone

Gapwatch talks like a calm, well-informed station supervisor: plain, specific and on the passenger's side.

## Principles

1. **Lead with impact.** What does this mean for my journey? Put the line and the effect first.
2. **Be specific.** Name the line, the section and the effect. "Severe delays between Paddington and Heathrow" beats "Service disruption".
3. **Stay calm.** No exclamation marks, no emoji, no "Uh oh", no alarm words ("chaos", "nightmare").
4. **Plain British English.** Short sentences. Sentence case for labels and headings. Use "towards" and "programme", and avoid American spellings.
5. **Don't blame or joke.** Delays are frustrating; don't make light of them.

## Formats

- Times: 24-hour, "08:14". Dates: "Mon 6 Oct". Say which time zone when it isn't obvious ("Times are UTC").
- Numbers: UK style, "1,234". Money in pounds: "£2.80".
- Line names as TfL writes them: "Elizabeth line", "Hammersmith & City", "DLR".
- Percentages: "14%" (no decimals in the UI).

## Examples

| Situation | Do | Don't |
|-----------|----|-------|
| Everything fine | All lines running normally | Woohoo, no delays today! 🎉 |
| One line delayed | Minor delays on the Central line | Central line is having a bad day |
| Severe | Severe delays between Paddington and Heathrow | DISRUPTION!!! |
| No data yet | No history yet. The poller adds a snapshot every 2 minutes. | Nothing to see here |
| Login failed | That username and password don't match. | Invalid credentials. Error 401 |
| Poll failed | Couldn't reach TfL just now. We'll try again in 2 minutes. | Fetch failed: ECONNRESET |
| Button | Poll now | Click here to trigger ingestion |

## TfL reason text

TfL reasons often start with the line name ("Central Line: Minor delays due to..."). When shown next to the line name already, strip the repeated "<Line> Line:" prefix. Otherwise show TfL's text unchanged; don't rewrite official notices.
