# Spec: Paymongo Support Donation

## Purpose

Define the intended support donation experience for Lessora AI so a future implementation can start from a clear, shared scope.

## Scope

- in scope:
  - a public support or donate entry point
  - one-time donation amounts
  - Paymongo-hosted checkout
  - success, cancel, and failure states
  - webhook-based payment confirmation
  - minimal metadata for reconciliation
- out of scope:
  - subscriptions or recurring billing
  - collecting raw card details inside Lessora AI
  - donation analytics dashboards
  - refunds automation
  - CRM or email marketing integrations

## Proposed behavior

### Entry point

Lessora AI exposes a simple support donation CTA from the public-facing experience. The CTA should be easy to find from the landing page and any existing public info pages that already talk about the project.

The user should understand that the donation is optional and supports the project rather than unlocking product access.

### Donation flow

The donation flow uses Paymongo-hosted checkout as the default assumption.

- the app does not collect or store card numbers
- the donor picks from a small set of preset amounts
- the checkout session is created with Paymongo
- checkout only offers QRPh; card, bank, and e-wallet payment methods are excluded
- the user is sent to Paymongo to complete payment
- the app returns the user to a success or cancel state after checkout

For the first release, the donation amounts should stay fixed and simple. If later product decisions require a custom amount, that can be added as a follow-up instead of widening the initial scope.

### Confirmation and reconciliation

Payment confirmation should come from Paymongo callbacks or webhooks rather than only from the browser redirect.

The future implementation should keep minimal metadata for each donation attempt, such as:

- reference id
- amount
- currency
- status
- timestamp

This is enough for reconciliation without introducing a larger billing system.

### Success and failure states

After a successful payment, the user should see a short thank-you state that confirms the donation was received.

If the user cancels or the payment fails, the user should return to the donation entry point with a clear option to try again.

## Acceptance criteria

- [ ] The docs describe a clear public entry point for support donations
- [ ] The donation flow uses Paymongo-hosted checkout and does not collect raw card data in Lessora AI
- [ ] The flow covers success, cancel, failure, and webhook confirmation states
- [ ] The first release is limited to one-time donations
- [ ] The spec, plan, and task brief use the same date and topic

## Constraints

- technical:
  - prefer the simplest Paymongo integration surface that supports one-time donations
  - keep payment handling out of the client UI as much as possible
  - preserve room for future donation analytics without designing them now
- product:
  - keep the donation message short and optional
  - do not imply paid access to the core product
- delivery:
  - document the feature in one pass
  - keep the scope narrow enough for a future implementation to start quickly

## Risks and open questions

- risk 1: Paymongo product choice may shift between payment links and a hosted checkout session depending on configuration limits.
- risk 2: the exact donation amounts and supporting copy may need product approval before implementation.
- question 1: should the donation CTA live only on the landing page, or also in the footer and about page?
- question 2: should the first release support fixed tiers only, or allow a custom amount if Paymongo configuration permits it?

## Related docs

- plan: [`docs/plans/2026-07-12-Paymongo-Support-Donation.md`](../plans/2026-07-12-Paymongo-Support-Donation.md)
- task brief: [`docs/ai/tasks/2026-07-12-paymongo-support-donation.md`](../ai/tasks/2026-07-12-paymongo-support-donation.md)
