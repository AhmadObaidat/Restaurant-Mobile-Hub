# Mobile Preview Status

## Completed in this deliverable

- Reusable Expo customer app with configuration-driven profiles for Amman Coffee House, Jordan Burger Co., Petra Pizza, and Sweet Spot Bakery
- Arabic-first UI, English toggle, and right-to-left text/layout handling
- Home, menu search/categories, product details and size selection, favorites, cart, checkout preview, order receipt, reward previews, challenge display, and profile
- Separate local customer preview data per restaurant, persisted with AsyncStorage
- Local JOD formatting using integer fils in product, cart, and order data
- Generated mobile app icon and sample coffee feature photography
- Mobile README documenting how to run the artifact and its demo boundaries

## Simulated and local-only

- Customer identity and account: guest preview only; there is no sign-in or account recovery
- Menu and prices: seeded example content, not fetched from a restaurant system
- Points, membership tier, challenge progress, and rewards: seeded preview values
- Reward redemption: a local preview code; no staff or POS verification
- Orders: stored on the device only; not sent to a restaurant or delivery provider
- Payment: no provider is connected and no money is collected
- Delivery: a sample restaurant service area and fee; no address validation or dispatch
- Restaurant switching: preview configuration only; it does not change this artifact's installed app identity

## Not implemented

- Shared API integration, database persistence, migrations, and server-side validation
- Customer/staff authentication, role permissions, or server-enforced tenant isolation
- Central platform administration or restaurant-owner dashboard
- Live POS, ordering, payment, push notification, analytics, or object-storage integrations
- Restaurant-specific native bundles, signing, build/version records, release approvals, or store submissions
- Automated behavior tests for mobile purchase, reward, and tenant-isolation flows

## Verification

- `pnpm --filter @workspace/mobile run typecheck` passes.
- The current workflow serves the Expo app for Replit preview and Expo Go.
- This status is a feature-scope record, not a production security or store-readiness assessment.
