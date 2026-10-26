import React, { useEffect } from 'react';
import { useCursor } from '../context/CursorContext';

interface CustomCursorManagerProps {
  customCursor?: string;
}

export const CustomCursorManager: React.FC<CustomCursorManagerProps> = ({ customCursor }) => {
  const { cursor, setCursor } = useCursor();

  useEffect(() => {
    if (customCursor && customCursor !== cursor) {
      setCursor(customCursor);
    }
  }, [customCursor, cursor, setCursor]);

  return null;
};
