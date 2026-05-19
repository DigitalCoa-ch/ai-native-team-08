'use client';

import { useEffect, useState, useCallback } from 'react';
import '../page.css';

type CampaignStatus = 'ACTIVE' | 'FLAGGED' | 'UNDER REVIEW' | 'ESCROW FROZEN';
type ViolationSeverity = 'critical' | 'high' | 'medium' | 'low';

interface Campaign {
  id: string; brand: string; influencer: string; platform: string;
  budget: string; status: CampaignStatus; aiScore: number;
  escrowFrozen: boolean; lastUpdate: string; postsDue: number; postsDelivered: number;
}

interface Violation {
  id?: number; campaignId: string; influencer: string; severity: ViolationSeverity;
  type: string; description: string; time: string;
}

interface AuditEntry {
  id: number; timestamp: string; actor: string; action: string; target: string; outcome: string;
}

interface LogEntry {
  id: number; ts: string; level: string; msg: string;
}

const CAMPAIGNS: Campaign[] = [
  { id: 'CP-001', brand: 'Meshki', influencer: '@fashionnova_', platform: 'Instagram', budget: '$12,400', status: 'ACTIVE', aiScore: 91, escrowFrozen: false, lastUpdate: '2s ago', postsDue: 4, postsDelivered: 2 },
  { id: 'CP-002', brand: 'Meshki', influencer: '@glowbygrace', platform: 'TikTok', budget: '$8,200', status: 'UNDER REVIEW', aiScore: 67, escrowFrozen: false, lastUpdate: '14s ago', postsDue: 3, postsDelivered: 1 },
  { id: 'CP-003', brand: 'Meshki', influencer: '@stylemark', platform: 'Instagram', budget: '$5,100', status: 'FLAGGED', aiScore: 38, escrowFrozen: false, lastUpdate: '31s ago', postsDue: 2, postsDelivered: 0 },
  { id: 'CP-004', brand: 'Meshki', influencer: '@luxe.edit', platform: 'YouTube', budget: '$22,000', status: 'ACTIVE', aiScore: 88, escrowFrozen: false, lastUpdate: '1m ago', postsDue: 6, postsDelivered: 6 },
  { id: 'CP-005', brand: 'Meshki', influencer: '@everydayelegance', platform: 'Instagram', budget: '$7,800', status: 'ESCROW FROZEN', aiScore: 22, escrowFrozen: true, lastUpdate: '2m ago', postsDue: 3, postsDelivered: 0 },
  { id: 'CP-006', brand: 'Meshki', influencer: '@minimalist.style', platform: 'TikTok', budget: '$4,500', status: 'ACTIVE', aiScore: 74, escrowFrozen: false, lastUpdate: '3m ago', postsDue: 2, postsDelivered: 1 },
  { id: 'CP-007', brand: 'Meshki', influencer: '@aesthetic.ly', platform: 'Instagram', budget: '$9,300', status: 'UNDER REVIEW', aiScore: 55, escrowFrozen: false, lastUpdate: '5m ago', postsDue: 4, postsDelivered: 2 },
  { id: 'CP-008', brand: 'Meshki', influencer: '@streetwearh', platform: 'YouTube', budget: '$31,000', status: 'FLAGGED', aiScore: 31, escrowFrozen: true, lastUpdate: '7m ago', postsDue: 5, postsDelivered: 0 },
];

const VIOLATION_POOL = [
  { campaignId: 'CP-001', influencer: '@fashionnova_', severity: 'critical' as ViolationSeverity, type: 'Fake Engagement Pattern', description: 'Bot-like follower spike detected - 340% above baseline' },
  { campaignId: 'CP-002', influencer: '@glowbygrace', severity: 'high' as ViolationSeverity, type: 'Sentiment Shift', description: 'Negative sentiment ratio crossed 0.4 threshold in last 48h' },
  { campaignId: 'CP-003', influencer: '@stylemark', severity: 'high' as ViolationSeverity, type: 'Brand Mismatch', description: 'Content tone incompatible with brand guidelines score 0.78' },
  { campaignId: 'CP-005', influencer: '@everydayelegance', severity: 'medium' as ViolationSeverity, type: 'Late Delivery', description: '2 posts missed scheduled publish window by >24h' },
  { campaignId: 'CP-008', influencer: '@streetwearh', severity: 'critical' as ViolationSeverity, type: 'Policy Violation', description: 'Platform ToS breach flagged - content removed' },
  { campaignId: 'CP-003', influencer: '@stylemark', severity: 'medium' as ViolationSeverity, type: 'Flagged Keyword', description: 'Restricted category keyword detected in caption' },
  { campaignId: 'CP-007', influencer: '@aesthetic.ly', severity: 'low' as ViolationSeverity, type: 'Undisclosed Sponsor', description: 'Post lacks #ad or sponsored disclosure tag' },
  { campaignId: 'CP-006', influencer: '@minimalist.style', severity: 'high' as ViolationSeverity, type: 'Engagement Drop', description: 'Average likes fell below campaign benchmark by 58%' },
];

const AUDIT_SEED: AuditEntry[] = [
  { id: 1, timestamp: '17:08:42', actor: 'System', action: 'ESCROW_RELEASED', target: 'CP-001 / @fashionnova_', outcome: 'approved' },
  { id: 2, timestamp: '17:07:15', actor: 'Analyst', action: 'FLAGGED_CAMPAIGN', target: 'CP-003 / @stylemark', outcome: 'flagged' },
  { id: 3, timestamp: '17:05:01', actor: 'System', action: 'AI_SCAN_COMPLETE', target: 'CP-006 / @minimalist.style', outcome: 'approved' },
  { id: 4, timestamp: '17:02:18', actor: 'Analyst', action: 'APPROVED_INFLUENCER', target: 'CP-004 / @luxe.edit', outcome: 'approved' },
  { id: 5, timestamp: '17:00:55', actor: 'System', action: 'ESCROW_FROZEN', target: 'CP-005 / @everydayelegance', outcome: 'frozen' },
  { id: 6, timestamp: '16:59:02', actor: 'System', action: 'VIOLATION_DETECTED', target: 'CP-008 / @streetwearh', outcome: 'flagged' },
  { id: 7, timestamp: '16:57:44', actor: 'Admin', action: 'OVERRIDE_ESCROW', target: 'CP-002 / @glowbygrace', outcome: 'info' },
  { id: 8, timestamp: '16:55:30', actor: 'System', action: 'CAMPAIGN_MARKED_ACTIVE', target: 'CP-007 / @aesthetic.ly', outcome: 'approved' },
  { id: 9, timestamp: '16:53:11', actor: 'Analyst', action: 'UNDER_REVIEW_OPENED', target: 'CP-002 / @glowbygrace', outcome: 'info' },
  { id: 10, timestamp: '16:51:05', actor: 'System', action: 'AI_ALERT_TRIGGERED', target: 'CP-001 / @fashionnova_', outcome: 'warn' },
];

const LOG_MSGS = [
  { level: 'info', msg: 'AI scan cycle completed - 8 campaigns analyzed' },
  { level: 'success', msg: 'Escrow released for CP-001 / @fashionnova_ - $12,400' },
  { level: 'warn', msg: 'CP-003 status changed FLAGGED -> UNDER REVIEW' },
  { level: 'error', msg: 'CP-005 escrow freeze enforced - AI confidence below threshold' },
  { level: 'info', msg: 'Violation logged: @streetwearh - Fake Engagement Pattern' },
  { level: 'success', msg: 'CP-004 delivery complete - all 6 posts approved' },
  { level: 'warn', msg: 'CP-002 under review - awaiting analyst decision' },
  { level: 'info', msg: 'Audit log exported - 47 entries since 08:00 UTC' },
  { level: 'success', msg: 'Real-time monitor connected - streaming 4 data sources' },
  { level: 'error', msg: 'CP-008 campaign suspended - policy violation confirmed' },
];

function sc(s: CampaignStatus) {
  return s === 'ACTIVE' ? '#34d399' : s === 'FLAGGED' ? '#ef4444' : s === 'UNDER REVIEW' ? '#f59e0b' : '#a78bfa';
}
function sbg(s: CampaignStatus) {
  return s === 'ACTIVE' ? 'rgba(52,211,153,0.1)' : s === 'FLAGGED' ? 'rgba(239,68,68,0.1)' : s === 'UNDER REVIEW' ? 'rgba(245,158,11,0.1)' : 'rgba(139,92,246,0.1)';
}
function scoreclr(n: number) { return n > 70 ? '#34d399' : n > 40 ? '#f59e0b' : '#ef4444'; }
function sevclr(s: ViolationSeverity) { return { critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#3b82f6' }[s]; }
function sevbg(s: ViolationSeverity) { return { critical: 'rgba(239,68,68,0.1)', high: 'rgba(249,115,22,0.1)', medium: 'rgba(245,158,11,0.1)', low: 'rgba(59,130,246,0.1)' }[s]; }
function auditclr(o: string) { return { approved: '#34d399', flagged: '#ef4444', frozen: '#a78bfa', info: '#818cf8', warn: '#f59e0b' }[o] || '#818cf8'; }
function logclr(l: string) { return { info: '#818cf8', warn: '#f59e0b', error: '#ef4444', success: '#34d399' }[l]; }
function logbg(l: string) { return { info: 'rgba(129,140,248,0.08)', warn: 'rgba(245,158,11,0.08)', error: 'rgba(239,68,68,0.08)', success: 'rgba(52,211,153,0.08)' }[l]; }
function StatusBadge({ s }: { s: CampaignStatus }) { return (<span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 8px", borderRadius: 5, background: sbg(s), color: sc(s), fontSize: "0.68rem", fontWeight: 700, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.04em" }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: sc(s) }} />{s}</span>); }
function EscrowBadge({ frozen }: { frozen: boolean }) { if (!frozen) return null; return (<span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 7px", borderRadius: 4, background: "rgba(139,92,246,0.12)", color: "#a78bfa", fontSize: "0.62rem", fontWeight: 700, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em" }}>FROZEN</span>); }
function ScoreBar({ score }: { score: number }) { const c = scoreclr(score); return (<div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 70, height: 5, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}><div style={{ width: score + "%", height: "100%", background: c, borderRadius: 3 }} /></div><span style={{ fontSize: "0.72rem", fontWeight: 700, color: c, fontFamily: "JetBrains Mono, monospace", minWidth: 28 }}>{score}%</span></div>); }
function ViolationRow({ v }: { v: Violation }) { return (<div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 8, marginBottom: 6, background: sevbg(v.severity), border: "1px solid " + sevclr(v.severity) + "18", animation: "slideUp 0.35s ease both" }}><span style={{ fontSize: "0.6rem", padding: "2px 5px", borderRadius: 3, background: sevclr(v.severity) + "22", color: sevclr(v.severity), fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap", marginTop: 2 }}>{v.severity}</span><div style={{ flex: 1 }}><div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 2 }}>{v.type}</div><div style={{ fontSize: "0.75rem", color: "#94a3b8", lineHeight: 1.4 }}>{v.description}</div><div style={{ fontSize: "0.68rem", color: "#475569", marginTop: 4, fontFamily: "JetBrains Mono, monospace" }}>{v.campaignId} / {v.influencer}</div></div><span style={{ fontSize: "0.68rem", color: "#475569", whiteSpace: "nowrap", fontFamily: "JetBrains Mono, monospace" }}>{v.time}</span></div>); }
function AuditRow({ a }: { a: AuditEntry }) { return (<div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #1e293b" }}><span style={{ fontSize: "0.7rem", color: "#475569", fontFamily: "JetBrains Mono, monospace", minWidth: 65 }}>{a.timestamp}</span><span style={{ fontSize: "0.68rem", padding: "2px 6px", borderRadius: 4, background: auditclr(a.outcome) + "18", color: auditclr(a.outcome), fontWeight: 700, fontFamily: "JetBrains Mono, monospace", minWidth: 60, textAlign: "center" }}>{a.outcome}</span><span style={{ fontSize: "0.72rem", color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }}>{a.actor}</span><span style={{ fontSize: "0.75rem", color: "#f1f5f9", flex: 1 }}>{a.action}</span><span style={{ fontSize: "0.72rem", color: "#818cf8", fontFamily: "JetBrains Mono, monospace" }}>{a.target}</span></div>); }
function LogRow({ l }: { l: LogEntry }) {
  const bg = l.level === 'info' ? 'rgba(129,140,248,0.08)' : l.level === 'warn' ? 'rgba(245,158,11,0.08)' : l.level === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(52,211,153,0.08)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #1e293b', animation: 'slideUp 0.3s ease both' }}>
      <span style={{ fontSize: '0.65rem', color: '#334155', fontFamily: 'JetBrains Mono, monospace', minWidth: 70 }}>{l.ts}</span>
      <span style={{ fontSize: '0.6rem', padding: '1px 5px', borderRadius: 3, background: bg, color: logclr(l.level), fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l.level}</span>
      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{l.msg}</span>
    </div>
  );
}

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);
  const [violations, setViolations] = useState<Violation[]>(VIOLATION_POOL.slice(0, 5).map((v, i) => ({ ...v, id: i + 1, time: '0s ago' })));
  const [audit] = useState(AUDIT_SEED);
  const [logs, setLogs] = useState<LogEntry[]>(LOG_MSGS.slice(0, 5).map((l, i) => ({ ...l, id: i + 1, ts: '17:' + String(27 - i).padStart(2, '0') + ':' + String(10 + i * 3).padStart(2, '0') })));
  const [tick, setTick] = useState(0);
  const [modal, setModal] = useState<Campaign | null>(null);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const statuses: CampaignStatus[] = ['ACTIVE', 'FLAGGED', 'UNDER REVIEW', 'ESCROW FROZEN'];
    setCampaigns(prev => prev.map(c => {
      if (tick % 3 === 0) return { ...c, lastUpdate: 'just now' };
      const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const scoreDelta = Math.floor(Math.random() * 7) - 3;
      const newScore = Math.max(10, Math.min(99, c.aiScore + scoreDelta));
      return { ...c, status: newStatus, aiScore: newScore, lastUpdate: 'just now' };
    }));
  }, [tick]);

  useEffect(() => {
    if (tick > 0 && tick % 5 === 0) {
      const pool = VIOLATION_POOL;
      const newV = pool[Math.floor(Math.random() * pool.length)];
      setViolations(prev => [{ ...newV, id: Date.now(), time: 'just now' }, ...prev.slice(0, 6)]);
    }
  }, [tick]);

  useEffect(() => {
    if (tick > 0 && tick % 6 === 0) {
      const msgs = LOG_MSGS;
      const newL = msgs[Math.floor(Math.random() * msgs.length)];
      const now = new Date();
      setLogs(prev => [{ ...newL, id: Date.now(), ts: now.toTimeString().slice(0, 8) }, ...prev.slice(0, 7)]);
    }
  }, [tick]);

  const activeCount = campaigns.filter(c => c.status === 'ACTIVE').length;
  const flaggedCount = campaigns.filter(c => c.status === 'FLAGGED' || c.status === 'ESCROW FROZEN').length;
  const reviewCount = campaigns.filter(c => c.status === 'UNDER REVIEW').length;
  const avgScore = Math.round(campaigns.reduce((a, c) => a + c.aiScore, 0) / campaigns.length);

  return (
    <main className="main">
      <header className="topbar">
        <div className="topbar-brand">
          <div className="brand-logo">CT</div>
          <div>
            <div className="brand-name">CreatorTrust AI</div>
            <div className="brand-sub">Brand Command Center</div>
          </div>
        </div>
        <nav className="topbar-nav">
          {['Dashboard', 'Campaigns', 'Influencers', 'Risk Registry', 'Reports'].map(i => <span key={i}>{i}</span>)}
        </nav>
        <div className="topbar-status">
          <div className="status-dot" />
          <span>SYSTEM ACTIVE</span>
        </div>
      </header>

      <section className="metrics-section">
        <div className="container">
          <div className="section-label">
            <div className="section-dot" />
            Live Campaign Metrics
          </div>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">Active Campaigns</div>
              <div className="metric-value">{activeCount}</div>
              <div className="metric-delta" style={{ color: '#34d399' }}>+{tick > 0 ? Math.min(tick, 3) : 1} today</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Under Review</div>
              <div className="metric-value">{reviewCount}</div>
              <div className="metric-delta" style={{ color: '#f59e0b' }}>Awaiting analyst</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Flagged / Frozen</div>
              <div className="metric-value">{flaggedCount}</div>
              <div className="metric-delta" style={{ color: '#ef4444' }}>Action required</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Avg AI Confidence</div>
              <div className="metric-value">{avgScore}%</div>
              <div className="metric-delta" style={{ color: avgScore > 65 ? '#34d399' : '#f59e0b' }}>Portfolio score</div>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="container">
          <div className="dashboard-grid">
            <div>
              <div className="panel panel-risk" style={{ marginBottom: 16 }}>
                <div className="panel-header">
                  <div className="panel-title">
                    <span className="panel-title-text" style={{ color: '#818cf8' }}>Live Campaign Table</span>
                    <span className="panel-badge" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>Meshki</span>
                  </div>
                  <span className="panel-meta">8 campaigns</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #1e293b' }}>
                        {['ID', 'Brand', 'Influencer', 'Platform', 'Budget', 'Status', 'AI Score', 'Escrow', 'Posts', 'Updated'].map(h => (
                          <th key={h} style={{ padding: '8px', fontSize: '0.65rem', color: '#475569', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map(c => (
                        <tr key={c.id} onClick={() => setModal(c)} style={{ borderBottom: '1px solid #1e293b', cursor: 'pointer' }}
                          onMouseOver={e => (e.currentTarget.style.background = '#1e293b')}
                          onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                          <td style={{ padding: '9px 8px', fontSize: '0.75rem', color: '#818cf8', fontFamily: 'JetBrains Mono, monospace' }}>{c.id}</td>
                          <td style={{ padding: '9px 8px', fontSize: '0.8rem', fontWeight: 700, color: '#f1f5f9' }}>{c.brand}</td>
                          <td style={{ padding: '9px 8px', fontSize: '0.8rem', color: '#94a3b8' }}>{c.influencer}</td>
                          <td style={{ padding: '9px 8px', fontSize: '0.72rem', color: '#64748b' }}>{c.platform}</td>
                          <td style={{ padding: '9px 8px', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}>{c.budget}</td>
                          <td style={{ padding: '9px 8px' }}><StatusBadge s={c.status} /></td>
                          <td style={{ padding: '9px 8px' }}><ScoreBar score={c.aiScore} /></td>
                          <td style={{ padding: '9px 8px' }}><EscrowBadge frozen={c.escrowFrozen} /></td>
                          <td style={{ padding: '9px 8px', fontSize: '0.72rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>{c.postsDelivered}/{c.postsDue}</td>
                          <td style={{ padding: '9px 8px', fontSize: '0.68rem', color: '#475569', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>{c.lastUpdate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="panel panel-alert">
                <div className="panel-header">
                  <div className="panel-title">
                    <span className="panel-title-text" style={{ color: '#ef4444' }}>Active Violations</span>
                    <span className="panel-badge" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>{violations.length}</span>
                  </div>
                  <span className="panel-meta">Real-time</span>
                </div>
                {violations.map(v => <ViolationRow key={v.id || v.campaignId + v.type} v={v} />)}
              </div>
            </div>

            <div>
              <div className="panel panel-risk" style={{ marginBottom: 16 }}>
                <div className="panel-header">
                  <div className="panel-title">
                    <span className="panel-title-text" style={{ color: '#818cf8' }}>Audit Log</span>
                  </div>
                  <span className="panel-meta">Today</span>
                </div>
                <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                  {audit.map(a => <AuditRow key={a.id} a={a} />)}
                </div>
              </div>

              <div className="panel" style={{ border: '1px solid rgba(52,211,153,0.2)', background: 'linear-gradient(135deg, #0f172a, #1a1f35)' }}>
                <div className="panel-header">
                  <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="panel-title-text" style={{ color: '#34d399' }}>System Log Stream</span>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', animation: 'ping 1.5s infinite' }} />
                  </div>
                  <span className="panel-meta">Live</span>
                </div>
                <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                  {logs.map(l => <LogRow key={l.id} l={l} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }} onClick={() => setModal(null)}>
          <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 16, padding: '2rem', maxWidth: 500, width: '90%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Human Review Required</h2>
              <button onClick={() => setModal(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.2rem', cursor: 'pointer' }}>x</button>
            </div>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #1e293b' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Campaign ID</span>
                <span style={{ fontSize: '0.78rem', color: '#818cf8', fontFamily: 'JetBrains Mono, monospace' }}>{modal.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #1e293b' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Influencer</span>
                <span style={{ fontSize: '0.78rem', color: '#f1f5f9', fontWeight: 600 }}>{modal.influencer}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #1e293b' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Current Status</span>
                <StatusBadge s={modal.status} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #1e293b' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>AI Confidence</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: scoreclr(modal.aiScore), fontFamily: 'JetBrains Mono, monospace' }}>{modal.aiScore}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #1e293b' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Escrow</span>
                <EscrowBadge frozen={modal.escrowFrozen} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #1e293b' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Budget</span>
                <span style={{ fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace', color: '#94a3b8' }}>{modal.budget}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: '#94a3b8', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>Approve</button>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}              >Flag</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
