export interface VideoScene {
  id: string;
  sceneNumber: string;
  title: string;
  subtitle: string;
  startTime: number;
  endTime: number;
  imageSrc: string;
  aspect: string;
  referenceDoc: string;
  cameraMotion: 'pan-left' | 'push-in' | 'dolly-zoom' | 'drift-up';
  hudColor: string;
  telemetry: {
    lat: string;
    lon: string;
    azimuth: string;
    range: string;
    status: string;
    opticalMode: string;
  };
  radioChatter: string;
  briefing: string;
}

export const VIDEO_SCENES: VideoScene[] = [
  {
    id: 'swamp-ops',
    sceneNumber: '01 / 08',
    title: 'SWAMP INFILTRATION',
    subtitle: 'NIGHT AMPHIBIOUS INSERTION · RED IR LASER PEQ',
    startTime: 0,
    endTime: 4.0,
    imageSrc: '/src/assets/images/scene_swamp_night_ops_1790341930336.jpg',
    aspect: '16:9',
    referenceDoc: 'Swamp rain night ops with targeting laser beams (Reference Image 3)',
    cameraMotion: 'push-in',
    hudColor: '#ef4444',
    telemetry: {
      lat: '29°58\'14.2"N',
      lon: '89°42\'38.1"W',
      azimuth: '084° ENE',
      range: '120m',
      status: 'SUBMERGED // SILENT APPROACH',
      opticalMode: 'DUAL NODs + IR LASER'
    },
    radioChatter: 'Echo-4 in position. Sub-surface entry complete. Red lasers active.',
    briefing: 'Deep water insertion via blackwater cypress waterways. All primary optical illuminators switched to covert red spectrum to penetrate dense mist and prevent night vision blooming.'
  },
  {
    id: 'cqb-breach',
    sceneNumber: '02 / 08',
    title: 'CQB STAIRWELL BREACH',
    subtitle: 'VERTICAL CLEARANCE · 1,200 LUMEN ILLUMINATION',
    startTime: 4.0,
    endTime: 8.0,
    imageSrc: '/src/assets/images/scene_cqb_stairwell_breach_1790341945314.jpg',
    aspect: '16:9',
    referenceDoc: 'SWAT operators clearing concrete stairwell in deep shadow (Reference Image 2)',
    cameraMotion: 'drift-up',
    hudColor: '#38bdf8',
    telemetry: {
      lat: '34°03\'22.0"N',
      lon: '118°14\'55.3"W',
      azimuth: '192° SSW',
      range: '15m CQB',
      status: 'BREACHING LEVEL 02',
      opticalMode: 'HIGH-LUMEN WEAPON LIGHT'
    },
    radioChatter: 'Breaching floor two stairwell. Flash and clear, stay tight.',
    briefing: 'High-speed urban clearance through vertical access corridors. Weapon-mounted tactical illuminators provide instant target identification in zero-light concrete structures.'
  },
  {
    id: 'nvg-recon',
    sceneNumber: '03 / 08',
    title: 'NIGHT SECTOR RECON',
    subtitle: 'SUPPRESSED OVERWATCH · WHITE PHOSPHOR NVG',
    startTime: 8.0,
    endTime: 12.0,
    imageSrc: '/src/assets/images/scene_night_vision_recon_1790341968068.jpg',
    aspect: '16:9',
    referenceDoc: 'Grainy night vision dual operator targeting with suppressed rifles (Reference Image 4)',
    cameraMotion: 'pan-left',
    hudColor: '#22c55e',
    telemetry: {
      lat: '36°11\'09.8"N',
      lon: '115°08\'59.1"W',
      azimuth: '345° NNW',
      range: '340m OVERWATCH',
      status: 'SECTOR LOCKED // SUPPRESSED',
      opticalMode: 'GEN-3 WHITE PHOSPHOR'
    },
    radioChatter: 'Sniper team holds north sector. Target acquired, no collateral.',
    briefing: 'Extended perimeter surveillance utilizing gen-3 quad-tube night vision systems with matched IR illuminators for target positive identification at 300+ meters.'
  },
  {
    id: 'skyward-exfil',
    sceneNumber: '04 / 08',
    title: 'EXTRACTION FORMATION',
    subtitle: '360° SKYWARD DEFENSE · AIRBORNE DUSTOFF',
    startTime: 12.0,
    endTime: 16.0,
    imageSrc: '/src/assets/images/scene_skyward_circle_team_1790341985671.jpg',
    aspect: '16:9',
    referenceDoc: 'Upward looking circle of tactical operators with gas masks (Reference Image 1)',
    cameraMotion: 'dolly-zoom',
    hudColor: '#f59e0b',
    telemetry: {
      lat: '32°43\'11.6"N',
      lon: '117°09\'28.4"W',
      azimuth: '012° NNE',
      range: 'LZ ALPHA',
      status: 'DUSTOFF INBOUND // 100% READY',
      opticalMode: 'CBRN GAS MASK + HELMET MPLS'
    },
    radioChatter: 'Exfil bird inbound 15 seconds. Perimeter secure. Ready for pickup.',
    briefing: '360-degree security circle established under open sky. Helmet-mounted MPLS signaling systems guide extraction aircraft for rapid exfiltration.'
  },
  {
    id: 'desert-intercept',
    sceneNumber: '05 / 08',
    title: 'DESERT HEAVY INTERDICTION',
    subtitle: '50-CAL GUN-TRUCK PATROL · BORDER PURSUIT',
    startTime: 16.0,
    endTime: 20.0,
    imageSrc: '/src/assets/images/hero_tactical_desert_1790341915780.jpg',
    aspect: '16:9',
    referenceDoc: 'Long range desert tactical patrol in Bone County',
    cameraMotion: 'pan-left',
    hudColor: '#eab308',
    telemetry: {
      lat: '35°18\'40.1"N',
      lon: '114°44\'12.5"W',
      azimuth: '220° SW',
      range: '650m INTERCEPT',
      status: 'CONVOY SPEED 85 MPH',
      opticalMode: 'LONG RANGE THERMAL SIGHT'
    },
    radioChatter: 'Command, intercepting felony transport near Verdant Meadows airstrip. Engaging 50-cal cover.',
    briefing: 'Heavy mechanized patrol deployed along desert highway arteries. High-caliber vehicle mounts provide kinetic interdiction against armored target convoys.'
  },
  {
    id: 'night-raid-breach',
    sceneNumber: '06 / 08',
    title: 'URBAN BEARCAT NIGHT RAID',
    subtitle: 'ARMORED CQB BREACH · FLASHBANG ASSAULT',
    startTime: 20.0,
    endTime: 24.0,
    imageSrc: '/src/assets/images/hero_night_raid_1790347363090.jpg',
    aspect: '16:9',
    referenceDoc: 'Urban night breach team with BearCat armored vehicle',
    cameraMotion: 'push-in',
    hudColor: '#ef4444',
    telemetry: {
      lat: '34°02\'15.8"N',
      lon: '118°15\'01.2"W',
      azimuth: '045° NE',
      range: '25m URBAN',
      status: 'DOOR BLOWN // FLASH DEPLOYED',
      opticalMode: 'FLIR THERMAL SCAN'
    },
    radioChatter: 'Breach, breach, breach! BearCat laying suppressive lighting. Suspects barricaded in rear hall.',
    briefing: 'High-threat dynamic warrant service executed under heavy armored cover. Synchronized flashbang charges and dynamic entries disorient hostile personnel.'
  },
  {
    id: 'mountain-dawn-scout',
    sceneNumber: '07 / 08',
    title: 'DAWN MOUNTAIN VALLEY SCOUT',
    subtitle: 'HIGH-ALTITUDE RECON · SATELLITE UPLINK',
    startTime: 24.0,
    endTime: 28.0,
    imageSrc: '/src/assets/images/hero_morning_patrol_1790422704024.jpg',
    aspect: '16:9',
    referenceDoc: 'Mountain patrol at dawn with drones and recon squad',
    cameraMotion: 'drift-up',
    hudColor: '#10b981',
    telemetry: {
      lat: '36°42\'30.0"N',
      lon: '118°18\'14.0"W',
      azimuth: '110° ESE',
      range: '1,200m RIDGE',
      status: 'DRONE RECON AIRBORNE',
      opticalMode: 'MULTI-SPECTRUM RECON'
    },
    radioChatter: 'Drone camera feed online. Mountain trails cleared. No insurgent activity observed.',
    briefing: 'High-mobility foot patrol traversing difficult mountain ridgelines at dawn. Handheld drone telemetry synchronized with CIT2 command HQ.'
  },
  {
    id: 'combined-theater-war',
    sceneNumber: '08 / 08',
    title: 'COMBINED ARMS AIR-GROUND ASSAULT',
    subtitle: 'JET AIR SUPERIORITY · TANK BATTLE FORMATION',
    startTime: 28.0,
    endTime: 32.0,
    imageSrc: '/src/assets/images/combined_arms_assault_1790348050560.jpg',
    aspect: '16:9',
    referenceDoc: 'Full scale combined arms battle with tanks, helicopters and fighter jets',
    cameraMotion: 'dolly-zoom',
    hudColor: '#8b5cf6',
    telemetry: {
      lat: '34°55\'00.0"N',
      lon: '116°50\'00.0"W',
      azimuth: '000° TRUE NORTH',
      range: 'THEATER ALL-CLEAR',
      status: 'MISSION ACCOMPLISHED',
      opticalMode: 'FULL COMBINED RADAR'
    },
    radioChatter: 'All strike wings, objective neutralized. Returning to Special Forces airfield base.',
    briefing: 'Maximum escalation protocol integrating heavy ground armor, loitering loiter drones, close air support fighter jets, and Blackhawk troop insertion.'
  }
];

export interface TacticalProduct {
  id: string;
  name: string;
  category: 'helmet' | 'headlamp' | 'weapon' | 'subsurface' | 'handheld';
  categoryLabel: string;
  lumens: number;
  runtime: string;
  waterproofRating: string;
  beamDistance: string;
  weight: string;
  modes: string[];
  price: number;
  description: string;
  mountType: string;
  inStock: boolean;
}

export const TACTICAL_PRODUCTS: TacticalProduct[] = [
  {
    id: 'charge-mpls-pro',
    name: 'CHARGE MPLS PRO HELMET LIGHT',
    category: 'helmet',
    categoryLabel: 'MPLS HELMET LIGHTS',
    lumens: 65,
    runtime: '46 Hours',
    waterproofRating: 'IPX7 (1 Meter)',
    beamDistance: '30 Meters',
    weight: '47g (1.6 oz)',
    modes: ['White Spot', 'Red Navigation', 'Green NVG-Safe', 'IR 850nm Beacon'],
    price: 139,
    description: 'The standard for military helmet illumination. Flexible neck directing beam precisely where needed, programmable default start in stealth color.',
    mountType: 'ARC Rail / Team Wendy / M-LOK / MOLLE',
    inStock: true
  },
  {
    id: 'apex-extreme-ops',
    name: 'APEX EXTREME TACTICAL HEADLAMP',
    category: 'headlamp',
    categoryLabel: 'MPLS HEADLAMPS',
    lumens: 550,
    runtime: '150 Hours',
    waterproofRating: 'IPX8 (20 Meters)',
    beamDistance: '120 Meters',
    weight: '279g (9.8 oz)',
    modes: ['Maxbright Focus Spot', 'Regulated High', 'Dual Flood', 'Safety Strobe'],
    price: 189,
    description: 'High-power pinnacle headlamp featuring a Maxbright LED beam coupled with regulated circuitry to maintain peak brightness throughout battery life.',
    mountType: 'Tactical Headband / NVG Shroud Bracket',
    inStock: true
  },
  {
    id: 'vizz-tactical-ir',
    name: 'VIZZ TACTICAL MULTI-SPECTRUM',
    category: 'headlamp',
    categoryLabel: 'HEADLAMPS',
    lumens: 420,
    runtime: '110 Hours',
    waterproofRating: 'IPX7 (1 Meter)',
    beamDistance: '85 Meters',
    weight: '92g (3.2 oz)',
    modes: ['Dimmable White', 'Red Covert', 'Blue Blood-Tracking', 'IR Stealth'],
    price: 115,
    description: 'Featherlight multi-spectrum headlamp designed for field patrols, map reading, and stealth tactical night maneuvers.',
    mountType: 'Elastic Crown Strap / MOLLE Clip',
    inStock: true
  },
  {
    id: 'sector-spear-illuminator',
    name: 'SECTOR SPEAR WEAPON ILLUMINATOR',
    category: 'weapon',
    categoryLabel: 'HANDHELDS & WEAPON LIGHTS',
    lumens: 1250,
    runtime: '4.5 Hours',
    waterproofRating: 'IPX8 (20 Meters)',
    beamDistance: '420 Meters',
    weight: '165g (5.8 oz)',
    modes: ['Momentary High', 'Constant High', 'Low Recon', '18Hz Tactical Strobe'],
    price: 245,
    description: 'Machined from 7075-T6 hardcoat anodized aerospace aluminum. Extreme candela throw designed for rifle mounted long-range target positive ID.',
    mountType: 'Picatinny 1913 / M-LOK Direct',
    inStock: true
  },
  {
    id: 'abyss-amphibious-100m',
    name: 'ABYSS AMPHIBIOUS SUB-SURFACE LIGHT',
    category: 'subsurface',
    categoryLabel: 'ACCESSORIES & AMPHIBIOUS',
    lumens: 950,
    runtime: '8 Hours',
    waterproofRating: 'IPX8 (100 Meters Submersible)',
    beamDistance: '210 Meters',
    weight: '310g (10.9 oz)',
    modes: ['High Penetration', 'Medium Search', 'Low Egress', 'SOS Marine Beacon'],
    price: 280,
    description: 'Pressure-tested for special operations combat divers and underwater reconnaissance. Magnetic sliding switch impervious to saltwater corrosion.',
    mountType: 'Goodman Dive Handle / Lanyard / D-Ring',
    inStock: true
  },
  {
    id: 'helstar-beacon-iff',
    name: 'HELSTAR AIRBORNE IFF STROBE',
    category: 'helmet',
    categoryLabel: 'MPLS HELMET LIGHTS',
    lumens: 80,
    runtime: '96 Hours',
    waterproofRating: 'IPX8 (10 Meters)',
    beamDistance: '3 Nautical Miles',
    weight: '68g (2.4 oz)',
    modes: ['Visible White Flash', 'Covert IR Flash', 'Steady Green', 'Programmable Code'],
    price: 195,
    description: 'Omnidirectional multi-function IFF (Identification Friend or Foe) marker for airborne jumps, extraction signaling, and tactical squad cohesion.',
    mountType: 'Velcro Hook & Loop / Rail Clamp',
    inStock: true
  }
];

export interface ForcePillar {
  id: string;
  pillarNumber: string;
  title: string;
  kicker: string;
  headline: string;
  description: string;
  imageSrc: string;
  badge: string;
  points: string[];
}

export const FORCE_PILLARS: ForcePillar[] = [
  {
    id: 'teamwork-leadership',
    pillarNumber: '01',
    title: 'TEAMWORK & LEADERSHIP',
    kicker: 'CREATING MILITARY LEADERS',
    headline: 'Unified Command Under Extreme Duress',
    description: 'Modern tactical doctrine requires seamless synchronization across squad levels. Leaders are forged in high-intensity operational simulations where split-second communications dictate mission survivability.',
    imageSrc: '/src/assets/images/military_leader_training_1790341999734.jpg',
    badge: 'COMMAND ACADEMY',
    points: [
      'Multi-domain squad level communication systems',
      'Tactical decision games under zero-visibility conditions',
      'Adaptive leadership in high-friction environments'
    ]
  },
  {
    id: 'developing-discipline',
    pillarNumber: '02',
    title: 'DEVELOPING DISCIPLINE',
    kicker: 'DOCTRINE & EXECUTION',
    headline: 'Standard Operating Procedures as Second Nature',
    description: 'Tactical discipline separates professional forces from combat chaos. Rigorous weapons handling, night-vision navigation, light discipline, and redundant equipment checks ensure zero catastrophic failures.',
    imageSrc: '/src/assets/images/scene_cqb_stairwell_breach_1790341945314.jpg',
    badge: 'TACTICAL EXCELLENCE',
    points: [
      'Zero-light white light / IR discipline protocols',
      'Breaching choreography & sector containment',
      'Physical endurance & combat load mastery'
    ]
  },
  {
    id: 'combat-education',
    pillarNumber: '03',
    title: 'EDUCATION OF TACTICAL UNITS',
    kicker: 'FUTURE WARFARE CAPABILITIES',
    headline: 'Advanced Optical & Electronic Warfare Integration',
    description: 'Providing elite operators with deep masteries of electro-optical systems, satellite telemetry, sub-surface rebreathers, and drone counter-measures for 21st century operational theaters.',
    imageSrc: '/src/assets/images/scene_skyward_circle_team_1790341985671.jpg',
    badge: 'SPECIALIZED COMBAT',
    points: [
      'Gen-3 & thermal fusion optical operator certification',
      'Amphibious insertion and silent rebreather egress',
      'Tactical emergency casualty care (TCCC) under fire'
    ]
  }
];
