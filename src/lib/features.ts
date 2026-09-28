/**
 * Site-wide feature switches.
 *
 * Flip a flag here instead of deleting or commenting out code, so a feature
 * can be turned back on without digging through git history.
 */
export const FEATURES = {
  /** Teacher Empowerment pre-order modal shown on the homepage and /teacher-empowerment. */
  preorderPopup: false,
  /** "Limited offers" deals strip with countdown on the homepage. */
  homepageOffers: false,
  /** /pre-order checkout. While off, the route redirects to /products. */
  preorderPage: false,
  /** /products/tablets offer landing page. While off, the route redirects to /products. */
  tabletOfferPage: false,
} as const;
