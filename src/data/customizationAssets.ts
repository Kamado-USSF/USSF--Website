// Comprehensive Customization Assets: 41 uploaded designs
// Namecards, Custom Cursors, and Ornate Avatar Frames

export interface CustomNamecard {
  id: string;
  name: string;
  category: 'Genshin Impact' | 'Wuthering Waves' | 'Neverness to Ever' | 'Tactical Military';
  description: string;
  gradientClass: string;
  accentColor: string;
  bannerBg: string;
  artStyle: string;
}

export interface CustomCursorDef {
  id: string;
  name: string;
  category: 'Gaming' | 'Anime & Manga' | 'Tactical' | 'Sci-Fi';
  type: 'css-rendered' | 'svg';
  description: string;
  previewColor: string;
}

export interface CustomAvatarFrame {
  id: string;
  name: string;
  category: 'Celestial & Angelic' | 'Gothic & Dark' | 'Anime & Chibi' | 'Elemental & Nature' | 'Mil-Spec Tactical';
  description: string;
  frameClass: string;
  previewBg: string;
  glowColor: string;
}

// 7 Uploaded Genshin / Anime Namecards from User
export const CUSTOM_NAMECARDS: CustomNamecard[] = [
  {
    id: 'namecard-durin',
    name: 'Durin: Void Flame Dragon',
    category: 'Genshin Impact',
    description: 'Dark purple draconic wings framing a burning sacred pink flame heart amidst stellar sparkles.',
    gradientClass: 'from-[#2e0854] via-[#4a1259] to-[#120524]',
    accentColor: '#d946ef',
    bannerBg: 'radial-gradient(ellipse at 80% 50%, rgba(217, 70, 239, 0.45) 0%, rgba(74, 18, 89, 0.6) 40%, rgba(18, 5, 36, 0.95) 100%)',
    artStyle: 'dragon-fire'
  },
  {
    id: 'namecard-flins',
    name: 'Flins: Azure Spirit Lantern',
    category: 'Genshin Impact',
    description: 'Ornate wrought iron lantern radiating ethereal cyan and sapphire ghost flames in a deep night.',
    gradientClass: 'from-[#0b1d3a] via-[#103060] to-[#040a18]',
    accentColor: '#38bdf8',
    bannerBg: 'radial-gradient(ellipse at 85% 50%, rgba(56, 189, 248, 0.4) 0%, rgba(16, 48, 96, 0.6) 40%, rgba(4, 10, 24, 0.95) 100%)',
    artStyle: 'azure-lantern'
  },
  {
    id: 'namecard-furina',
    name: 'Furina: Alluring Sweet Waters',
    category: 'Genshin Impact',
    description: 'Fontaine grand festival with waterdrop ferris wheel, sweet cakes, pudding cups, and floating hydro bubbles.',
    gradientClass: 'from-[#082f49] via-[#0284c7] to-[#0c1a30]',
    accentColor: '#38bdf8',
    bannerBg: 'radial-gradient(ellipse at 80% 50%, rgba(14, 165, 233, 0.35) 0%, rgba(8, 47, 73, 0.7) 50%, rgba(12, 26, 48, 0.95) 100%)',
    artStyle: 'furina-sweets'
  },
  {
    id: 'namecard-lavish-gala',
    name: 'Lavish Gala: Blood Moon Duet',
    category: 'Genshin Impact',
    description: 'Crimson gothic silhouette of two aristocratic companions back-to-back under a massive full moon over city spires.',
    gradientClass: 'from-[#450a0a] via-[#7f1d1d] to-[#1a0505]',
    accentColor: '#f43f5e',
    bannerBg: 'radial-gradient(ellipse at 65% 50%, rgba(225, 29, 72, 0.45) 0%, rgba(127, 29, 29, 0.7) 45%, rgba(26, 5, 5, 0.95) 100%)',
    artStyle: 'blood-moon'
  },
  {
    id: 'namecard-moon',
    name: 'Moon: Celestial Astral Spirit',
    category: 'Genshin Impact',
    description: 'Luminescent space whale soaring gracefully over a frosted lunar crater with floating crystal transmission spires.',
    gradientClass: 'from-[#0f172a] via-[#1e3a8a] to-[#020617]',
    accentColor: '#93c5fd',
    bannerBg: 'radial-gradient(ellipse at 75% 30%, rgba(147, 197, 253, 0.45) 0%, rgba(30, 58, 138, 0.6) 40%, rgba(2, 6, 23, 0.95) 100%)',
    artStyle: 'lunar-whale'
  },
  {
    id: 'namecard-ororon',
    name: 'Ororon: Nightwatcher Abyssal Eye',
    category: 'Genshin Impact',
    description: 'Ancient occult tribal eye staring from the shadows surrounded by cerulean lightning bolts and mystic glyphs.',
    gradientClass: 'from-[#081e36] via-[#0c3559] to-[#030914]',
    accentColor: '#06b6d4',
    bannerBg: 'radial-gradient(ellipse at 70% 50%, rgba(6, 182, 212, 0.45) 0%, rgba(12, 53, 89, 0.6) 45%, rgba(3, 9, 20, 0.95) 100%)',
    artStyle: 'ororon-eye'
  },
  {
    id: 'namecard-skirk',
    name: 'Skirk: Shattered Void Shards',
    category: 'Genshin Impact',
    description: 'Prismatic lavender crystal shards floating in the abyss with the cold silhouette of a swordmaster maiden.',
    gradientClass: 'from-[#2e1065] via-[#4c1d95] to-[#090314]',
    accentColor: '#c084fc',
    bannerBg: 'radial-gradient(ellipse at 70% 50%, rgba(192, 132, 252, 0.45) 0%, rgba(76, 29, 149, 0.6) 45%, rgba(9, 3, 20, 0.95) 100%)',
    artStyle: 'void-shards'
  },
  // Authentic USSF Special Forces Cards
  {
    id: 'namecard-ussf-apex',
    name: 'Crimson Apex Seal',
    category: 'Tactical Military',
    description: 'USSF supreme command insignia embossed in gold leaf against dark carbon weave and tactical radar grid.',
    gradientClass: 'from-[#3b0712] via-[#881337] to-[#0f0205]',
    accentColor: '#f43f5e',
    bannerBg: 'linear-gradient(135deg, rgba(136, 19, 55, 0.8) 0%, rgba(15, 2, 5, 0.95) 100%)',
    artStyle: 'tactical'
  },
  {
    id: 'namecard-obsidian',
    name: 'Obsidian Commander',
    category: 'Tactical Military',
    description: 'High-contrast matte black armor plate with amber laser etched identification and CIT2 law commendations.',
    gradientClass: 'from-[#1c1917] via-[#292524] to-[#0c0a09]',
    accentColor: '#f59e0b',
    bannerBg: 'linear-gradient(135deg, rgba(41, 37, 36, 0.9) 0%, rgba(12, 10, 9, 0.98) 100%)',
    artStyle: 'tactical'
  },
  {
    id: 'namecard-nvg',
    name: 'Night Vision Recon Grid',
    category: 'Tactical Military',
    description: 'Phosphor green infrared scanlines with live target designation coordinates and rangefinder reticles.',
    gradientClass: 'from-[#022c22] via-[#064e3b] to-[#01140e]',
    accentColor: '#10b981',
    bannerBg: 'linear-gradient(135deg, rgba(6, 78, 59, 0.85) 0%, rgba(1, 20, 14, 0.98) 100%)',
    artStyle: 'tactical'
  },
  {
    id: 'namecard-desert',
    name: 'Desert Interdiction',
    category: 'Tactical Military',
    description: 'Dust camouflage chevron patterning inspired by Bone County high-speed vehicle pursuit operations.',
    gradientClass: 'from-[#451a03] via-[#78350f] to-[#1c0701]',
    accentColor: '#f59e0b',
    bannerBg: 'linear-gradient(135deg, rgba(120, 53, 15, 0.85) 0%, rgba(28, 7, 1, 0.98) 100%)',
    artStyle: 'tactical'
  }
];

// 10 Custom Cursors from User Uploads
export const CUSTOM_CURSORS: CustomCursorDef[] = [
  {
    id: 'cs2-butterfly-fade',
    name: 'CS2 Butterfly Knife Fade',
    category: 'Gaming',
    type: 'css-rendered',
    description: 'Iconic curved Balisong blade with full fade gradient (purple tip to amber heel) and tactical black handle.',
    previewColor: '#f43f5e'
  },
  {
    id: 'columbina-feather-wing',
    name: 'Columbina Wing Arrow',
    category: 'Anime & Manga',
    type: 'css-rendered',
    description: 'Angelic white wing plumage forming a crystal arrow with divine cyan teardrop ornament.',
    previewColor: '#60a5fa'
  },
  {
    id: 'halo-energy-sword',
    name: 'Halo Plasma Energy Sword',
    category: 'Sci-Fi',
    type: 'css-rendered',
    description: 'Twin arcs of crackling blue plasma energy held by a central titanium power grip.',
    previewColor: '#38bdf8'
  },
  {
    id: 'infamous-neon-needle',
    name: 'INfamous Abigail Neon Spark',
    category: 'Gaming',
    type: 'css-rendered',
    description: 'Blazing neon magenta lightning arrow trailing shockwave energy rings.',
    previewColor: '#ec4899'
  },
  {
    id: 'jjk-megumi-blue-flame',
    name: 'Jujutsu Megumi Blue Flame',
    category: 'Anime & Manga',
    type: 'css-rendered',
    description: 'Raging azure cursed spirit flame forming an arrow pointer and flaming monarch hand.',
    previewColor: '#0ea5e9'
  },
  {
    id: 'marvel-comic-cursor',
    name: 'Marvel Halftone Comic Arrow',
    category: 'Sci-Fi',
    type: 'css-rendered',
    description: 'Bold comic book ink arrow with vintage halftone dot shading and amber stone texture.',
    previewColor: '#f97316'
  },
  {
    id: 'roblox-cyan-crosshair',
    name: 'Roblox Classic Cyan Crosshair',
    category: 'Gaming',
    type: 'css-rendered',
    description: 'Minimalist double concentric ring target with glowing cyan core dot.',
    previewColor: '#06b6d4'
  },
  {
    id: 'solo-leveling-shadow',
    name: 'Solo Leveling Shadow Monarch',
    category: 'Anime & Manga',
    type: 'css-rendered',
    description: 'Dark purple jagged shadow spear emitting smoky necromancy aura and monarch hand pointer.',
    previewColor: '#a855f7'
  },
  {
    id: 'stealth-titanium-red',
    name: 'Stealth Titanium Red Fin',
    category: 'Tactical',
    type: 'css-rendered',
    description: 'Angled stealth bomber arrow with red glowing propulsion ribs and matte silver edges.',
    previewColor: '#ef4444'
  },
  {
    id: 'crosshair-laser',
    name: 'USSF Tactical Crosshair Laser',
    category: 'Tactical',
    type: 'css-rendered',
    description: 'Military red laser sight with target locking corner brackets on clickable elements.',
    previewColor: '#ef4444'
  }
];

// 19 Ornate Avatar Frames from User Uploads
export const CUSTOM_AVATAR_FRAMES: CustomAvatarFrame[] = [
  {
    id: 'frame-angel-crystal',
    name: 'Archangel Crystal Wings & Crown',
    category: 'Celestial & Angelic',
    description: 'Royal tiara crown, frosted sapphire wings, diamond droplets, and silk ribbons.',
    frameClass: 'frame-angel-crystal',
    previewBg: 'linear-gradient(135deg, #0284c7, #38bdf8)',
    glowColor: '#38bdf8'
  },
  {
    id: 'frame-ice-cat',
    name: 'Diamond Ice Crystals & Cat',
    category: 'Celestial & Angelic',
    description: 'Frosted ice crystal ring with silver chains, floating snowflakes, and a sitting white kitten.',
    frameClass: 'frame-ice-cat',
    previewBg: 'linear-gradient(135deg, #0369a1, #7dd3fc)',
    glowColor: '#7dd3fc'
  },
  {
    id: 'frame-gothic-skull',
    name: 'Gothic Skulls & Silver Roses',
    category: 'Gothic & Dark',
    description: 'Hand-etched silver bone filigree with twin skulls and intertwined rose briars.',
    frameClass: 'frame-gothic-skull',
    previewBg: 'linear-gradient(135deg, #262626, #737373)',
    glowColor: '#a3a3a3'
  },
  {
    id: 'frame-cosmic-maiden',
    name: 'Cosmic Galaxy & Chibi Maiden',
    category: 'Anime & Chibi',
    description: 'Deep violet astral ring with four-pointed starburst and a chibi silver-haired swordswoman.',
    frameClass: 'frame-cosmic-maiden',
    previewBg: 'linear-gradient(135deg, #581c87, #c084fc)',
    glowColor: '#c084fc'
  },
  {
    id: 'frame-archangel-wings',
    name: 'Celestial Diamond Seraph Wings',
    category: 'Celestial & Angelic',
    description: 'Grand feathered angel wings with crystal chandelier pendants and silk bow.',
    frameClass: 'frame-archangel-wings',
    previewBg: 'linear-gradient(135deg, #67e8f9, #f0abfc)',
    glowColor: '#e0e7ff'
  },
  {
    id: 'frame-kitsune-mask',
    name: 'Shadow Ninja Kitsune Demon Mask',
    category: 'Gothic & Dark',
    description: 'Dark obsidian iron torc with broken demon kitsune mask and violet spirit butterflies.',
    frameClass: 'frame-kitsune-mask',
    previewBg: 'linear-gradient(135deg, #1e1b4b, #3b82f6)',
    glowColor: '#6366f1'
  },
  {
    id: 'frame-abyssal-dragon',
    name: 'Abyssal Spiked Dragon Crown',
    category: 'Gothic & Dark',
    description: 'Jagged dark iron spikes with an inner ring of blazing crimson demonic dragon fire.',
    frameClass: 'frame-abyssal-dragon',
    previewBg: 'linear-gradient(135deg, #450a0a, #ef4444)',
    glowColor: '#ef4444'
  },
  {
    id: 'frame-obsidian-eyes',
    name: 'Obsidian Ring of Cyan Eyes',
    category: 'Gothic & Dark',
    description: 'Carved dark basalt ring embedded with 8 glowing cyan watcher eyes and lightning veins.',
    frameClass: 'frame-obsidian-eyes',
    previewBg: 'linear-gradient(135deg, #082f49, #06b6d4)',
    glowColor: '#06b6d4'
  },
  {
    id: 'frame-enso-blood',
    name: 'Calligraphic Enso Blood Slash',
    category: 'Gothic & Dark',
    description: 'Expressive Japanese sumi-e ink brush circle slashed with raw blood-red lacquer.',
    frameClass: 'frame-enso-blood',
    previewBg: 'linear-gradient(135deg, #171717, #dc2626)',
    glowColor: '#ef4444'
  },
  {
    id: 'frame-chrono-gear',
    name: 'Chrono Compass Sci-Fi Gear',
    category: 'Mil-Spec Tactical',
    description: 'Red anodized cyber compass with mechanical pointers, starbursts, and golden pivot core.',
    frameClass: 'frame-chrono-gear',
    previewBg: 'linear-gradient(135deg, #881337, #f43f5e)',
    glowColor: '#f43f5e'
  },
  {
    id: 'frame-toxic-emerald',
    name: 'Toxic Emerald Liquid & Black Roses',
    category: 'Gothic & Dark',
    description: 'Polished emerald fluid glass circle with dripping black lacquer and velvet dark roses.',
    frameClass: 'frame-toxic-emerald',
    previewBg: 'linear-gradient(135deg, #064e3b, #10b981)',
    glowColor: '#10b981'
  },
  {
    id: 'frame-sakura-bonsai',
    name: 'Ancient Sakura Bonsai Tree Ring',
    category: 'Elemental & Nature',
    description: 'Weathered gnarled bonsai tree branches twisted into a ring laden with blooming cherry blossoms.',
    frameClass: 'frame-sakura-bonsai',
    previewBg: 'linear-gradient(135deg, #701a75, #f472b6)',
    glowColor: '#f472b6'
  },
  {
    id: 'frame-higanbana-ruby',
    name: 'Higanbana Red Spider Lily & Ruby',
    category: 'Gothic & Dark',
    description: 'Glittering red ring adorned with delicate spider lilies, an angel wing, and hanging ruby talisman.',
    frameClass: 'frame-higanbana-ruby',
    previewBg: 'linear-gradient(135deg, #991b1b, #f87171)',
    glowColor: '#ef4444'
  },
  {
    id: 'frame-void-smoke',
    name: 'Phantom Void Smoke Vortex',
    category: 'Gothic & Dark',
    description: 'Turbulent translucent black smoke swirls curling into an infinite dark ring.',
    frameClass: 'frame-void-smoke',
    previewBg: 'linear-gradient(135deg, #0a0a0a, #404040)',
    glowColor: '#737373'
  },
  {
    id: 'frame-neuvillette-hydro',
    name: 'Neuvillette Hydro Dragon Chalice',
    category: 'Anime & Chibi',
    description: 'Royal Fontaine blue wave torc with silver chalice, ribbon crest, and contemplative chibi dragon.',
    frameClass: 'frame-neuvillette-hydro',
    previewBg: 'linear-gradient(135deg, #0369a1, #38bdf8)',
    glowColor: '#38bdf8'
  },
  {
    id: 'frame-briar-blood-rose',
    name: 'Thorny Iron Briar & Crimson Roses',
    category: 'Gothic & Dark',
    description: 'Cruel barbed iron thorns wrapping a circle blossoming with fresh red velvet roses.',
    frameClass: 'frame-briar-blood-rose',
    previewBg: 'linear-gradient(135deg, #450a0a, #b91c1c)',
    glowColor: '#ef4444'
  },
  {
    id: 'frame-pastel-galaxy',
    name: 'Pastel Lilac Planet Orbit',
    category: 'Anime & Chibi',
    description: 'Futuristic lavender orbital ring with satellite spheres and glowing neon four-point compass stars.',
    frameClass: 'frame-pastel-galaxy',
    previewBg: 'linear-gradient(135deg, #581c87, #a855f7)',
    glowColor: '#c084fc'
  },
  {
    id: 'frame-celestial-tiara',
    name: 'Radiant Crystal Archon Tiara',
    category: 'Celestial & Angelic',
    description: 'Lavender-tinted diamond crest with spreading wing plumes, dangling jewel, and shimmering star motes.',
    frameClass: 'frame-celestial-tiara',
    previewBg: 'linear-gradient(135deg, #4338ca, #818cf8)',
    glowColor: '#a5b4fc'
  },
  {
    id: 'frame-wolf-ears-paw',
    name: 'Frost Wolf Ears & Kitty Paw',
    category: 'Anime & Chibi',
    description: 'Fluffy white winter wolf ears, blue diamond cord, and an adorable soft pink toe bean paw pad.',
    frameClass: 'frame-wolf-ears-paw',
    previewBg: 'linear-gradient(135deg, #1e3a8a, #60a5fa)',
    glowColor: '#93c5fd'
  }
];
