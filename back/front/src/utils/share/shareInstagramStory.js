import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

export async function shareInstagramStory({
  text,
  url,
  t,
  logoUrl = '/assets/cosmos_tarot_favicon/cosmos_tarot-512x512.png',
}) {
  try {
    const width = 1080;
    const height = 1920;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#2d0f5f');
    grad.addColorStop(1, '#0b0430');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Draw logo if available
    try {
      if (logoUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        const loaded = await new Promise(resolve => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = logoUrl;
        });
        if (loaded) {
          // Enlarge and center logo so the story looks full-screen
          const logoSize = Math.floor(Math.min(width, height) * 0.68); // ~70% of short edge
          const x = Math.floor((width - logoSize) / 2);
          const y = Math.floor((height - logoSize) / 2);
          ctx.save();
          // circular mask
          ctx.beginPath();
          ctx.arc(width / 2, y + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, x, y, logoSize, logoSize);
          ctx.restore();

          // subtle outer glow
          ctx.save();
          const glowRadius = Math.floor(logoSize * 0.6);
          const gradient = ctx.createRadialGradient(
            width / 2,
            y + logoSize / 2,
            Math.max(1, Math.floor(logoSize * 0.15)),
            width / 2,
            y + logoSize / 2,
            glowRadius
          );
          gradient.addColorStop(0, 'rgba(166, 177, 255, 0.35)');
          gradient.addColorStop(1, 'rgba(166, 177, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(width / 2, y + logoSize / 2, glowRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Caption text under logo: "Cosmos Tarot" in English (Dongle font)
          try {
            const caption = 'Cosmos Tarot';
            let fontSize = Math.max(
              52,
              Math.min(160, Math.floor(width * 0.13))
            );
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = '#ffd700';
            // Try to load Dongle font (already declared in CSS). If not available, fall back silently.
            try {
              if (document?.fonts?.load) {
                // load bold first; if it fails, try normal
                await Promise.race([
                  document.fonts.load(`700 ${fontSize}px "Dongle"`),
                  new Promise(resolve => setTimeout(resolve, 500)),
                ]);
              }
            } catch (_) {}
            ctx.font = `700 ${fontSize}px "Dongle", sans-serif`;
            // shrink to fit width
            let metrics = ctx.measureText(caption);
            const maxTextWidth = Math.floor(width * 0.9);
            while (metrics.width > maxTextWidth && fontSize > 28) {
              fontSize -= 2;
              ctx.font = `700 ${fontSize}px "Dongle", sans-serif`;
              metrics = ctx.measureText(caption);
            }
            const textY = Math.min(height - fontSize - 70, y + logoSize + 26);
            // soft shadow for readability
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.55)';
            ctx.shadowBlur = Math.floor(fontSize * 0.35);
            ctx.shadowOffsetY = 2;
            ctx.fillText(caption, width / 2, textY);
            ctx.restore();
          } catch (_) {}
        }
      }
    } catch (_) {}

    // Photo-only: no text rendering to avoid cropping in stories

    return await new Promise(resolve => {
      canvas.toBlob(async blob => {
        if (!blob) return resolve(false);
        const file = new File([blob], 'invite-story.png', {
          type: 'image/png',
        });
        if (navigator?.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file] });
            return resolve(true);
          } catch (_) {
            return resolve(false);
          }
        } else {
          // Try to open Instagram app via deeplink, then fallback to store
          try {
            const isNative = Capacitor?.isNativePlatform?.();
            const platform = Capacitor?.getPlatform?.();
            const deeplink = 'instagram://story-camera';
            const androidStore = 'market://details?id=com.instagram.android';
            const androidStoreWeb =
              'https://play.google.com/store/apps/details?id=com.instagram.android';
            const iosStore = 'https://apps.apple.com/app/id389801252';

            if (isNative) {
              try {
                // Use window.location.href for native apps to open external apps directly
                window.location.href = deeplink;
                return resolve(true);
              } catch (_) {
                try {
                  const storeUrl =
                    platform === 'android' ? androidStore : iosStore;
                  window.location.href = storeUrl;
                  return resolve(true);
                } catch (_) {}
              }
            } else if (typeof window !== 'undefined') {
              const win = window.open(deeplink, '_blank');
              if (!win) {
                window.location.href = deeplink;
              }
              setTimeout(() => {
                try {
                  if (document.visibilityState !== 'hidden') {
                    window.location.href = androidStoreWeb;
                  }
                } catch (_) {}
              }, 800);
              try {
                await navigator?.clipboard?.writeText?.(url);
              } catch (_) {}
              return resolve(true);
            }
          } catch (_) {}

          return resolve(false);
        }
      }, 'image/png');
    });
  } catch (_) {
    return false;
  }
}
