# Amman Coffee House — mobile preview

This is the customer-facing Expo app for the white-label restaurant platform,
demonstrated with four fictional Jordanian businesses. One reusable app switches
its restaurant configuration, menu, colors, rewards, and customer preview data
at runtime.

## Run

Start the configured **Amman Coffee House** mobile workflow from Replit. To open
the project on a device, use Replit's **Preview on your phone** flow and Expo Go.
The app also supports the web preview.

## Included in this mobile deliverable

- Arabic-first interface with an English language switch and right-to-left layout
- Four configurable demo restaurants with separate menus, points, carts, orders,
  and reward previews
- Menu categories, search, product detail, size selection, favorites, and cart
- Pickup/delivery selection and locally saved demo order receipts
- Loyalty balance, reward previews, and a sample challenge
- Local persistence through AsyncStorage

## Explicit demo boundaries

- There is no connected customer account, shared API, or restaurant staff system.
- Menus, points, reward codes, and orders are sample data stored on the device.
- A demo order is not sent to a restaurant; no payment is initiated or collected.
- Planned application identifiers shown in Profile are metadata only. This
  artifact does not generate separate signed iOS/Android builds, icons, or store
  submissions for each restaurant.
- No store submission, approval, or production-readiness claim is made.

The first artifact intentionally focuses on the selected Expo customer app. The
separate Phase 1 work in the master brief—server-side authentication, tenant
authorization, database migrations, and the central administration dashboard—
remains outside this deliverable.
