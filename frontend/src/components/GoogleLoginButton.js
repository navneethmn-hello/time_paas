"use client";

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function GoogleLoginButton({ onCredential, fallbackLabel, className }) {
  const buttonRef = useRef(null);
  const [isScriptReady, setIsScriptReady] = useState(false);

  useEffect(() => {
    if (!googleClientId || !isScriptReady || !buttonRef.current || !window.google) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response) => {
        if (response.credential) {
          await onCredential(response.credential);
        }
      },
    });

    buttonRef.current.innerHTML = '';
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      text: 'continue_with',
      width: 240,
    });
  }, [isScriptReady, onCredential]);

  if (!googleClientId) {
    return (
      <button onClick={() => onCredential(null)} className={className}>
        {fallbackLabel}
      </button>
    );
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setIsScriptReady(true)}
      />
      <div ref={buttonRef} className={className} />
    </>
  );
}
