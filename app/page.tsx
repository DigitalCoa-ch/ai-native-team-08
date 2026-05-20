'use client';

import { useEffect, useState } from 'react';

type CampaignStatus = 'ACTIVE' | 'FLAGGED' | 'UNDER REVIEW' | 'ESCROW FROZEN';
type ViolationSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

interface Campaign {
  id: string;
  name: string;
  influencer: string;
  status: CampaignStatus;
  budget: string;
  escrowBalance: string;
  aiConfidence: number;
  violations: number;
  lastActivity: string;
}

interface Violation {
  id: string;
  influencer: string;
  type: string;
  severity: ViolationSeverity;
  description: string;
  timestamp: string;
  action: string;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  result: string;
  details: string;
}

const realInfluencers = [
  { name: 'Chiara Ferragni', handle: '@chiaraferragni', followers: '29.8M', engagement: '3.2%', category: 'Luxury Fashion', compatibility: 94, riskLevel: 12, sentiment: 87 },
  { name: 'Kylie Jenner', handle: '@kyliejenner', followers: '400M', engagement: '2.8%', category: 'Beauty & Fashion', compatibility: 89, riskLevel: 18, sentiment: 82 },
  { name: 'Addison Rae', handle: '@addisonraee', followers: '88M', engagement: '5.1%', category: 'Gen-Z Fashion', compatibility: 91, riskLevel: 8, sentiment: 91 },
  { name: 'Bella Poarch', handle: '@bellapoarch', followers: '22M', engagement: '6.3%', category: 'Luxury Lifestyle & Fashion & Fashion', compatibility: 76, riskLevel: 35, sentiment: 68 },
  { name: 'Hailey Bieber', handle: '@haileybieber', followers: '52M', engagement: '4.1%', category: 'Fashion & Beauty', compatibility: 92, riskLevel: 10, sentiment: 89 },
  { name: 'Emma Chamberlain', handle: '@emmachamberlain', followers: '18M', engagement: '7.2%', category: 'Lifestyle & Fashion', compatibility: 88, riskLevel: 14, sentiment: 85 },
  { name: 'Tiffany Young', handle: '@tiffanyyoung', followers: '8M', engagement: '4.8%', category: 'K-Pop & Fashion', compatibility: 85, riskLevel: 22, sentiment: 78 },
  { name: 'Alexandra Saint Mleux Leclerc', handle: '@alexandrasaintmleuxleclerc', followers: '2.1M', engagement: '4.8%', category: 'Luxury Lifestyle & Fashion', compatibility: 94, riskLevel: 11, sentiment: 91 },
  { name: 'Chiara Ferragni', handle: '@chiaraferragni', followers: '29.8M', engagement: '3.2%', category: 'Luxury Fashion', compatibility: 94, riskLevel: 12, sentiment: 87 },
  { name: 'Kylie Jenner', handle: '@kyliejenner', followers: '400M', engagement: '2.8%', category: 'Beauty & Fashion', compatibility: 89, riskLevel: 18, sentiment: 82 },
  { name: 'Addison Rae', handle: '@addisonraee', followers: '88M', engagement: '5.1%', category: 'Gen-Z Fashion', compatibility: 91, riskLevel: 8, sentiment: 91 },
  { name: 'Hailey Bieber', handle: '@haileybieber', followers: '52M', engagement: '4.1%', category: 'Fashion & Beauty', compatibility: 92, riskLevel: 10, sentiment: 89 },
  { name: 'Emma Chamberlain', handle: '@emmachamberlain', followers: '18M', engagement: '7.2%', category: 'Lifestyle & Fashion', compatibility: 88, riskLevel: 14, sentiment: 85 },
  { name: 'Tiffany Young', handle: '@tiffanyyoung', followers: '8M', engagement: '4.8%', category: 'K-Pop & Fashion', compatibility: 85, riskLevel: 22, sentiment: 78 },
  { name: 'Bella Poarch', handle: '@bellapoarch', followers: '22M', engagement: '6.3%', category: 'Entertainment & Fashion', compatibility: 76, riskLevel: 35, sentiment: 68 },
];

function getStatusColor(s: string) { return { ACTIVE: '#10b981', FLAGGED: '#f59e0b', 'UNDER REVIEW': '#3b82f6', 'ESCROW FROZEN': '#ef4444' }[s] || '#6b7280'; }
function getSeverityColor(s: string) { return { LOW: '#22c55e', MEDIUM: '#f59e0b', HIGH: '#f97316', CRITICAL: '#ef4444' }[s] || '#6b7280'; }
function getRiskColor(r: number) { return r < 20 ? '#10b981' : r < 40 ? '#22c55e' : r < 60 ? '#f59e0b' : r < 80 ? '#f97316' : '#ef4444'; }
function formatTime(ts: string) { return new Date(ts).toLocaleTimeString(); }

export default function BrandCommandCenter() {
  const [campaigns, setCampaigns] = useState([
    { id: '1', name: 'Chiara Ferragni x Meshki Summer 2026', influencer: 'Chiara Ferragni', status: 'ACTIVE', budget: '$125,000', escrowBalance: '$62,500', aiConfidence: 94, violations: 0, lastActivity: '2 min ago' },
    { id: '2', name: 'Kylie Jenner x Meshki Fall Collection', influencer: 'Kylie Jenner', status: 'FLAGGED', budget: '$340,000', escrowBalance: '$170,000', aiConfidence: 78, violations: 2, lastActivity: '15 min ago' },
    { id: '3', name: 'Addison Rae x Meshki Holiday Drop', influencer: 'Addison Rae', status: 'ACTIVE', budget: '$89,000', escrowBalance: '$44,500', aiConfidence: 89, violations: 0, lastActivity: '1 hour ago' },
    { id: '4', name: 'Bella Poarch x Meshki Spring Launch', influencer: 'Bella Poarch', status: 'UNDER REVIEW', budget: '$520,000', escrowBalance: '$260,000', aiConfidence: 45, violations: 8, lastActivity: '3 hours ago' },
    { id: '5', name: 'Hailey Bieber x Meshki Limited Edition', influencer: 'Hailey Bieber', status: 'ACTIVE', budget: '$175,000', escrowBalance: '$87,500', aiConfidence: 92, violations: 0, lastActivity: '30 min ago' },
    { id: '6', name: 'Alexandra Saint Mleux Leclerc x Meshki Global Campaign', influencer: 'Alexandra Saint Mleux Leclerc', status: 'ESCROW FROZEN', budget: '$175,000', escrowBalance: '$87,500', aiConfidence: 96, violations: 0, lastActivity: '1 day ago' },
  ]);
  const [violations] = useState([
    { id: 'v1', influencer: 'Bella Poarch', type: 'Sentiment Spike', severity: 'HIGH', description: 'Negative sentiment spike detected (+42%) following recent controversy', timestamp: new Date(Date.now() - 1800000).toISOString(), action: 'Escrow freeze recommended' },
    { id: 'v2', influencer: 'Alexandra Saint Mleux Leclerc', type: 'Brand Violation', severity: 'CRITICAL', description: 'Competitor brand endorsement detected - immediate action required', timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'ESCROW FROZEN - Legal review pending' },
    { id: 'v3', influencer: 'Tiffany Young', type: 'Disclosure Failure', severity: 'MEDIUM', description: 'Sponsored content posted without proper #ad disclosure', timestamp: new Date(Date.now() - 7200000).toISOString(), action: 'Warning sent to creator' },
    { id: 'v4', influencer: 'Kylie Jenner', type: 'Risk Alert', severity: 'LOW', description: 'Minor sentiment fluctuation detected in beauty vertical', timestamp: new Date(Date.now() - 10800000).toISOString(), action: 'Monitoring flagged' },
  ]);
  const [auditLog] = useState([
    { id: 'a1', timestamp: new Date(Date.now() - 600000).toISOString(), user: 'creatortrust-ai', action: 'ANALYSIS_COMPLETE', target: 'Addison Rae', result: 'APPROVED', details: 'Risk: LOW. Compatibility: 91%. No violations.' },
    { id: 'a2', timestamp: new Date(Date.now() - 1200000).toISOString(), user: 'compliance-bot', action: 'VIOLATION_DETECTED', target: 'Bella Poarch', result: 'FLAGGED', details: 'Sentiment spike threshold exceeded (42%). Auto-escalated.' },
    { id: 'a3', timestamp: new Date(Date.now() - 1800000).toISOString(), user: 'escrow-guardian', action: 'FUNDS_FROZEN', target: 'Alexandra Saint Mleux Leclerc Campaign', result: 'FROZEN', details: 'Escrow $87,500 frozen due to CRITICAL brand violation.' },
    { id: 'a4', timestamp: new Date(Date.now() - 2400000).toISOString(), user: 'creatortrust-ai', action: 'SENTIMENT_ALERT', target: 'Kylie Jenner', result: 'MONITORING', details: 'Minor negative sentiment in beauty category. -8%.' },
    { id: 'a5', timestamp: new Date(Date.now() - 3000000).toISOString(), user: 'review-committee', action: 'MANUAL_REVIEW_COMPLETE', target: 'Hailey Bieber', result: 'APPROVED', details: 'Manual review confirms excellent brand fit.' },
  ]);
  const [tab, setTab] = useState('overview');
  const [time, setTime] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<{influencer: string, violation: string} | null>(null);
  const [alerts, setAlerts] = useState([
    { type: 'ESCROW FREEZE', message: 'Alexandra Saint Mleux Leclerc campaign escrow ($87,500) frozen due to CRITICAL brand violation', severity: 'CRITICAL' },
    { type: 'SENTIMENT SPIKE', message: 'Bella Poarch negative sentiment increased by 42% - Review required', severity: 'HIGH' },
    { type: 'COMPATIBILITY', message: 'Chiara Ferragni brand compatibility score updated: 94%', severity: 'LOW' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      const statuses = ['ACTIVE', 'FLAGGED', 'UNDER REVIEW', 'ESCROW FROZEN'];
      const idx = Math.floor(Math.random() * campaigns.length);
      setCampaigns(prev => prev.map((c, i) => i === idx ? { ...c, status: statuses[Math.floor(Math.random() * statuses.length)], lastActivity: 'Just now' } : c));
      const alertTypes = [
        { type: 'SENTIMENT', message: 'Real-time sentiment analysis updated for active campaigns', severity: 'LOW' },
        { type: 'RISK SCAN', message: 'CreatorTrust AI completed risk scan on 8 influencers', severity: 'LOW' },
        { type: 'COMPLIANCE', message: 'Automated compliance check passed for 4 campaigns', severity: 'LOW' },
      ];
      const newAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      setAlerts(prev => [{ ...newAlert, type: newAlert.type }, ...prev.slice(0, 4)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const frozen = campaigns.filter(c => c.status === 'ESCROW FROZEN').reduce((a, c) => a + parseInt(c.escrowBalance.replace(/[$,]/g, '')), 0);
  const active = campaigns.filter(c => c.status === 'ACTIVE').length;
  const avgConf = Math.round(campaigns.reduce((a, c) => a + c.aiConfidence, 0) / campaigns.length);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } } @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } } .metric-card { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 1px solid #2d2d44; border-radius: 12px; padding: 20px; } .tab-btn { padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; transition: all 0.2s; } .tab-btn.active { background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); color: #fff; } .tab-btn:not(.active) { background: #1f2937; color: #9ca3af; } .tab-btn:not(.active):hover { background: #374151; } .table-row { border-bottom: 1px solid #1f2937; transition: background 0.2s; } .table-row:hover { background: #1f2937; } .panel { background: #111118; border: 1px solid #1f2937; border-radius: 12px; padding: 20px; } .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; } .modal-content { background: #1a1a2e; border: 1px solid #2d2d44; border-radius: 16px; padding: 32px; max-width: 500px; width: 90%; }`}</style>
      
      {showModal && modalData && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#fff' }}>Human Review Required</h2>
            <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '14px' }}>AI confidence below threshold. Manual review needed.</p>
            <div style={{ background: '#111118', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
              <p style={{ margin: '0 0 8px 0', color: '#9ca3af', fontSize: '12px' }}>INFLUENCER</p>
              <p style={{ margin: '0', color: '#fff', fontSize: '16px', fontWeight: 600 }}>{modalData.influencer}</p>
              <p style={{ margin: '8px 0 0 0', color: '#9ca3af', fontSize: '12px' }}>VIOLATION TYPE</p>
              <p style={{ margin: 0, color: '#ef4444', fontSize: '14px' }}>{modalData.violation}</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #374151', background: 'transparent', color: '#9ca3af', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>Dismiss</button>
              <button onClick={() => { setShowModal(false); alert('Human review submitted!'); }} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #ec4899, #a855f7)', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>Approve Campaign</button>
            </div>
          </div>
        </div>
      )}

      <header style={{ padding: '20px 32px', borderBottom: '1px solid #1f2937', background: 'linear-gradient(180deg, #111118 0%, #0a0a0f 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BRAND COMMAND CENTER</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#1f2937', borderRadius: '9999px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 600 }}>LIVE</span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>CreatorTrust AI powered brand safety monitoring for <span style={{ color: '#ec4899', fontWeight: 600 }}>Meshki</span></p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>Last updated</p>
            <p style={{ margin: 0, fontSize: '14px', fontFamily: 'monospace', color: '#fff' }}>{time.toLocaleTimeString()}</p>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', padding: '24px 32px', background: '#0d0d14' }}>
        <div className="metric-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Active Campaigns</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#10b981' }}>{active}</div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>of {campaigns.length} total</div>
        </div>
        <div className="metric-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Escrow Frozen</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#ef4444' }}>${(frozen / 1000).toFixed(0)}K</div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>protected funds</div>
        </div>
        <div className="metric-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>AI Confidence</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#a855f7' }}>{avgConf}%</div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>avg across campaigns</div>
        </div>
        <div className="metric-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Active Violations</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b' }}>{violations.length}</div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>require attention</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', padding: '20px 32px', borderBottom: '1px solid #1f2937' }}>
        {['overview', 'influencers', 'campaigns', 'violations', 'audit'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`tab-btn ${tab === t ? 'active' : ''}`} style={{ textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: '24px 32px' }}>
        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="panel">
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#9ca3af', textTransform: 'uppercase' }}>Live Risk Alerts</h3>
              {alerts.map((a, i) => (
                <div key={i} style={{ padding: '12px', background: a.severity === 'CRITICAL' ? 'rgba(239,68,68,0.1)' : a.severity === 'HIGH' ? 'rgba(249,115,22,0.1)' : 'rgba(34,197,94,0.1)', borderLeft: `3px solid ${getSeverityColor(a.severity)}`, borderRadius: '0 8px 8px 0', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: getSeverityColor(a.severity), textTransform: 'uppercase' }}>{a.type}</span>
                    <span style={{ fontSize: '10px', color: '#6b7280' }}>{time.toLocaleTimeString()}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#fff' }}>{a.message}</p>
                </div>
              ))}
            </div>
            <div className="panel">
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#9ca3af', textTransform: 'uppercase' }}>Campaign Status</h3>
              {campaigns.map(c => (
                <div key={c.id} className="table-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{c.influencer}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>{c.budget}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>{c.aiConfidence}%</span>
                    <span style={{ padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, background: `${getStatusColor(c.status)}20`, color: getStatusColor(c.status) }}>{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'influencers' && (
          <div className="panel">
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#9ca3af', textTransform: 'uppercase' }}>CreatorTrust AI Analysis - Meshki Brand Partners</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1f2937' }}>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '11px', color: '#6b7280' }}>INFLUENCER</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '11px', color: '#6b7280' }}>FOLLOWERS</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '11px', color: '#6b7280' }}>COMPATIBILITY</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '11px', color: '#6b7280' }}>RISK LEVEL</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '11px', color: '#6b7280' }}>SENTIMENT</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '11px', color: '#6b7280' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {realInfluencers.map((inf, i) => (
                  <tr key={i} className="table-row">
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{inf.name}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>{inf.handle}</div>
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: '12px' }}>{inf.followers}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '50px', height: '4px', background: '#1f2937', borderRadius: '2px' }}>
                          <div style={{ width: `${inf.compatibility}%`, height: '100%', background: inf.compatibility > 80 ? '#10b981' : inf.compatibility > 60 ? '#f59e0b' : '#ef4444', borderRadius: '2px' }} />
                        </div>
                        <span style={{ fontSize: '11px', color: '#fff' }}>{inf.compatibility}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, background: `${getRiskColor(inf.riskLevel)}20`, color: getRiskColor(inf.riskLevel) }}>{inf.riskLevel < 20 ? 'LOW' : inf.riskLevel < 40 ? 'MEDIUM' : inf.riskLevel < 70 ? 'HIGH' : 'CRITICAL'}</span>
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: '12px' }}>{inf.sentiment}%</td>
                    <td style={{ padding: '12px 8px' }}>
                      {inf.riskLevel > 60 ? (
                        <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, background: '#ef4444', color: '#fff', animation: 'blink 1s infinite' }}>ESCROW FROZEN</span>
                      ) : (
                        <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, background: '#10b98120', color: '#10b981' }}>ACTIVE</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'campaigns' && (
          <div className="panel">
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#9ca3af', textTransform: 'uppercase' }}>Live Campaign Table</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1f2937' }}>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '11px', color: '#6b7280' }}>CAMPAIGN</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '11px', color: '#6b7280' }}>INFLUENCER</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '11px', color: '#6b7280' }}>STATUS</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '11px', color: '#6b7280' }}>BUDGET</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '11px', color: '#6b7280' }}>ESCROW</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '11px', color: '#6b7280' }}>AI CONFIDENCE</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '11px', color: '#6b7280' }}>VIOLATIONS</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c.id} className="table-row">
                    <td style={{ padding: '12px 8px', fontSize: '13px', fontWeight: 600 }}>{c.name}</td>
                    <td style={{ padding: '12px 8px', fontSize: '12px' }}>{c.influencer}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, background: `${getStatusColor(c.status)}20`, color: getStatusColor(c.status) }}>{c.status}</span>
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: '12px' }}>{c.budget}</td>
                    <td style={{ padding: '12px 8px', fontSize: '12px' }}>{c.escrowBalance}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '4px', background: '#1f2937', borderRadius: '2px' }}>
                          <div style={{ width: `${c.aiConfidence}%`, height: '100%', background: c.aiConfidence > 80 ? '#10b981' : c.aiConfidence > 50 ? '#f59e0b' : '#ef4444', borderRadius: '2px' }} />
                        </div>
                        <span style={{ fontSize: '11px', color: '#fff' }}>{c.aiConfidence}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: '12px', color: c.violations > 5 ? '#ef4444' : '#fff' }}>{c.violations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'violations' && (
          <div className="panel">
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#9ca3af', textTransform: 'uppercase' }}>Active Violations Feed</h3>
            {violations.map(v => (
              <div key={v.id} style={{ padding: '16px', background: '#1f2937', borderRadius: '8px', marginBottom: '12px', borderLeft: `3px solid ${getSeverityColor(v.severity)}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{v.influencer}</span>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: `${getSeverityColor(v.severity)}20`, color: getSeverityColor(v.severity) }}>{v.severity}</span>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>{v.type}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>{formatTime(v.timestamp)}</span>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#9ca3af' }}>{v.description}</p>
                <div style={{ fontSize: '11px', color: getSeverityColor(v.severity), fontWeight: 600 }}>{v.action}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'audit' && (
          <div className="panel">
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#9ca3af', textTransform: 'uppercase' }}>Audit Log - CreatorTrust AI</h3>
            {auditLog.map(a => (
              <div key={a.id} className="table-row" style={{ padding: '12px 0' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '80px', flexShrink: 0 }}>
                    <span style={{ fontSize: '10px', color: '#6b7280' }}>{formatTime(a.timestamp)}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#a855f7', background: '#a855f720', padding: '2px 6px', borderRadius: '4px' }}>{a.user}</span>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>{a.action}</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#fff' }}>{a.target}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{a.details}</div>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: a.result === 'APPROVED' ? '#10b981' : a.result === 'FROZEN' ? '#ef4444' : '#f59e0b' }}>{a.result}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer style={{ padding: '16px 32px', borderTop: '1px solid #1f2937', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>
          CreatorTrust AI Brand Command Center v2.1 — Meshki Enterprise Dashboard — Real-time influencer governance platform
        </p>
      </footer>
    </div>
  );
}
