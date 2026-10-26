import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  DollarSign, 
  KeyRound, 
  Crown,
  Shield,
  Star
} from 'lucide-react';
import { USSFMember, SpecialRole } from '../data/ussfData';

export interface RoleConfig {
  id: SpecialRole;
  name: string;
  shortName: string;
  description: string;
  colorHex: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  badgeClass: string;
  glowClass: string;
  icon: React.ComponentType<{ className?: string }>;
  permissions: string[];
}

export const USSF_ROLES: Record<SpecialRole, RoleConfig> = {
  'Administrator': {
    id: 'Administrator',
    name: 'Administrator',
    shortName: 'ADMIN',
    description: 'Executive management authority. Authorized to directly assign ranks, manage roles, configure events/multipliers, and review administrative audit logs.',
    colorHex: '#f59e0b',
    bgClass: 'bg-amber-950/70',
    borderClass: 'border-amber-500/70',
    textClass: 'text-amber-300',
    badgeClass: 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.25)]',
    glowClass: 'shadow-amber-500/30',
    icon: ShieldCheck,
    permissions: [
      'Direct rank assignment without promotion request',
      'Manage role assignments (eligible leaders only)',
      'Create and configure events & multipliers',
      'Access full system audit logs',
      'Manage all group data and records'
    ]
  },
  'Promotion Manager': {
    id: 'Promotion Manager',
    name: 'Promotion Manager',
    shortName: 'PROMO',
    description: 'Official personnel commissioning authority. Authorized to evaluate, approve, and deny operator rank promotion applications and record commendation citations.',
    colorHex: '#a855f7',
    bgClass: 'bg-purple-950/70',
    borderClass: 'border-purple-500/70',
    textClass: 'text-purple-300',
    badgeClass: 'bg-purple-950/80 border-purple-500/60 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.25)]',
    glowClass: 'shadow-purple-500/30',
    icon: Award,
    permissions: [
      'Evaluate promotion applications',
      'Approve and commission next ranks',
      'Deny and refund promotion points',
      'View operator career dossiers'
    ]
  },
  'Financial Manager': {
    id: 'Financial Manager',
    name: 'Financial Manager',
    shortName: 'FINANCE',
    description: 'Treasury oversight authority. Authorized to review and disburse arrest point bounties, patrol hosting claims, and audit financial transaction records.',
    colorHex: '#10b981',
    bgClass: 'bg-emerald-950/70',
    borderClass: 'border-emerald-500/70',
    textClass: 'text-emerald-300',
    badgeClass: 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.25)]',
    glowClass: 'shadow-emerald-500/30',
    icon: DollarSign,
    permissions: [
      'Review and disburse financial reward claims',
      'Verify F5 scoreboard and phone clock proof',
      'Approve daily and weekly treasury payouts',
      'Access financial transaction ledger'
    ]
  },
  'Account Recovery Manager': {
    id: 'Account Recovery Manager',
    name: 'Account Recovery Manager',
    shortName: 'RECOVERY',
    description: 'Identity verification and credentials director. Authorized to verify in-game character linkings and assist operators with account credential resets.',
    colorHex: '#06b6d4',
    bgClass: 'bg-cyan-950/70',
    borderClass: 'border-cyan-500/70',
    textClass: 'text-cyan-300',
    badgeClass: 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)]',
    glowClass: 'shadow-cyan-500/30',
    icon: KeyRound,
    permissions: [
      'Review in-game CIT2 account linking submissions',
      'Verify player CIDs and forum character names',
      'Resolve forgotten password and reset requests',
      'Commission verified players into official roster'
    ]
  }
};

/**
 * Checks if a member has a specific role or admin equivalent
 */
export function hasSpecialRole(member: USSFMember | null | undefined, role: SpecialRole): boolean {
  if (!member) return false;
  if (member.isOwner) return true;
  if (role === 'Administrator') {
    return Boolean(
      member.isAdmin || 
      (member.specialRoles && member.specialRoles.includes('Administrator')) ||
      member.isOwner
    );
  }
  return Boolean(
    member.isAdmin || 
    (member.specialRoles && member.specialRoles.includes(role)) ||
    member.isOwner
  );
}

/**
 * Requirement 1: Only eligible leaders can be assigned the Administrator role.
 * Eligible leaders: rankLevel >= 7 (First Major+), or rankCategory High Command / Field Command, or isOwner.
 */
export function isEligibleLeaderForAdmin(member: USSFMember | null | undefined): boolean {
  if (!member) return false;
  if (member.isOwner) return true;
  if (member.isApplicant || member.status === 'Applicant') return false;
  if (typeof member.rankLevel === 'number' && member.rankLevel >= 7) return true;
  if (member.rankCategory === 'High Command' || member.rankCategory === 'Field Command') return true;
  return false;
}

/**
 * Checks if member can assign/change ranks directly
 */
export function canDirectlyAssignRank(member: USSFMember | null | undefined): boolean {
  if (!member) return false;
  if (member.isOwner) return true;
  return hasSpecialRole(member, 'Administrator');
}

/**
 * Checks if member can manage role assignments
 */
export function canManageRoles(member: USSFMember | null | undefined): boolean {
  if (!member) return false;
  if (member.isOwner) return true;
  return hasSpecialRole(member, 'Administrator');
}

/**
 * Checks if member can review and approve promotion applications
 */
export function canReviewPromotions(member: USSFMember | null | undefined): boolean {
  if (!member) return false;
  if (member.isOwner) return true;
  return (
    hasSpecialRole(member, 'Administrator') ||
    hasSpecialRole(member, 'Promotion Manager') ||
    (typeof member.rankLevel === 'number' && member.rankLevel >= 7) ||
    member.rankCategory === 'High Command' ||
    member.rankCategory === 'Field Command'
  );
}

/**
 * Checks if member can review and disburse financial claims
 */
export function canReviewFinancials(member: USSFMember | null | undefined): boolean {
  if (!member) return false;
  if (member.isOwner) return true;
  return (
    hasSpecialRole(member, 'Administrator') ||
    hasSpecialRole(member, 'Financial Manager')
  );
}

/**
 * Checks if member can manage events and multipliers
 */
export function canManageEvents(member: USSFMember | null | undefined): boolean {
  if (!member) return false;
  if (member.isOwner) return true;
  return hasSpecialRole(member, 'Administrator');
}

/**
 * Checks if member can review account recoveries & character links
 */
export function canManageAccountRecovery(member: USSFMember | null | undefined): boolean {
  if (!member) return false;
  if (member.isOwner) return true;
  return (
    hasSpecialRole(member, 'Administrator') ||
    hasSpecialRole(member, 'Account Recovery Manager')
  );
}

/**
 * Unified Component to render role badges across all pages
 */
interface RoleBadgeProps {
  role: SpecialRole;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  size = 'sm',
  showLabel = true,
  className = ''
}) => {
  const config = USSF_ROLES[role];
  if (!config) return null;
  const IconComponent = config.icon;

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4'
  };

  return (
    <span
      title={`${config.name}: ${config.description}`}
      className={`inline-flex items-center rounded-md border font-data font-bold uppercase transition-all ${config.badgeClass} ${sizeStyles[size]} ${className}`}
    >
      <IconComponent className={`${iconSizes[size]} shrink-0`} />
      {showLabel && <span>{config.name}</span>}
    </span>
  );
};

/**
 * Unified Component to render all roles for a member
 */
export const MemberRoleBadges: React.FC<{
  member: USSFMember | null | undefined;
  size?: 'sm' | 'md' | 'lg';
  maxDisplay?: number;
}> = ({ member, size = 'sm', maxDisplay = 4 }) => {
  if (!member) return null;

  const roles: SpecialRole[] = [];
  if (member.isAdmin && !roles.includes('Administrator')) {
    roles.push('Administrator');
  }
  if (member.specialRoles) {
    member.specialRoles.forEach(r => {
      if (!roles.includes(r)) roles.push(r);
    });
  }

  if (roles.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {roles.slice(0, maxDisplay).map(role => (
        <RoleBadge key={role} role={role} size={size} />
      ))}
      {roles.length > maxDisplay && (
        <span className="text-[10px] font-data text-neutral-400 font-bold px-1.5 py-0.5 rounded bg-neutral-800">
          +{roles.length - maxDisplay}
        </span>
      )}
    </div>
  );
};
