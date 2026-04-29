import { useEffect, useState } from 'react';

/** Viewport width at which the layout switches to mobile. */
const MOBILE_BREAKPOINT = 860;

/**
 * Returns `true` when the viewport width is at or below the mobile breakpoint (860 px).
 * Updates reactively on every window resize — no setup needed in the consuming component.
 */
export function useIsPhone(): boolean {
  const [isPhone, setIsPhone] = useState(() => window.innerWidth <= MOBILE_BREAKPOINT);

  useEffect(() => {
    const onResize = () => setIsPhone(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return isPhone;
}
