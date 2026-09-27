/**
 * next/link and router.push ignore navigations to the URL you're already on, so a second
 * click on "/#work" while the address bar already reads "/#work" does nothing. Scroll to
 * the target ourselves in that case. Returns true when it handled the navigation.
 */
export function scrollToCurrentHash(href: string): boolean {
  const url = new URL(href, window.location.href);
  if (!url.hash || url.pathname !== window.location.pathname || url.hash !== window.location.hash) {
    return false;
  }
  const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if (!target) return false;
  target.scrollIntoView();
  return true;
}
