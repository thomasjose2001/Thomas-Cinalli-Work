# Common Courtesy — All Access

An internal dispatch and ride-management platform built for Common Courtesy, a transportation dispatch company. The tool dispatchers use to look up riders, request and schedule rides, watch a trip in progress on a live map, and manage the details that make a ride actually work for the person taking it.

## Why there's no code here

**This project is proprietary and I can't publish any of its source code.**

The application was built under contract and the codebase belongs to the company, so nothing from it appears in this repository — not selected files, not excerpts, not sanitized fragments. What I can share is what the product looks like and what it does.

If you're evaluating my work and want to talk through the architecture, the tradeoffs, or how a particular piece was built, I'm glad to do that in conversation.

## Built with

React on the front end.

## Screenshots

`Common Courtesy All Access.pdf` contains screens from the running application:

- **Dispatch view** — the ride list with status at a glance, an expanded ride showing rider details, cost, trips remaining, and route, alongside a live map with driver ETA
- **Ride request** — scheduling a trip, choosing between available providers and price points, and attaching notes that travel with the ride to the driver

## What it does

- **Rider lookup and ride history** — search riders, review past and upcoming trips, and see status (accepted, completed, canceled) across the whole account
- **Ride requesting and scheduling** — book immediately or for a future time, with return trips scheduled from an existing ride
- **Provider selection** — compare available ride options with live pricing and pickup estimates before dispatching
- **Live tracking** — pickup and drop-off pinned on a map with driver identity, vehicle, and arrival estimate
- **Rider-specific notes** — internal notes for the dispatch team and driver-facing notes that carry accessibility and pickup instructions to the person actually doing the pickup
- **Trip allocation** — remaining trips tracked per rider against their plan
