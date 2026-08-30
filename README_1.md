# Rentra

A peer-to-peer car rental platform. Think Airbnb, but for vehicles — owners list cars they aren't using, renters browse and book them for a set period, and the platform handles the listing, availability, pricing, and booking flow around that exchange. The closest well-known comparison is Turo.

This is a personal project, built and maintained by me.

## A note on the code in this repository

**This repository contains selected portions of the Rentra codebase, not the complete application.**

I've chosen to share representative pieces rather than publish the project in full. What's here is meant to show how the system is structured and how I approach building software — the patterns, the reasoning, the code quality — without putting the entire working application in public.

Things that are intentionally left out include core business logic, configuration, credentials and environment files, and any code specific to running the platform in production. As a result, this repository is **not runnable as-is**. It's a reading repository, not a deployable one.

If you're evaluating my work and want to see more, I'm happy to walk through additional parts of the system directly.

## Screenshots

Screenshots of the running application are included in this repository, since a lot of what the project actually is lives in the interface rather than in the files shared here. They cover the main flows a user moves through.

See the [`screenshots/`](./screenshots) folder.

## What Rentra does

- **Listings** — owners create a listing for a vehicle with photos, description, location, and pricing
- **Search and browse** — renters filter available vehicles by date, location, and vehicle attributes
- **Availability** — each vehicle has a calendar that reflects existing bookings and owner blackout dates
- **Booking** — renters request or reserve a vehicle for a date range, with pricing calculated per booking
- **Accounts** — separate experiences for owners managing their vehicles and renters managing their trips

