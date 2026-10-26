import { CUSTOM_AVATAR_FRAMES } from '../data/customizationAssets';

/**
 * Returns the CSS class or inline styling for any avatar frame name.
 * Handles both the 9 official military rank frames and the 19 ornate custom cosmetic frames.
 */
export function getAvatarFrameCss(frameName?: string): string {
  if (!frameName || frameName === 'None') return 'frame-recruit-ring';

  // 1. Check official rank frames
  switch (frameName) {
    case 'Supreme Gold Aureole':
      return 'frame-supreme-gold';
    case 'Vice Commander Ruby':
      return 'frame-vice-ruby';
    case 'Golden Star Officer':
      return 'frame-golden-star';
    case 'Cyan Tactical':
      return 'frame-cyan-tactical';
    case 'Emerald Chevrons':
      return 'frame-emerald-chevron';
    case 'Single Gold Chevron':
      return 'frame-golden-star';
    case 'Specialist Diamond':
      return 'frame-emerald-chevron';
    case 'Recruit Ring':
      return 'frame-recruit-ring';
    case 'Standard Issue Border':
      return 'frame-recruit-ring';
  }

  // 2. Check ornate custom avatar frames
  const custom = CUSTOM_AVATAR_FRAMES.find(
    f => f.name.toLowerCase() === frameName.toLowerCase() || f.id.toLowerCase() === frameName.toLowerCase()
  );
  if (custom) {
    return custom.frameClass;
  }

  // Fallback
  return 'frame-recruit-ring';
}
