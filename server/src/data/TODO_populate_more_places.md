# TODO: Populate seedDestinations with more places

## Goal
Add more destination articles to `server/src/data/seedDestinations.js` using the project’s existing seed workflow.

## Safety rules (must follow)
- Each place must have:
  - `name, state, city, category, description, bestTime, fees, map`
  - `images: string[]` (array of URLs)
  - `nearby: string[]`
  - `verified: boolean` and `featured: boolean`
- `category` must be one of: `Heritage | Nature | Adventure | Religious`.
- Slugs:
  - Provide consistent `slug`, `stateSlug`, `citySlug` (or let the helper `slug()` generate them).
- Avoid duplicate `slug` values.

## Planned implementation
1. Decide how many new places to add (batch size).
2. Add curated items per state/city, ensuring category distribution.
3. Re-run quick sanity check (server start + /api/meta + a few /api/destinations?state=... calls).

## Done
- [x] Add new places (to be implemented)

- [ ] Verify build/run
- [ ] Spot-check detail page rendering

