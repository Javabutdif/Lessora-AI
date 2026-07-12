# Server-Side Rate Limiting Spec

## Problem

The server-side API routes currently have no shared request throttling, which leaves the auth, user, admin, and AI endpoints exposed to brute force and request flooding.

## Goal

Add a lightweight rate limiting layer to the server-side API routes without introducing a new dependency or a large architecture change.

## Requirements

- apply rate limiting to the main API route groups under `/api/auth`, `/api/user`, `/api/admin`, and `/api/ai`
- keep the implementation simple and local to the server codebase
- preserve the existing auth and controller behavior for normal traffic
- leave the health endpoint and other non-API utility routes unthrottled unless they are part of the covered route groups

## Non-goals

- distributed rate limiting
- database-backed counters
- user-specific quota systems
- client-side request changes

## Success criteria

- requests to covered routes are throttled when they exceed the configured window
- the code remains easy to follow and does not require new packages
- the implementation compiles cleanly with the existing TypeScript setup
