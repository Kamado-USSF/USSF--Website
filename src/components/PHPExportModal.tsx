import React, { useState } from 'react';
import { X, Code, Copy, Check, Download, FileCode, Server, Shield } from 'lucide-react';
import { tacticalAudio } from '../utils/audioSynth';

interface PHPExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PHPExportModal: React.FC<PHPExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'index' | 'operations' | 'roster' | 'financial' | 'config'>('index');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const phpFiles: Record<string, { filename: string; description: string; code: string }> = {
    index: {
      filename: 'index.php',
      description: 'Main Special Forces Tactical landing page with 15s mission reel, command deck, and navigation.',
      code: `<?php
/**
 * Special Forces Command Network (CIT2 Law)
 * Main Portal: index.php
 * Host: Special Forces Web Portal
 */
require_once __DIR__ . '/config.php';

$pageTitle = "Special Forces - Ready. Disciplined. | Tactical Command Network";
$activePersonnel = 4;
$totalPayout = 80500000;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle) ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0a0c0a; color: #e5e5e5; }
        .font-tactical { font-family: 'Chakra Petch', sans-serif; }
        .font-data { font-family: 'JetBrains Mono', monospace; }
        .tactical-grid {
            background-size: 40px 40px;
            background-image: 
                linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        }
    </style>
</head>
<body class="bg-[#0a0c0a] text-neutral-100 overflow-x-hidden">

    <!-- Top Utility Bar -->
    <header class="sticky top-0 z-50 border-b border-neutral-800 bg-[#0d0f0c]/95 backdrop-blur-md">
        <div class="border-b border-neutral-800/80 px-4 py-1.5 text-[11px] font-data text-neutral-400 flex justify-between">
            <span class="text-emerald-400 font-bold">● SPECIAL FORCES NETWORK ACTIVE | PHP 8.x COMPATIBLE</span>
            <span>CIT2 LAW GROUP</span>
        </div>
        <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="index.php" class="flex items-center gap-2 font-tactical font-bold text-lg text-neutral-100 uppercase tracking-wider">
                <span class="text-amber-400">⚔</span> SPECIAL FORCES COMMAND NETWORK
            </a>
            <nav class="hidden md:flex items-center gap-6 text-xs font-tactical tracking-wider text-neutral-300">
                <a href="index.php" class="text-amber-400 font-bold">HOME</a>
                <a href="operations.php" class="hover:text-amber-400">OPERATIONS</a>
                <a href="roster.php" class="hover:text-amber-400">ROSTER</a>
                <a href="financial.php" class="hover:text-emerald-400">REWARDS & LEDGER</a>
            </nav>
            <a href="roster.php" class="px-3.5 py-1.5 rounded bg-neutral-200 text-neutral-950 font-tactical text-xs font-bold uppercase">
                OPEN ROSTER
            </a>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="relative min-h-[85vh] flex flex-col justify-center px-4 sm:px-8 border-b border-neutral-800 relative overflow-hidden">
        <div class="absolute inset-0 tactical-grid opacity-30"></div>
        <div class="relative z-10 max-w-6xl mx-auto w-full py-12">
            <div class="text-xs font-data text-amber-400 uppercase tracking-widest mb-3">
                01 / COMMAND NETWORK · SPECIAL OPERATIONS FORCES
            </div>
            
            <!-- Giant TACTICAL Heading with HUD Corner Brackets -->
            <div class="relative inline-block my-2">
                <div class="absolute -top-3 right-0 h-6 w-6 border-t-2 border-r-2 border-amber-400"></div>
                <h1 class="text-6xl sm:text-8xl lg:text-9xl font-extrabold font-tactical text-neutral-100 tracking-tight uppercase">
                    TACTICAL
                </h1>
                <div class="absolute -bottom-2 -left-3 h-6 w-6 border-b-2 border-l-2 border-amber-400"></div>
            </div>

            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                <div>
                    <h2 class="text-3xl font-bold font-tactical text-neutral-100 uppercase">
                        SPECIAL FORCES READY. DISCIPLINED.
                    </h2>
                    <p class="text-sm text-neutral-300 mt-2 font-medium">
                        "May God Have Mercy Upon Our Enemies, Cause We Won't."
                    </p>
                    <div class="mt-6 flex flex-wrap gap-3">
                        <a href="roster.php" class="px-6 py-3 rounded bg-[#d8c3a5] text-neutral-950 font-tactical font-bold text-xs uppercase tracking-wider">
                            VIEW ROSTER
                        </a>
                        <a href="#video-15s" class="px-5 py-3 rounded border border-neutral-700 bg-neutral-900 text-neutral-200 font-tactical font-bold text-xs uppercase tracking-wider">
                            WATCH 15S REEL
                        </a>
                    </div>
                </div>

                <!-- System Overview Card -->
                <div class="rounded-xl border border-neutral-800 bg-[#121512] p-6 shadow-xl">
                    <div class="flex justify-between items-center text-xs font-data mb-3">
                        <span class="text-neutral-400">SYSTEM OVERVIEW</span>
                        <span class="text-emerald-400 font-bold">● LIVE</span>
                    </div>
                    <div class="text-5xl font-bold font-data text-neutral-100"><?= $activePersonnel ?></div>
                    <div class="text-xs text-neutral-400 mt-1">Active Personnel on Duty</div>
                    <div class="mt-4 pt-4 border-t border-neutral-800 flex justify-between text-xs font-data">
                        <div>APPROVED PAYOUT: <span class="text-emerald-400 font-bold">$<?= number_format($totalPayout) ?></span></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 15s Video Reel Anchor -->
    <section id="video-15s" class="py-16 px-4 max-w-6xl mx-auto">
        <h3 class="text-2xl font-bold font-tactical uppercase text-neutral-100 mb-4">
            15-Second Operational Mission Reel
        </h3>
        <p class="text-xs text-neutral-400 mb-6">
            Synchronized timeline: Swamp Infiltration (0-3.8s) · CQB Breach (3.8-7.5s) · Night Recon (7.5-11.2s) · Exfil (11.2-15s).
        </p>
        <div class="aspect-video w-full rounded-xl border border-neutral-800 bg-black flex items-center justify-center relative overflow-hidden">
            <p class="text-neutral-500 font-data text-xs">[ Interactive Canvas 15s Video Player Embed ]</p>
        </div>
    </section>

    <footer class="border-t border-neutral-800 bg-neutral-950 py-8 px-4 text-center text-xs font-data text-neutral-500">
        &copy; <?= date('Y') ?> Special Force · CIT2 Law Group. All rights reserved.
    </footer>
</body>
</html>`
    },
    operations: {
      filename: 'operations.php',
      description: 'PHP script for managing and publishing field patrols, training logs, and hours.',
      code: `<?php
/**
 * Special Forces - Field Operations
 * operations.php
 */
require_once __DIR__ . '/config.php';

$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['publish_report'])) {
    $title = trim($_POST['title'] ?? '');
    $type = trim($_POST['type'] ?? 'Patrol');
    $host = trim($_POST['host'] ?? '');
    $hours = floatval($_POST['hours'] ?? 1.0);
    $summary = trim($_POST['summary'] ?? '');

    if ($title && $summary) {
        $newReport = [
            'id' => uniqid('rep_'),
            'title' => htmlspecialchars($title),
            'type' => htmlspecialchars($type),
            'host' => htmlspecialchars($host),
            'hours' => $hours,
            'summary' => htmlspecialchars($summary),
            'date' => date('Y-m-d')
        ];
        // Append to JSON or MySQL
        $reports = json_decode(file_get_contents(__DIR__ . '/data/reports.json') ?: '[]', true);
        array_unshift($reports, $newReport);
        file_put_contents(__DIR__ . '/data/reports.json', json_encode($reports, JSON_PRETTY_PRINT));
        $message = "Report published successfully!";
    }
}

$reports = json_decode(file_get_contents(__DIR__ . '/data/reports.json') ?: '[]', true);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Special Forces Field Operations | CIT2 Law</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <style>body { background:#0a0c0a; color:#e5e5e5; font-family:sans-serif; } .font-tactical { font-family:'Chakra Petch',sans-serif; } .font-data { font-family:'JetBrains Mono',monospace; }</style>
</head>
<body class="p-6 max-w-6xl mx-auto">
    <div class="flex justify-between items-center border-b border-neutral-800 pb-4 mb-6">
        <div>
            <span class="text-xs font-data text-amber-500 uppercase">SPECIAL FORCES / FIELD OPERATIONS</span>
            <h1 class="text-4xl font-extrabold font-tactical">Field Operations.</h1>
        </div>
        <a href="index.php" class="text-xs font-data text-neutral-400 hover:text-white">&larr; BACK TO PORTAL</a>
    </div>

    <?php if ($message): ?>
        <div class="mb-6 p-3 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-data rounded"><?= $message ?></div>
    <?php endif; ?>

    <!-- Publishing Form -->
    <div class="mb-10 p-6 rounded-xl border border-neutral-800 bg-[#121512]">
        <h2 class="text-lg font-bold font-tactical uppercase mb-4 text-neutral-100">Publish Field Report</h2>
        <form method="POST" class="space-y-4 text-xs font-data">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-neutral-400 mb-1">TITLE</label>
                    <input type="text" name="title" required class="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white">
                </div>
                <div>
                    <label class="block text-neutral-400 mb-1">TYPE</label>
                    <select name="type" class="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white">
                        <option>Patrol</option>
                        <option>Training</option>
                        <option>Combat</option>
                    </select>
                </div>
                <div>
                    <label class="block text-neutral-400 mb-1">HOST NAME & CID</label>
                    <input type="text" name="host" placeholder="Operator (SF-001)" required class="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white">
                </div>
            </div>
            <div>
                <label class="block text-neutral-400 mb-1">SUMMARY</label>
                <textarea name="summary" rows="3" required class="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white"></textarea>
            </div>
            <button type="submit" name="publish_report" class="px-5 py-2 rounded bg-neutral-200 text-neutral-950 font-bold uppercase font-tactical">
                Publish Report
            </button>
        </form>
    </div>
</body>
</html>`
    },
    roster: {
      filename: 'roster.php',
      description: 'PHP script for Special Forces official roster, rank hierarchy, and live personnel search.',
      code: `<?php
/**
 * Special Forces - Official Roster
 * roster.php
 */
require_once __DIR__ . '/config.php';

$search = trim($_GET['q'] ?? '');
$members = json_decode(file_get_contents(__DIR__ . '/data/members.json') ?: '[]', true);

if ($search) {
    $members = array_filter($members, function($m) use ($search) {
        return stripos($m['name'], $search) !== false || 
               stripos($m['cid'], $search) !== false || 
               stripos($m['rank'], $search) !== false;
    });
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Special Forces Official Roster | Special Forces.rf.gd</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <style>body { background:#0a0c0a; color:#e5e5e5; } .font-tactical { font-family:'Chakra Petch',sans-serif; } .font-data { font-family:'JetBrains Mono',monospace; }</style>
</head>
<body class="p-6 max-w-6xl mx-auto">
    <div class="flex justify-between items-center border-b border-neutral-800 pb-4 mb-6">
        <div>
            <div class="text-xs font-data text-neutral-400 uppercase">OFFICIAL IDENTITY VERIFICATION</div>
            <h1 class="text-5xl font-extrabold font-tactical">SPECIAL FORCES ROSTER</h1>
        </div>
        <a href="index.php" class="text-xs font-data text-neutral-400 hover:text-white">&larr; BACK TO PORTAL</a>
    </div>

    <!-- Search Form -->
    <form method="GET" class="mb-8 flex gap-3">
        <input type="text" name="q" value="<?= htmlspecialchars($search) ?>" placeholder="SEARCH NAME, RANK, OR CID..." class="flex-1 p-3 rounded bg-neutral-900 border border-neutral-700 text-xs font-data text-white">
        <button type="submit" class="px-6 py-3 rounded bg-amber-500 text-neutral-950 font-bold uppercase font-tactical text-xs">Search</button>
    </form>

    <!-- Personnel Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <?php foreach ($members as $m): ?>
            <div class="p-5 rounded-xl border border-neutral-800 bg-[#121512]">
                <div class="flex justify-between text-xs font-data text-neutral-400 mb-2">
                    <span class="text-amber-400 font-bold"><?= htmlspecialchars($m['cid']) ?></span>
                    <span class="text-emerald-400 font-bold"><?= htmlspecialchars($m['status']) ?></span>
                </div>
                <h3 class="text-2xl font-bold font-tactical"><?= htmlspecialchars($m['name']) ?></h3>
                <div class="text-xs text-neutral-400 font-data mb-2"><?= htmlspecialchars($m['rank']) ?> · <?= htmlspecialchars($m['division']) ?></div>
                <div class="text-xs font-data text-emerald-400 font-bold pt-2 border-t border-neutral-800">
                    LIFETIME EARNINGS: $<?= number_format($m['totalPayout']) ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</body>
</html>`
    },
    financial: {
      filename: 'financial.php',
      description: 'PHP script for financial payouts, ledger snapshot ($80.5M), and reward claim handling.',
      code: `<?php
/**
 * Special Forces - Financial Department
 * financial.php
 */
require_once __DIR__ . '/config.php';

$totalApproved = 80500000;
$claims = json_decode(file_get_contents(__DIR__ . '/data/claims.json') ?: '[]', true);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Special Forces Financial Department | Special Forces.rf.gd</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet">
    <style>body { background:#0a0c0a; color:#e5e5e5; } .font-tactical { font-family:'Chakra Petch',sans-serif; } .font-data { font-family:'JetBrains Mono',monospace; }</style>
</head>
<body class="p-6 max-w-6xl mx-auto">
    <div class="flex justify-between items-center border-b border-neutral-800 pb-4 mb-6">
        <div>
            <div class="text-xs font-data text-neutral-400 uppercase">FINANCIAL DEPARTMENT | SPECIAL FORCES</div>
            <h1 class="text-5xl font-extrabold font-tactical">A clearer payout.</h1>
        </div>
        <a href="index.php" class="text-xs font-data text-neutral-400 hover:text-white">&larr; BACK TO PORTAL</a>
    </div>

    <!-- Ledger Snapshot (Matching Video $80,500,000) -->
    <div class="mb-10 p-6 rounded-xl border border-neutral-800 bg-[#121512] flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
            <div class="text-xs font-data text-neutral-400 uppercase">LEDGER SNAPSHOT · APPROVED PAYOUT</div>
            <div class="text-5xl font-black font-data text-emerald-400 mt-1">
                $<?= number_format($totalApproved) ?>
            </div>
            <div class="text-xs text-neutral-400 mt-2 font-data">RECIPIENT: <strong class="text-white">Active Personnel</strong> (Authorized Claim)</div>
        </div>
        <a href="#submit-claim" class="mt-4 md:mt-0 px-6 py-3 rounded bg-neutral-100 text-neutral-950 font-bold uppercase font-tactical text-xs">
            BUILD REQUEST
        </a>
    </div>

    <!-- Recent Submissions Feed -->
    <div class="space-y-4">
        <h2 class="text-xl font-bold font-tactical uppercase">Recent Ledger Submissions</h2>
        <?php foreach ($claims as $c): ?>
            <div class="p-4 rounded-xl border border-neutral-800 bg-[#0e110e]">
                <div class="flex justify-between text-xs font-data mb-1">
                    <span class="text-neutral-400"><?= htmlspecialchars($c['date']) ?></span>
                    <span class="text-emerald-400 font-bold uppercase"><?= htmlspecialchars($c['status']) ?></span>
                </div>
                <div class="text-3xl font-black font-data text-emerald-400">$<?= number_format($c['amount']) ?></div>
                <div class="text-sm font-bold font-tactical uppercase mt-1"><?= htmlspecialchars($c['rewardTitle']) ?></div>
                <div class="text-xs font-data text-neutral-500 mt-2">CLAIMANT: <?= htmlspecialchars($c['claimantName']) ?> (<?= htmlspecialchars($c['claimantCid']) ?>)</div>
            </div>
        <?php endforeach; ?>
    </div>
</body>
</html>`
    },
    config: {
      filename: 'config.php',
      description: 'Core PHP configuration, database connection, and helper utilities.',
      code: `<?php
/**
 * Special Forces Command Network Configuration
 * config.php
 */

// Host Configuration
define('SITE_NAME', 'Special Forces Special Force - CIT2 Law Group');
define('BASE_URL', 'http://ussf.rf.gd');
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'ussf_db');

// Error reporting in development
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Security Helper
function sanitize($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}
?>`
    }
  };

  const currentFile = phpFiles[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    tacticalAudio.playTargetLock();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    tacticalAudio.playRadioSquelch();
    const blob = new Blob([currentFile.code], { type: 'text/x-php' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl rounded-2xl border border-neutral-700 bg-neutral-900 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 p-5 bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-400">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-tactical uppercase text-neutral-100 flex items-center gap-2">
                <span>SPECIAL FORCES PHP SERVER CODE EXPORT KIT</span>
                <span className="text-[10px] rounded bg-emerald-950 border border-emerald-800 text-emerald-400 px-2 py-0.5 font-data">
                  PHP 8.x READY
                </span>
              </h3>
              <p className="text-xs text-neutral-400 font-sans">
                Full standalone PHP files ready to upload directly to your web server (Special Forces.rf.gd / Apache / Nginx).
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-950/80 px-5 pt-3 overflow-x-auto text-xs font-data">
          {(['index', 'operations', 'roster', 'financial', 'config'] as const).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => {
                tacticalAudio.playTacticalClick();
                setActiveTab(tabKey);
              }}
              className={`flex items-center gap-2 px-3 py-2 border-b-2 font-bold uppercase transition-colors whitespace-nowrap ${
                activeTab === tabKey
                  ? 'border-emerald-500 text-emerald-400 bg-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>{phpFiles[tabKey].filename}</span>
            </button>
          ))}
        </div>

        {/* Code Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3 bg-[#0c0e0c]">
          <div className="flex items-center justify-between text-xs font-data text-neutral-400">
            <span>{currentFile.description}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-neutral-700 bg-neutral-800 text-neutral-200 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY PHP CODE'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500 text-neutral-950 font-bold uppercase hover:bg-emerald-400 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>DOWNLOAD FILE</span>
              </button>
            </div>
          </div>

          <pre className="rounded-xl border border-neutral-800 bg-[#070907] p-4 text-xs font-data text-neutral-200 overflow-x-auto leading-relaxed selection:bg-emerald-600 selection:text-white">
            <code>{currentFile.code}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800 p-4 bg-neutral-950 flex flex-wrap items-center justify-between text-xs font-data text-neutral-500">
          <div>HOW TO USE: Save files into your public_html or htdocs directory on Special Forces.rf.gd.</div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white uppercase font-bold">
            CLOSE [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
