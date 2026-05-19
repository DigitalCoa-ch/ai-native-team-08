'use client';

import { useEffect, useState } from 'react';
import './page.css';


interface Metric { label: string; value: string; delta: string; positive: boolean; }
interface Alert { id: number; severity: 'critical' | 'warning' | 'info'; influencer: string; message: string; time: string; }

const metrics: Metric[] = [
  { label: 'Campaigns Active', value: '24', delta: '+3', positive: true },
  { label: 'Influencers Monitored', value: '1847', delta: '+112', positive: true },
  { label: 'Risk Flags Raised', value: '38', delta: '-12%', positive: true },
  { label: 'Avg. Response Time', value: '1.2s', delta: '-0.4s', positive: true },
];

const alerts: Alert[] = [
  { id: 1, severity: 'critical', influencer: '@fashionnova_', message: 'Engagement spike anomaly - possible fake followers detected', time: '2m ago' },
  { id: 2, severity: 'warning', influencer: '@glowbygrace', message: 'Sentiment shift detected in recent 7 posts', time: '14m ago' },
  { id: 3, severity: 'warning', influencer: '@stylemark', message: 'Brand mismatch score above threshold (0.78)', time: '31m ago' },
  { id: 4, severity: 'info', influencer: '@luxe.edit', message: 'Routine audit passed - no risk flags', time: '1h ago' },
  { id: 5, severity: 'info', influencer: '@everydayelegance', message: 'New follower growth within expected range', time: '2h ago' },
];

const scanRows = [
  { name: '@fashionnova_', score: 82, trend: '-8%' },
  { name: '@glowbygrace', score: 51, trend: '+3%' },
  { name: '@stylemark', score: 34, trend: '+1%' },
  { name: '@luxe.edit', score: 12, trend: '-1%' },
  { name: '@everydayelegance', score: 67, trend: '+5%' },
  { name: '@minimalist.style', score: 29, trend: '0%' },
];

function AnimatedCounter({ target }: { target: string }) {
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    const n = parseInt(target.replace(/[^0-9]/g, ''), 10);
    if (isNaN(n)) { setDisplay(target); return; }
    const start = Date.now();
    const dur = 2000;
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.floor(e * n).toLocaleString());
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return <span>{display}</span>;
}

function PulseDot({ color }: { color: string }) {
  return (
    <span className="pulse-dot" style={{ background: color }} />
  );
}

function MetricCard({ label, value, delta, positive }: Metric) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value"><AnimatedCounter target={value} /></div>
      <div className="metric-delta" style={{ color: positive ? '#34d399' : '#f87171' }}>{delta}</div>
    </div>
  );
}

function AlertRow({ severity, influencer, message, time }: Alert) {
  const color = severity === 'critical' ? '#ef4444' : severity === 'warning' ? '#f59e0b' : '#3b82f6';
  const bg = severity === 'critical' ? 'rgba(239,68,68,0.08)' : severity === 'warning' ? 'rgba(245,158,11,0.08)' : 'rgba(59,130,246,0.08)';
  return (
    <div className="alert-row" style={{ background: bg, borderColor: color + '22' }}>
      <PulseDot color={color} />
      <div className="alert-body">
        <div className="alert-header">
          <span className="alert-influencer">{influencer}</span>
          <span className="alert-severity" style={{ background: color + '18', color }}>{severity}</span>
        </div>
        <div className="alert-message">{message}</div>
      </div>
      <span className="alert-time">{time}</span>
    </div>
  );
}

function ScanRow({ name, score, trend }: { name: string; score: number; trend: string }) {
  const color = score > 70 ? '#ef4444' : score > 40 ? '#f59e0b' : '#34d399';
  return (
    <div className="scan-row">
      <div className="scan-name">{name}</div>
      <div className="scan-bar"><div className="scan-fill" style={{ width: score + '%', background: color }} /></div>
      <div className="scan-score" style={{ color }}>{score}%</div>
      <div className="scan-trend">{trend}</div>
    </div>
  );
}

function RiskGauge({ score, label }: { score: number; label: string }) {
  const color = score > 70 ? '#ef4444' : score > 40 ? '#f59e0b' : '#34d399';
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="risk-gauge">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#1e293b" strokeWidth="6" />
        <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 48 48)" className="gauge-arc" />
        <text x="48" y="53" textAnchor="middle" fill={color} fontSize="16" fontWeight="800">{score}</text>
      </svg>
      <div className="gauge-label">{label}</div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="main">      <header className="topbar">
        <div className="topbar-brand">
          <div className="brand-logo">CT</div>
          <div>
            <div className="brand-name">CreatorTrust AI</div>
            <div className="brand-sub">Brand Command Center</div>
          </div>
        </div>
        <nav className="topbar-nav">
          {['Dashboard','Campaigns','Influencers','Risk Registry','Reports'].map(i => <span key={i}>{i}</span>)}
        </nav>
        <div className="topbar-status">
          <div className="status-dot" />
          <span>SYSTEM ACTIVE</span>
        </div>
      </header>

      <section className="hero">
        <div className="hero-grid-bg" />
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-badge slide-up">
            <div className="badge-dot" />
            AI Governance Platform - Live Monitoring
          </div>
          <h1 className="hero-title slide-up d1">
            Brand Command<br />
            <span className="hero-gradient">Center</span>
          </h1>
          <p className="hero-desc slide-up d2">
            Enterprise-grade influencer governance at scale. Classify risk, monitor campaigns in real time, and act before brand reputation is damaged.
          </p>
          <div className="hero-ctas slide-up d3">
            <button className="btn-primary glow-btn">Open Brand Command Center</button>
            <button className="btn-secondary">View Risk Registry</button>
          </div>
        </div>
      </section>

      <section className="metrics-section">
        <div className="container">
          <div className="section-label">
            <div className="section-dot" />
            Live Campaign Metrics
          </div>
          <div className="metrics-grid">
            {metrics.map(m => <MetricCard key={m.label} {...m} />)}
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="container">
          <div className="dashboard-grid">
            <div className="panel panel-alert">
              <div className="panel-header">
                <div className="panel-title">
                  <span className="panel-title-text">Active Risk Alerts</span>
                  <span className="panel-badge alert-badge">3</span>
                </div>
                <span className="panel-meta">Real-time</span>
              </div>
              {alerts.map(a => <AlertRow key={a.id} {...a} />)}
            </div>

            <div className="panel panel-risk">
              <div className="panel-header">
                <div className="panel-title">
                  <span className="panel-title-text">Influencer Risk Scores</span>
                  <span className="panel-badge risk-badge">Live</span>
                </div>
                <span className="panel-meta">Today</span>
              </div>
              {scanRows.map((row, i) => <ScanRow key={i} {...row} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="gauge-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="gauges-row">
            <RiskGauge score={82} label="High Risk" />
            <RiskGauge score={51} label="Medium Risk" />
            <RiskGauge score={12} label="Low Risk" />
          </div>
          <p className="gauge-footer">PORTFOLIO AGGREGATE RISK SCORE - UPDATED 13:00 UTC</p>
        </div>
      </section>

      <footer className="site-footer">
        <span>CreatorTrust AI - Brand Command Center</span>
        <span>v2.1.0 - 2026</span>
      </footer>
    </main>
  );
}
