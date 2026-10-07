import type { Href, useRouter } from 'expo-router';

type Router = ReturnType<typeof useRouter>;

/** Go back if there is a screen behind this one; otherwise go to `fallback` (e.g. after opening a screen directly). */
export function goBack(router: Router, fallback: Href = '/') {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}
