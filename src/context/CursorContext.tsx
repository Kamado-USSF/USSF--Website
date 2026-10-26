import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CUSTOM_CURSORS_CATALOG } from '../data/ussfData';

interface CursorContextType {
  cursor: string;
  setCursor: (cursor: string) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

const CURSOR_STYLE_ELEMENT_ID = 'ussf-dynamic-cursor-styles';

export const CursorProvider: React.FC<{ children: ReactNode; initialCursor?: string }> = ({ 
  children, 
  initialCursor = 'crosshair-laser' 
}) => {
  const [cursor, setCursorState] = useState<string>(() => {
    try {
      return localStorage.getItem('ussf_preferred_cursor') || initialCursor;
    } catch {
      return initialCursor;
    }
  });

  const setCursor = (newCursor: string) => {
    setCursorState(newCursor);
    try {
      localStorage.setItem('ussf_preferred_cursor', newCursor);
    } catch {}
  };

  useEffect(() => {
    let styleTag = document.getElementById(CURSOR_STYLE_ELEMENT_ID) as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = CURSOR_STYLE_ELEMENT_ID;
      document.head.appendChild(styleTag);
    }

    if (!cursor || cursor === 'default' || cursor === 'standard') {
      styleTag.textContent = '';
      document.body.classList.remove('has-custom-cursor');
      return;
    }

    document.body.classList.add('has-custom-cursor');

    // 1. Built-in Reticles
    if (cursor === 'crosshair-laser' || cursor === 'sniper-scope') {
      styleTag.textContent = `
        html, body, #root, *, *::before, *::after,
        a, button, [role="button"], select, .cursor-pointer, [data-interactive="true"],
        [type="button"], [type="submit"], [type="reset"], summary,
        a *, button *, [role="button"] *, select *, .cursor-pointer * {
          cursor: crosshair !important;
        }
        input[type="text"], input[type="password"], input[type="number"], input[type="email"], input[type="search"], textarea, [contenteditable="true"] {
          cursor: text !important;
        }
      `;
      return;
    }

    if (cursor === 'tactical-dot') {
      styleTag.textContent = `
        html, body, #root, *, *::before, *::after,
        a, button, [role="button"], select, .cursor-pointer, [data-interactive="true"],
        [type="button"], [type="submit"], [type="reset"], summary,
        a *, button *, [role="button"] *, select *, .cursor-pointer * {
          cursor: cell !important;
        }
        input[type="text"], input[type="password"], input[type="number"], input[type="email"], input[type="search"], textarea, [contenteditable="true"] {
          cursor: text !important;
        }
      `;
      return;
    }

    // 2. Custom Catalog Cursors
    const catalogItem = CUSTOM_CURSORS_CATALOG.find(c => c.id === cursor);

    if (catalogItem) {
      const cursorUrl = catalogItem.cursorUrl;
      const pointerUrl = catalogItem.pointerUrl || catalogItem.cursorUrl;
      const [hx, hy] = catalogItem.hotspot || [0, 0];
      const [phx, phy] = catalogItem.pointerHotspot || [0, 0];

      styleTag.textContent = `
        html, body, #root, *, *::before, *::after {
          cursor: url('${cursorUrl}') ${hx} ${hy}, auto !important;
        }
        a, button, [role="button"], select, .cursor-pointer, [data-interactive="true"],
        [type="button"], [type="submit"], [type="reset"], summary,
        a *, button *, [role="button"] *, select *, .cursor-pointer *,
        a *::before, button *::before, [role="button"] *::before {
          cursor: url('${pointerUrl}') ${phx} ${phy}, pointer !important;
        }
        input[type="text"], input[type="password"], input[type="number"], input[type="email"], input[type="search"], textarea, [contenteditable="true"] {
          cursor: text !important;
        }
      `;
      return;
    }

    // 3. Custom Uploaded Image or Direct Data URL
    if (cursor.startsWith('data:') || cursor.startsWith('/') || cursor.startsWith('http')) {
      styleTag.textContent = `
        html, body, #root, *, *::before, *::after {
          cursor: url('${cursor}') 0 0, auto !important;
        }
        a, button, [role="button"], select, .cursor-pointer, [data-interactive="true"],
        [type="button"], [type="submit"], [type="reset"], summary,
        a *, button *, [role="button"] *, select *, .cursor-pointer *,
        a *::before, button *::before, [role="button"] *::before {
          cursor: url('${cursor}') 0 0, pointer !important;
        }
        input[type="text"], input[type="password"], input[type="number"], input[type="email"], input[type="search"], textarea, [contenteditable="true"] {
          cursor: text !important;
        }
      `;
      return;
    }

    // Fallback: clear if unrecognized
    styleTag.textContent = '';
    document.body.classList.remove('has-custom-cursor');
  }, [cursor]);

  return (
    <CursorContext.Provider value={{ cursor, setCursor }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = (): CursorContextType => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
};
