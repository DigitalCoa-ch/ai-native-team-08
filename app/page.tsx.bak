'use client';

import { useEffect, useState, useCallback } from 'react';

type CampaignStatus = 'ACTIVE' | 'FLAGGED' | 'UNDER REVIEW' | 'ESCROW FROZEN';
type ViolationSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

interface Campaign {
  id: string; name: string; influencer: string; status: CampaignStatus;
  budget: string; escrowBalance: string; aiConfidence: number;
  violations: number; lastActivity: string;
}

interface Violation {
  id: string; influencer: string; type: string;
  severity: ViolationSeverity; description: string; timestamp: string; action: string;
}

interface AuditEntry {
  id: string; timestamp: string; user: string; action: string;
  target: string; result: string; details: string;
}

const realInfluencers = [
  { name: 'Chiara Ferragni', handle: '@chiaraferragni', followers: '29.8M', engagement: '3.2%', category: 'Luxury Fashion', compatibility: 94, riskLevel: 12, sentiment: 87 },
  { name: 'Kylie Jenner', handle: '@kyliejenner', followers: '400M', engagement: '2.8%', category: 'Beauty & Fashion', compatibility: 89, riskLevel: 18, sentiment: 82 },
  { name: 'Addison Rae', handle: '@addisonraee', followers: '88M', engagement: '5.1%', category: 'Gen-Z Fashion', compatibility: 91, riskLevel: 8, sentiment: 91 },
  { name: 'Bella Poarch', handle: '@bellapoarch', followers: '22M', engagement: '6.3%', category: 'Entertainment & Fashion', compatibility: 76, riskLevel: 35, sentiment: 68 },
  { name: 'Hailey Bieber', handle: '@haileybieber', followers: '52M', engagement: '4.1%', category: 'Fashion & Beauty', compatibility: 92, riskLevel: 10, sentiment: 89 },
  { name: 'Emma Chamberlain', handle: '@emmachamberlain', followers: '18M', engagement: '7.2%', category: 'Lifestyle & Fashion', compatibility: 88, riskLevel: 14, sentiment: 85 },
  { name: 'Tiffany Young', handle: '@tiffanyyoung', followers: '8M', engagement: '4.8%', category: 'K-Pop & Fashion', compatibility: 85, riskLevel: 22, sentiment: 78 },
  { name: 'Cameron Boyce', handle: '@cameronboyce', followers: '10M', engagement: '5.5%', category: 'Entertainment', compatibility: 45, riskLevel: 72, sentiment: 55 },
];

function getStatusColor(s: string) { return { ACTIVE: '#34d399', FLAGGED: '#f59e0b', 'UNDER REVIEW': '#60a5fa', 'ESCROW FROZEN': '#f87171' }[s] || '#64748b'; }
function getSeverityColor(s: string) { return { LOW: '#34d399', MEDIUM: '#fbbf24', HIGH: '#fb923c', CRITICAL: '#f87171' }[s] || '#64748b'; }
function getRiskColor(r: number) { return r < 20 ? '#34d399' : r < 40 ? '#fbbf24' : r < 60 ? '#fb923c' : r < 80 ? '#f97316' : '#f87171'; }
function formatTime(ts: string) { return new Date(ts).toLocaleTimeString(); }

export default function BrandCommandCenter() {
  const [campaigns, setCampaigns] = useState([
    { id: '1', name: 'Chiara Ferragni x Meshki Summer 2026', influencer: 'Chiara Ferragni', status: 'ACTIVE', budget: '$125,000', escrowBalance: '$62,500', aiConfidence: 94, violations: 0, lastActivity: '2 min ago' },
    { id: '2', name: 'Kylie Jenner x Meshki Fall Collection', influencer: 'Kylie Jenner', status: 'FLAGGED', budget: '$340,000', escrowBalance: '$170,000', aiConfidence: 78, violations: 2, lastActivity: '15 min ago' },
    { id: '3', name: 'Addison Rae x Meshki Holiday Drop', influencer: 'Addison Rae', status: 'ACTIVE', budget: '$89,000', escrowBalance: '$44,500', aiConfidence: 89, violations: 0, lastActivity: '1 hour ago' },
    { id: '4', name: 'Bella Poarch x Meshki Spring Launch', influencer: 'Bella Poarch', status: 'UNDER REVIEW', budget: '$520,000', escrowBalance: '$260,000', aiConfidence: 45, violations: 8, lastActivity: '3 hours ago' },
    { id: '5', name: 'Hailey Bieber x Meshki Limited Edition', influencer: 'Hailey Bieber', status: 'ACTIVE', budget: '$175,000', escrowBalance: '$87,500', aiConfidence: 92, violations: 0, lastActivity: '30 min ago' },
    { id: '6', name: 'Cameron Boyce x Meshki Global Campaign', influencer: 'Cameron Boyce', status: 'ESCROW FROZEN', budget: '$890,000', escrowBalance: '$445,000', aiConfidence: 38, violations: 12, lastActivity: '1 day ago' },
  ]);
  const [violations] = useState([
    { id: 'v1', influencer: 'Bella Poarch', type: 'Sentiment Spike', severity: 'HIGH', description: 'Negative sentiment spike detected (+42%) following recent controversy', timestamp: new Date(Date.now() - 1800000).toISOString(), action: 'Escrow freeze recommended' },
    { id: 'v2', influencer: 'Cameron Boyce', type: 'Brand Violation', severity: 'CRITICAL', description: 'Competitor brand endorsement detected - immediate action required', timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'ESCROW FROZEN - Legal review pending' },
    { id: 'v3', influencer: 'Tiffany Young', type: 'Disclosure Failure', severity: 'MEDIUM', description: 'Sponsored content posted without proper #ad disclosure', timestamp: new Date(Date.now() - 7200000).toISOString(), action: 'Warning sent to creator' },
    { id: 'v4', influencer: 'Kylie Jenner', type: 'Risk Alert', severity: 'LOW', description: 'Minor sentiment fluctuation detected in beauty vertical', timestamp: new Date(Date.now() - 10800000).toISOString(), action: 'Monitoring flagged' },
  ]);
  const [auditLog] = useState([
    { id: 'a1', timestamp: new Date(Date.now() - 600000).toISOString(), user: 'creatortrust-ai', action: 'ANALYSIS_COMPLETE', target: 'Addison Rae', result: 'APPROVED', details: 'Risk: LOW. Compatibility: 91%. No violations.' },
    { id: 'a2', timestamp: new Date(Date.now() - 1200000).toISOString(), user: 'compliance-bot', action: 'VIOLATION_DETECTED', target: 'Bella Poarch', result: 'FLAGGED', details: 'Sentiment spike threshold exceeded (42%). Auto-escalated.' },
    { id: 'a3', timestamp: new Date(Date.now() - 1800000).toISOString(), user: 'escrow-guardian', action: 'FUNDS_FROZEN', target: 'Cameron Boyce Campaign', result: 'FROZEN', details: 'Escrow $445,000 frozen due to CRITICAL brand violation.' },
    { id: 'a4', timestamp: new Date(Date.now() - 2400000).toISOString(), user: 'creatortrust-ai', action: 'SENTIMENT_ALERT', target: 'Kylie Jenner', result: 'MONITORING', details: 'Minor negative sentiment in beauty category. -8%.' },
    { id: 'a5', timestamp: new Date(Date.now() - 3000000).toISOString(), user: 'review-committee', action: 'MANUAL_REVIEW_COMPLETE', target: 'Hailey Bieber', result: 'APPROVED', details: 'Manual review confirms excellent brand fit.' },
  ]);
  const [tab, setTab] = useState('overview');
  const [time, setTime] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<{influencer: string, violation: string} | null>(null);
  const [alerts, setAlerts] = useState([
    { type: 'ESCROW FREEZE', message: 'Cameron Boyce campaign escrow ($445,000) frozen due to CRITICAL brand violation', severity: 'CRITICAL' },
    { type: 'SENTIMENT SPIKE', message: 'Bella Poarch negative sentiment increased by 42% - Review required', severity: 'HIGH' },
    { type: 'COMPATIBILITY', message: 'Chiara Ferragni brand compatibility score updated: 94%', severity: 'LOW' },
  ]);
  const [webhookEvents, setWebhookEvents] = useState([
    { ts: '13:42:07', level: 'CRITICAL', title: 'Fake Engagement Pattern Detected', description: '@fashionnova_ flagged by AI - 94% confidence. Escrow frozen. Campaign CP-001 under review.', color: '#f87171', transcript: '[13:42:07] POST /api/v1/webhooks/influencer-scan\n[13:42:08] AI analysis started... scanning 48 posts, 12.4K comments\n[13:42:09] WARNING: Follower engagement anomaly detected. Ratio: 3.2:1\n[13:42:10] Flagging: fake_follower_pattern confidence=94%\n[13:42:10] ESCROW_FROZE triggered for CP-001 - amount: $12,400 USD\n[13:42:11] Campaign status updated to FLAGGED', confidence: 94 },
    { ts: '13:42:10', level: 'ACTION', title: 'Escrow Payment Frozen', description: '$12,400 held in escrow for CP-001 / @fashionnova_ pending HOTL review.', color: '#a78bfa' },
    { ts: '13:42:11', level: 'AUDIT', title: 'Campaign FLAGGED', description: 'Campaign CP-001 status set to FLAGGED. AI confidence 94% exceeds threshold.', color: '#fbbf24' },
  ]);
  const [webhookActive, setWebhookActive] = useState(true);
  const [hotlModal, setHotlModal] = useState<null|{campaign:{id:string,brand:string,influencer:string,budget:string,aiScore:number};violation:{type:string,confidence:number,transcript:string,action:string};auditEntry:{timestamp:string,actor:string,action:string,outcome:string,target:string}}>(null);

  const triggerWebhook = useCallback(() => {
    const ids = ['CP-001','CP-002','CP-003','CP-004','CP-005','CP-006','CP-007','CP-008'];
    const infs = ['@fashionnova_','@glowbygrace','@stylemark','@luxe.edit','@everydayelegance','@minimalist.style','@aesthetic.ly','@streetwearh'];
    const conf = 72 + Math.floor(Math.random() * 26);
    const cid = ids[Math.floor(Math.random() * ids.length)];
    const inf = infs[Math.floor(Math.random() * infs.length)];
    const now = new Date().toTimeString().slice(0, 8);
    const tx = '[13:42:07] POST /api/v1/webhooks/influencer-scan\n[13:42:08] AI analysis started... scanning 48 posts, 12.4K comments\n[13:42:09] WARNING: Follower engagement anomaly detected. Ratio: 3.2:1\n[13:42:10] Flagging: fake_follower_pattern confidence=' + conf + '%\n[13:42:10] ESCROW_FROZE triggered for ' + cid + ' - amount: $12,400 USD\n[13:42:11] Campaign status updated to FLAGGED';
    const evs = [
      { ts: now, level: 'CRITICAL', title: 'Fake Engagement Pattern Detected', description: inf + ' flagged by AI - ' + conf + '% confidence. Escrow frozen. Campaign ' + cid + ' under review.', color: '#f87171', transcript: tx, confidence: conf },
      { ts: now, level: 'ACTION', title: 'Escrow Payment Frozen', description: '$12,400 held in escrow for ' + cid + ' / ' + inf + ' pending HOTL review.', color: '#a78bfa' },
      { ts: now, level: 'AUDIT', title: 'Campaign FLAGGED', description: 'Campaign ' + cid + ' status set to FLAGGED. AI confidence ' + conf + '% exceeds threshold.', color: '#fbbf24' },
    ];
    setWebhookActive(true);
    setWebhookEvents(prev => [...evs, ...prev]);
    setHotlModal({ campaign: { id: cid, brand: 'Meshki', influencer: inf, budget: '$12,400', aiScore: conf }, violation: { type: 'Fake Engagement Pattern', confidence: conf, transcript: tx, action: 'ESCROW_FROZEN' }, auditEntry: { timestamp: now, actor: 'AI Agent', action: 'ESCROW_FROZEN', outcome: 'frozen', target: cid + ' / ' + inf } });
    setTimeout(() => setWebhookActive(false), 10000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      const statuses: CampaignStatus[] = ['ACTIVE', 'FLAGGED', 'UNDER REVIEW', 'ESCROW FROZEN'];
      const idx = Math.floor(Math.random() * campaigns.length);
      setCampaigns(prev => prev.map((c, i) => i === idx ? { ...c, status: statuses[Math.floor(Math.random() * statuses.length)], lastActivity: 'Just now' } : c));
      const alertTypes = [
        { type: 'SENTIMENT', message: 'Real-time sentiment analysis updated for active campaigns', severity: 'LOW' as const },
        { type: 'RISK SCAN', message: 'CreatorTrust AI completed risk scan on 8 influencers', severity: 'LOW' as const },
        { type: 'COMPLIANCE', message: 'Automated compliance check passed for 4 campaigns', severity: 'LOW' as const },
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
    <div style={{ minHeight: '100vh', background: '#020209', color: '#f1f5f9', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a14; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        ::selection { background: rgba(99,102,241,0.3); color: #f1f5f9; }
        @keyframes ping { 75%, 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ticker { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow-pulse { 0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.15); } 50% { box-shadow: 0 0 40px rgba(99,102,241,0.35); } }
        @keyframes orb-drift { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -20px)