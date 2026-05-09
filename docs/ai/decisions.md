# Engineering Decisions

Use this file for durable decisions that affect how the product or repository should evolve.

Keep entries short, specific, and ordered with the newest decision at the top.

## What belongs here

- workflow continuity rules that should stay true across tasks and tool switches
- durable repo-level decisions about validation, packaging, or workspace structure
- product architecture choices that future contributors could reverse incorrectly without context

## Template

### Decision title

- date:
- status:
- context:
- decision:
- consequences:

## Notes

- Prefer a new entry when a decision would otherwise be easy to forget or reverse incorrectly.
- Use `accepted`, `superseded`, or `rejected` for status values if the team wants a simple lifecycle.
- Avoid recording temporary implementation details here unless they have long-term value.
- Link to a spec or plan when the decision came out of a larger design discussion.
