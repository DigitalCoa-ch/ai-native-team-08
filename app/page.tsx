'use client';

export default function Home() {
  return (
    <main>
      {/* ─── Hero ─── */}
      <section
        style={{
          minHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)',
          color: '#fff',
        }}
      >
        <div style={{ maxWidth: 720 }}>
          <span
            style={{
              display: 'inline-block',
              padding: '0.3rem 1rem',
              borderRadius: 999,
              border: '1px solid rgba(139,92,246,0.6)',
              color: '#a78bfa',
              fontSize: '0.8rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >
            AI-Native Brand Protection
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 6vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.2rem',
              background: 'linear-gradient(90deg, #e879f9, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            CreatorTrust AI
          </h1>
          <p
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              color: '#c4b5fd',
              lineHeight: 1.7,
              maxWidth: 580,
              margin: '0 auto 2.4rem',
            }}
          >
            Instantly score influencer risk profiles before you partner. Our AI classifies, monitors, and
            recommends the right creators so your brand stays protected.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              style={{
                padding: '0.85rem 2rem',
                borderRadius: 8,
                border: 'none',
                background: 'linear-gradient(90deg, #a78bfa, #e879f9)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              Request Early Access
            </button>
            <button
              style={{
                padding: '0.85rem 2rem',
                borderRadius: 8,
                border: '1px solid rgba(167,139,250,0.5)',
                background: 'transparent',
                color: '#e9d5ff',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* ─── Problem ─── */}
      <section style={{ padding: '5rem 2rem', background: '#fafafa', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem', color: '#1a1a2e' }}>
            The Problem
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#4a4a6a', lineHeight: 1.8 }}>
            Brands collaborating with micro-influencers face a hidden risk: one bad match can damage
            reputation built over years. Manual checks are slow, inconsistent, and miss critical signals.
            Marketing teams need to scale safely — without adding headcount.
          </p>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section style={{ padding: '5rem 2rem', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem', color: '#1a1a2e' }}>
            How It Works
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem',
            }}
          >
            {[
              {
                step: '01',
                title: 'Submit Influencer Profile',
                body: 'Enter a creator\'s social handle or profile data. Our system ingests public signals and metadata.',
              },
              {
                step: '02',
                title: 'AI Risk Analysis',
                body: 'CreatorTrust AI classifies risk level, extracts content patterns, and monitors historical signals — automatically.',
              },
              {
                step: '03',
                title: 'Brand-Aligned Recommendation',
                body: 'Get a clear risk score and match recommendation tailored to your brand\'s values and audience.',
              },
            ].map(({ step, title, body }) => (
              <div
                key={step}
                style={{
                  padding: '2rem',
                  borderRadius: 12,
                  border: '1px solid #ede9fe',
                  background: '#faf9ff',
                }}
              >
                <span style={{ color: '#a78bfa', fontWeight: 800, fontSize: '2rem' }}>{step}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.8rem 0 0.5rem', color: '#1a1a2e' }}>
                  {title}
                </h3>
                <p style={{ color: '#6b7280', lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section style={{ padding: '5rem 2rem', background: '#0f0f1a', color: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem' }}>
            Built for Brand Teams
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              { title: 'Risk Classification', desc: 'AI classifies influencers into Low / Medium / High risk buckets with explanations.' },
              { title: 'Pattern Extraction', desc: 'Extracts recurring content themes, posting habits, and audience signals.' },
              { title: 'Continuous Monitoring', desc: 'Track influencer profiles over time and alert on reputation-risk events.' },
              { title: 'Brand Matching', desc: 'Recommends creators whose audience, values, and tone align with your brand.' },
              { title: 'Human in the Loop', desc: 'Final partnership decisions stay with your team — AI informs, not replaces.' },
              { title: 'Fast Integration', desc: 'Connects via standard social APIs — no complex setup required.' },
            ].map(({ title, desc }) => (
              <div key={title} style={{ padding: '1.5rem', borderRadius: 10, border: '1px solid rgba(167,139,250,0.25)', background: 'rgba(167,139,250,0.06)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem', color: '#e9d5ff' }}>{title}</h3>
                <p style={{ color: '#a78bfa', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg, #1a1a2e, #2d1b69)', textAlign: 'center', color: '#fff' }}>
        <div style={{ maxWidth: 540, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to partner smarter?
          </h2>
          <p style={{ color: '#c4b5fd', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            CreatorTrust AI is built for European fashion and beauty brands who work with micro-influencers. Get early access and protect your brand from day one.
          </p>
          <button
            style={{
              padding: '0.9rem 2.5rem',
              borderRadius: 8,
              border: 'none',
              background: 'linear-gradient(90deg, #a78bfa, #e879f9)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.05rem',
              cursor: 'pointer',
            }}
          >
            Request Early Access
          </button>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ padding: '2rem', background: '#0a0a14', color: '#6b7280', fontSize: '0.85rem', textAlign: 'center' }}>
        <p>© {new Date().getFullYear()} CreatorTrust AI. All rights reserved.</p>
      </footer>
    </main>
  );
}