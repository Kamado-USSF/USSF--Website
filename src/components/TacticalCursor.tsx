import React, { useEffect, useState } from 'react';
import { CUSTOM_CURSORS_CATALOG, CustomCursorItem } from '../data/ussfData';

interface TacticalCursorProps {
  cursorType?: string;
  enabled?: boolean;
}

export const TacticalCursor: React.FC<TacticalCursorProps> = ({
  cursorType = 'crosshair-laser',
  enabled = true
}) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Find catalog item if applicable
  const catalogItem = CUSTOM_CURSORS_CATALOG.find(c => c.id === cursorType);

  useEffect(() => {
    // Style element to inject global cursor rules so buttons, links, inputs, and dropdowns NEVER revert to default
    const styleId = 'ussf-custom-cursor-style';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    if (!enabled || cursorType === 'default') {
      styleEl.innerHTML = '';
      document.documentElement.style.cursor = 'auto';
      return;
    }

    // Is it an image cursor from the catalog?
    if (catalogItem && catalogItem.cursorUrl !== 'reticle' && catalogItem.cursorUrl !== 'default') {
      const cursorImg = catalogItem.cursorUrl;
      const pointerImg = catalogItem.pointerUrl || catalogItem.cursorUrl;
      const [hx, hy] = catalogItem.hotspot || [0, 0];
      const [px, py] = catalogItem.pointerHotspot || [10, 0];

      styleEl.innerHTML = `
        html, body, div, p, span, h1, h2, h3, h4, h5, h6, table, tr, td, th, section, article, nav, header, footer, aside, main, form, label {
          cursor: url('${cursorImg}') ${hx} ${hy}, auto !important;
        }
        button, a, select, input, textarea, [role="button"], [role="link"], .cursor-pointer, [onclick] {
          cursor: url('${pointerImg}') ${px} ${py}, pointer !important;
        }
      `;
      document.documentElement.style.cursor = `url('${cursorImg}') ${hx} ${hy}, auto`;
      return () => {
        if (styleEl) styleEl.innerHTML = '';
        document.documentElement.style.cursor = 'auto';
      };
    }

    // Is it a custom uploaded image? (data: or http or /path)
    if (cursorType.startsWith('data:') || cursorType.startsWith('http') || cursorType.includes('/')) {
      styleEl.innerHTML = `
        html, body, div, p, span, h1, h2, h3, h4, h5, h6, table, tr, td, th, section, article, nav, header, footer, aside, main, form, label {
          cursor: url('${cursorType}') 0 0, auto !important;
        }
        button, a, select, input, textarea, [role="button"], [role="link"], .cursor-pointer, [onclick] {
          cursor: url('${cursorType}') 0 0, pointer !important;
        }
      `;
      document.documentElement.style.cursor = `url('${cursorType}') 0 0, auto`;
      return () => {
        if (styleEl) styleEl.innerHTML = '';
        document.documentElement.style.cursor = 'auto';
      };
    }

    // Otherwise it is a Tactical HUD Reticle (crosshair-laser, tactical-dot, sniper-scope)
    // Hide all native browser cursors so only the HUD laser reticle is visible
    styleEl.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.documentElement.style.cursor = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = !!(
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button' ||
          target.classList.contains('cursor-pointer')
        );
        setIsHovered(isClickable);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (styleEl) styleEl.innerHTML = '';
      document.documentElement.style.cursor = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorType, enabled, catalogItem]);

  // If disabled, default, or image-based cursor (which CSS handles natively), don't render overlay reticle
  if (!enabled || !isVisible || cursorType === 'default' || (catalogItem && catalogItem.cursorUrl !== 'reticle')) {
    return null;
  }

  // Render Tactical HUD Reticles (crosshair-laser, tactical-dot, sniper-scope)
  return (
    <div
      className="pointer-events-none fixed z-[9999999] transition-transform duration-75 ease-out select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) scale(${isClicked ? 0.85 : isHovered ? 1.25 : 1})`,
      }}
    >
      {/* 1. Tactical Crosshair Laser */}
      {cursorType === 'crosshair-laser' && (
        <div className="relative h-6 w-6 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full border border-dashed transition-colors duration-150 ${
            isHovered ? 'border-amber-400 animate-spin-slow' : 'border-rose-500/80'
          }`} />
          <div className="absolute h-full w-[1px] bg-rose-500 shadow-[0_0_6px_#ef4444]" />
          <div className="absolute w-full h-[1px] bg-rose-500 shadow-[0_0_6px_#ef4444]" />
          <div className={`h-1.5 w-1.5 rounded-full shadow-[0_0_8px_#ef4444] transition-colors ${
            isHovered ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b]' : 'bg-rose-500'
          }`} />
          {isHovered && (
            <>
              <span className="absolute -top-0.5 -left-0.5 text-[6px] font-mono text-amber-400">◤</span>
              <span className="absolute -top-0.5 -right-0.5 text-[6px] font-mono text-amber-400">◥</span>
              <span className="absolute -bottom-0.5 -left-0.5 text-[6px] font-mono text-amber-400">◣</span>
              <span className="absolute -bottom-0.5 -right-0.5 text-[6px] font-mono text-amber-400">◢</span>
            </>
          )}
        </div>
      )}

      {/* 2. Precision Laser Dot */}
      {cursorType === 'tactical-dot' && (
        <div className="relative h-5 w-5 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-cyan-400/60 animate-ping opacity-40" />
          <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
          {isHovered && (
            <div className="absolute inset-0 rounded-full border border-amber-400 shadow-[0_0_6px_#f59e0b]" />
          )}
        </div>
      )}

      {/* 3. Sniper Reticle Scope */}
      {cursorType === 'sniper-scope' && (
        <div className="relative h-7 w-7 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full border transition-colors ${
            isHovered ? 'border-emerald-400 bg-emerald-950/20 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'border-neutral-200/80 bg-neutral-950/20'
          }`} />
          <div className="absolute h-full w-[1px] bg-neutral-300" />
          <div className="absolute w-full h-[1px] bg-neutral-300" />
          <div className="absolute -top-0.5 h-0.5 w-0.5 bg-amber-400 rounded-full shadow-[0_0_4px_#fbbf24]" />
          <div className="absolute -bottom-0.5 h-0.5 w-0.5 bg-amber-400 rounded-full shadow-[0_0_4px_#fbbf24]" />
          <div className="h-1 w-1 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
        </div>
      )}
    </div>
  );
};
