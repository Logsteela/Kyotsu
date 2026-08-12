import { useEffect, useRef } from 'react';

const SCRIPT_ID = 'admax-script';
const SCRIPT_SRC = 'https://adm.shinobi.jp/st/t.js';

export function AdSdkLoader() {
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const existingScript = document.getElementById(SCRIPT_ID);
    existingScript?.remove();

    window.__admax_tag__ = undefined;
    window.__admax_render__ = undefined;
    window.admaxads = window.admaxads || [];

    const timer = window.setTimeout(() => {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = () => {
        window.admaxads = [];
      };
      document.head.appendChild(script);
    }, 100);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}
