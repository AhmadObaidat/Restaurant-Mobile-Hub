/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#35261F',
    tint: '#704633',

    // Core surfaces
    background: '#F8F5EF',
    foreground: '#35261F',

    // Cards / elevated surfaces
    card: '#FFFFFF',
    cardForeground: '#35261F',

    // Primary action color (buttons, links, active states)
    primary: '#704633',
    primaryForeground: '#FFFFFF',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#EEE5DC',
    secondaryForeground: '#35261F',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#EEE9E2',
    mutedForeground: '#877B70',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#F3E6D7',
    accentForeground: '#35261F',

    // Destructive actions (delete, error states)
    destructive: '#B8574B',
    destructiveForeground: '#FFFFFF',

    // Borders and input outlines
    border: '#E6DED4',
    input: '#E6DED4',
    brandVeil: 'rgba(255,255,255,0.18)',
    brandTrack: 'rgba(255,255,255,0.24)',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 18,
};

export default colors;
