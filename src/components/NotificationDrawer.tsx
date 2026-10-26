import React from 'react';
import { 
  Bell, Check, X, Shield, Gift, AlertTriangle, 
  MessageSquare, DollarSign, Award, Clock
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioSynth';

export interface TacticalNotification {
  id: string;
  type: 'bonus' | 'streak' | 'claim' | 'social' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: TacticalNotification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onClaimDailyBonus?: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
  onClaimDailyBonus
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md h-full bg-[#0d100d] border-l border-neutral-800 p-5 flex flex-col justify-between shadow-2xl text-neutral-100 font-sans">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded bg-amber-950/70 border border-amber-500/40 text-amber-400">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-tactical uppercase font-bold text-white">
                  TACTICAL NOTIFICATIONS
                </h3>
                <span className="text-[10px] font-data text-neutral-400">
                  {unreadCount} UNREAD DISPATCHES
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between text-xs font-data text-neutral-400 mb-4 px-1">
            <button
              onClick={() => {
                tacticalAudio.playTacticalClick();
                onMarkAllRead();
              }}
              className="hover:text-amber-400 transition-colors"
            >
              Mark all as read
            </button>
            <button
              onClick={() => {
                tacticalAudio.playTacticalClick();
                onClearAll();
              }}
              className="hover:text-rose-400 transition-colors"
            >
              Clear all
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-neutral-500 text-xs font-data">
                No active notifications. Tactical channels clear.
              </div>
            ) : (
              notifications.map(n => {
                let Icon = Bell;
                let colorClass = 'text-amber-400 border-amber-500/30 bg-amber-950/20';

                if (n.type === 'bonus') {
                  Icon = Gift;
                  colorClass = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
                } else if (n.type === 'streak') {
                  Icon = AlertTriangle;
                  colorClass = 'text-rose-400 border-rose-500/40 bg-rose-950/30';
                } else if (n.type === 'claim') {
                  Icon = DollarSign;
                  colorClass = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
                } else if (n.type === 'social') {
                  Icon = MessageSquare;
                  colorClass = 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30';
                }

                return (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-xl border text-xs transition-all ${
                      n.isRead
                        ? 'border-neutral-800 bg-neutral-950/60 opacity-75'
                        : `${colorClass} shadow-md`
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-tactical font-bold text-neutral-100 uppercase">
                            {n.title}
                          </span>
                          <span className="text-[10px] font-data text-neutral-500">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-neutral-300 font-sans text-[11px] leading-relaxed">
                          {n.message}
                        </p>

                        {/* Unclaimed bonus button action */}
                        {n.type === 'bonus' && onClaimDailyBonus && (
                          <button
                            onClick={() => {
                              tacticalAudio.playTargetLock();
                              onClaimDailyBonus();
                            }}
                            className="mt-2 text-[10px] font-tactical uppercase px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold transition-colors cursor-pointer"
                          >
                            CLAIM TODAY'S REWARD ($1,000,000)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-800 text-[10px] font-data text-neutral-500 text-center">
          SPECIAL FORCES PUSH TELEMETRY · SAN ANDREAS LAW
        </div>
      </div>
    </div>
  );
};
