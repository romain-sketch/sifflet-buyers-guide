import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

/*
 * HUBSPOT CONFIGURATION
 * Replace these values with your actual HubSpot portal and form IDs
 */
const HUBSPOT_CONFIG = {
  portalId: '24383351',
  partFormIds: {
    1: "2cd3821f-cd9c-47fd-a415-7364b51a2859",
    2: "ddb44128-77b4-491c-b5d3-e21f2cc42567",
    3: "6d0bb0a4-d9cb-46c5-a37a-788ce600c04c",
    4: "1b11cc21-b5f5-4409-ac5f-cc4249e6dc31",
    5: "c4a34616-871e-4fac-ba7d-8dee7dd95aa4",
    6: "aa88604a-2842-468c-bc5b-4e229d3aa6da",
  }
};

export default function BuyersGuide() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [showGateModal, setShowGateModal] = useState(false);
  const [gateContext, setGateContext] = useState(null);
  const [hubspotLoaded, setHubspotLoaded] = useState(false);
  const formContainerRef = useRef(null);

  const releases = [
    {
      id: 1,
      theme: 'The Trust Crisis',
      tagline: 'Why data quality is a boardroom problem',
      available: true,
      releaseDate: 'Feb 4',
      chapters: [
        { 
          num: '01', 
          title: 'When bad data breaks good business', 
          hook: 'The $3.1 trillion problem nobody talks about',
          teaser: 'Every company thinks they have a "data problem." The truth is messier: they have a trust problem. This chapter unpacks real cases where bad data didn\'t just cause inefficiency—it broke businesses.',
          stats: '8 min read',
          topics: ['Hidden costs of data distrust', 'The trust tax', 'Why dashboards lie'],
        },
        { 
          num: '02', 
          title: 'Data quality can\'t be delegated', 
          hook: 'Your CDO can\'t fix this alone',
          teaser: 'Data quality initiatives fail when they\'re treated as IT projects. This chapter makes the case for why data trust is a board-level concern—and what happens when executives opt out.',
          stats: '10 min read',
          topics: ['The delegation trap', 'What CEOs get wrong', 'Executive buy-in'],
        },
      ]
    },
    {
      id: 2,
      theme: 'What Observability Really Means',
      tagline: 'Beyond monitoring, toward context',
      available: false,
      releaseDate: 'Feb 25',
      chapters: [
        { 
          num: '03', 
          title: 'Why data observability without business context isn\'t observability at all', 
          hook: 'Metrics without meaning are just noise',
          teaser: 'Most observability tools tell you something is broken. Few tell you why it matters. Learn why business context is the missing layer in modern data stacks.',
          stats: '12 min read',
          topics: ['Context vs. coverage', 'The metadata gap', 'Semantic observability'],
        },
        { 
          num: '04', 
          title: 'What to expect from a modern observability platform', 
          hook: 'The 2026 capabilities checklist',
          teaser: 'A practical framework for evaluating platforms—what\'s table stakes, what\'s differentiating, and what\'s marketing fluff.',
          stats: '15 min read',
          topics: ['Must-have capabilities', 'Nice-to-haves', 'Red flags'],
        },
      ]
    },
    {
      id: 3,
      theme: 'From Alerts to Action',
      tagline: 'Use cases that actually work',
      available: false,
      releaseDate: 'Mar 18',
      chapters: [
        { 
          num: '05', 
          title: 'Use cases that align teams and drive results', 
          hook: '7 patterns from high-performing data teams',
          teaser: 'Concrete use cases from companies that moved from reactive firefighting to proactive data operations.',
          stats: '11 min read',
          topics: ['Pipeline monitoring', 'Incident response', 'Cross-team alignment'],
        },
        { 
          num: '06', 
          title: 'Beyond alerts', 
          hook: 'Why alert fatigue is a symptom, not the disease',
          teaser: 'The average data team ignores 73% of alerts. This chapter explores what comes after the alert—and why resolution matters more than detection.',
          stats: '9 min read',
          topics: ['Alert fatigue patterns', 'Smart routing', 'From alert to action'],
        },
      ]
    },
    {
      id: 4,
      theme: 'The AI Imperative',
      tagline: 'Why observability is your AI readiness foundation',
      available: false,
      releaseDate: 'April 8',
      chapters: [
        { 
          num: '07', 
          title: 'From detection to resolution', 
          hook: 'The 47-minute gap that kills data trust',
          teaser: 'Detection is solved. Resolution isn\'t. Learn why mean-time-to-resolution (MTTR) is the new battleground for data teams.',
          stats: '10 min read',
          topics: ['MTTR benchmarks', 'Automated remediation', 'Runbook automation'],
        },
        { 
          num: '08', 
          title: 'Making AI work', 
          hook: 'Your AI is only as good as your data',
          teaser: 'GenAI projects fail because of data quality, not model quality. This chapter shows how observability becomes the foundation for AI readiness.',
          stats: '14 min read',
          topics: ['AI data requirements', 'Training data quality', 'LLM observability'],
        },
      ]
    },
    {
      id: 5,
      theme: 'Operational Maturity',
      tagline: 'From chaos to predictable performance',
      available: false,
      releaseDate: 'Apr 29',
      chapters: [
        { 
          num: '09', 
          title: 'From DataOps chaos to predictable performance', 
          hook: 'The operational maturity ladder',
          teaser: 'A framework for assessing where your team sits on the DataOps maturity curve—and concrete steps to level up.',
          stats: '11 min read',
          topics: ['Maturity assessment', 'Team structures', 'Process optimization'],
        },
        { 
          num: '10', 
          title: 'Platform fit', 
          hook: 'The integration tax nobody budgets for',
          teaser: 'Choosing a platform isn\'t just about features—it\'s about fit. This chapter covers integration depth, security requirements, and scaling considerations.',
          stats: '13 min read',
          topics: ['Integration patterns', 'Security & compliance', 'Scaling strategies'],
        },
      ]
    },
    {
      id: 6,
      theme: 'Making the Case',
      tagline: 'ROI, evaluation, and choosing your platform',
      available: false,
      releaseDate: 'May 20',
      chapters: [
        { 
          num: '11', 
          title: 'The ROI of trust', 
          hook: 'The business case your CFO will approve',
          teaser: 'Hard numbers, real formulas, and a framework for building an ROI case that gets budget approved.',
          stats: '16 min read',
          topics: ['ROI calculation', 'Cost of inaction', 'Value metrics'],
        },
        { 
          num: '12', 
          title: 'Choosing the right data observability platform', 
          hook: 'Your evaluation playbook',
          teaser: 'A step-by-step guide to running a vendor evaluation—including the questions to ask, POC structure, and decision framework.',
          stats: '18 min read',
          topics: ['Vendor evaluation', 'POC best practices', 'Decision framework'],
        },
      ]
    },
  ];

  const availableCount = releases.filter(r => r.available).length;

  // Load HubSpot script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.hbspt) {
      const script = document.createElement('script');
      script.src = '//js.hsforms.net/forms/embed/v2.js';
      script.async = true;
      script.onload = () => setHubspotLoaded(true);
      document.head.appendChild(script);
    } else if (window.hbspt) {
      setHubspotLoaded(true);
    }
  }, []);

  // Render HubSpot form in modal
 useEffect(() => {
  if (showGateModal && hubspotLoaded && formContainerRef.current && gateContext && window.hbspt) {
    formContainerRef.current.innerHTML = '';
    
    const partNumber = gateContext.release?.id;
    const formId = HUBSPOT_CONFIG.partFormIds[partNumber];
    
    if (!formId) {
      formContainerRef.current.innerHTML = '<p style="text-align:center;color:#999;">Form not configured for this part.</p>';
      return;
    }
    
    window.hbspt.forms.create({
      portalId: HUBSPOT_CONFIG.portalId,
      formId: formId,
      target: '#hubspot-form-container',
      onFormSubmitted: function() {
        setIsSubscribed(true);
        setTimeout(() => setShowGateModal(false), 1500);
      },
    });
  }
}, [showGateModal, hubspotLoaded, gateContext]);

  // Handle deep linking
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#chapter-', '');
      if (hash) {
        setExpandedChapter(hash.padStart(2, '0'));
        setTimeout(() => {
          document.getElementById(`chapter-${hash.padStart(2, '0')}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, []);

const handleChapterAccess = (chapter, release) => {
  if (isSubscribed && release.available) {
    const pdfUrls = {
      1: 'https://24383351.fs1.hubspotusercontent-na1.net/hubfs/24383351/Sifflet%20Buyers%20Guide%20Part%201.pdf',
      2: 'https://24383351.fs1.hubspotusercontent-na1.net/hubfs/24383351/Sifflet%20Buyers%20Guide%20Part%202.pdf',
      3: 'https://24383351.fs1.hubspotusercontent-na1.net/hubfs/24383351/Sifflet%20Buyers%20Guide%20Part%203.pdf',
      4: 'https://24383351.fs1.hubspotusercontent-na1.net/hubfs/24383351/Sifflet%20Buyers%20Guide%20Part%204.pdf',
      5: 'https://24383351.fs1.hubspotusercontent-na1.net/hubfs/24383351/Sifflet%20Buyers%20Guide%20Part%205.pdf',
      6: 'https://24383351.fs1.hubspotusercontent-na1.net/hubfs/24383351/Sifflet%20Buyers%20Guide%20Part%206.pdf',
    };
    window.open(pdfUrls[release.id], '_blank');
  } else {
    setGateContext({ chapter, release });
    setShowGateModal(true);
  }
};

  const toggleExpand = (num) => {
    setExpandedChapter(expandedChapter === num ? null : num);
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#FAFAFA',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    nav: {
      background: '#fff',
      borderBottom: '1px solid #EBEBEB',
      padding: '16px 40px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    navInner: {
      maxWidth: '1100px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
hero: {
  background: 'linear-gradient(135deg, #0D0D0D 0%, #1A1A2E 100%)',
  color: '#fff',
  padding: '50px 20px 60px',
      position: 'relative',
      overflow: 'hidden',
    },
    grid: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
      backgroundSize: '50px 50px',
      pointerEvents: 'none',
    },
  };

  return (
    <>
      <Head>
        <title>The Data Observability Buyer&apos;s Guide 2026 | Sifflet</title>
        <meta name="description" content="6 parts. 12 chapters. Everything you need to evaluate, justify, and implement data observability." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://www.siffletdata.com/favicon.ico" />
      </Head>

      <div style={styles.page}>
        {/* Modal */}
        {showGateModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #0D0D0D 0%, #1A1A2E 100%)',
                padding: '28px',
                color: '#fff',
              }}>
                <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '8px' }}>
                  Part {gateContext?.release?.id} · {gateContext?.release?.theme}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
                  {gateContext?.release?.available ? 'Unlock: ' : 'Get notified: '}
                  {gateContext?.chapter?.title}
                </h3>
              </div>
              <div style={{ padding: '28px' }}>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                  {gateContext?.release?.available 
                    ? 'Enter your details to unlock this chapter and get notified when new parts drop.'
                    : `This chapter releases ${gateContext?.release?.releaseDate}. Subscribe to get it first.`}
                </p>
                <div id="hubspot-form-container" ref={formContainerRef} style={{ minHeight: '150px' }}>
                  {!hubspotLoaded && <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>Loading form...</div>}
                </div>
                <p style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginTop: '16px' }}>No spam, ever. Unsubscribe anytime.</p>
              </div>
              <button
                onClick={() => setShowGateModal(false)}
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: '#fff',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >×</button>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={styles.nav}>
          <div style={styles.navInner}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <a href="https://www.siffletdata.com" style={{ textDecoration: 'none' }}>
                <img src="https://cdn.prod.website-files.com/6745ca418d70ad1c8e2b8442/68a089660db884497071e7c4_Logo%20variant%20container.svg" alt="Sifflet" height="28" />
              </a>
              <span style={{ fontSize: '12px', color: '#999', borderLeft: '1px solid #E0E0E0', paddingLeft: '32px' }}>
                Buyer&apos;s Guide 2026
              </span>
            </div>
            <a href="https://www.siffletdata.com/contact-us" target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', fontWeight: 500, color: '#E91E63', textDecoration: 'none' }}>
              Contact Us →
            </a>
          </div>
        </nav>

        {/* Hero */}
{/* Hero */}
<header style={styles.hero}>
  <div style={styles.grid} />
  <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
    <div className="hero-grid">
      <div>
        <span style={{
          display: 'inline-block',
          background: '#E91E63',
          color: '#fff',
          padding: '5px 12px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          borderRadius: '4px',
          marginBottom: '24px',
        }}>2026 Edition</span>
        
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, lineHeight: 1.15, margin: 0, letterSpacing: '-0.02em' }}>
          The Data <span style={{ color: '#E91E63' }}>Observability</span><br />Buyer&apos;s Guide
        </h1>

        <p style={{ fontSize: '16px', lineHeight: 1.65, maxWidth: '480px', opacity: 0.75, marginTop: '20px', marginBottom: '28px' }}>
          6 parts. 12 chapters. Released over 12 weeks. Everything you need to evaluate, justify, and implement data observability—from first principles to platform selection.
        </p>

        <button
          onClick={() => {
            const latestAvailable = releases.filter(r => r.available).pop();
            if (latestAvailable) {
              const firstChapter = latestAvailable.chapters[0];
              document.getElementById(`chapter-${firstChapter.num}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              setExpandedChapter(firstChapter.num);
            }
          }}
          style={{
            background: '#E91E63',
            color: '#fff',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >Get the Guide →</button>

        {isSubscribed && (
          <span style={{ marginLeft: '12px', color: '#81C784', fontSize: '14px' }}>✓ You&apos;re in!</span>
        )}
      </div>

      {/* Progress Card */}
      <div className="progress-card" style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '24px',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '12px' }}>Your Progress</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '42px', fontWeight: 300, lineHeight: 1 }}>{availableCount}</span>
          <span style={{ fontSize: '16px', opacity: 0.4 }}>/ 6 parts</span>
        </div>
        <div style={{ fontSize: '13px', opacity: 0.6, marginBottom: '20px' }}>available now</div>
        <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ width: `${(availableCount / 6) * 100}%`, height: '100%', background: '#E91E63', borderRadius: '3px' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {releases.map((r) => (
            <div key={r.id} style={{
              background: r.available ? '#E91E63' : 'rgba(255,255,255,0.06)',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 500,
              opacity: r.available ? 1 : 0.5,
            }}>{r.available ? `Part ${r.id} ✓` : r.releaseDate}</div>
          ))}
        </div>
      </div>
    </div>
  </div>
</header>

        {/* Subscribed Banner */}
        {isSubscribed && (
          <div style={{ background: '#E8F5E9', borderBottom: '1px solid #C8E6C9', padding: '12px 40px', textAlign: 'center' }}>
            <span style={{ fontSize: '13px', color: '#2E7D32', fontWeight: 500 }}>✓ You&apos;re subscribed! Click any available chapter to access it.</span>
          </div>
        )}

        {/* Main Content */}
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '50px 20px 100px' }}>
          {releases.map((release) => (
            <div key={release.id} style={{ marginBottom: '50px' }}>
              {/* Release Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: `1px solid ${release.available ? '#E91E63' : '#E8E8E8'}`,
              }}>
                <div style={{
                  background: release.available ? '#E91E63' : '#F0F0F0',
                  color: release.available ? '#fff' : '#999',
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '6px 12px',
                  borderRadius: '6px',
                }}>Part {release.id}</div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: release.available ? '#1A1A1A' : '#999' }}>{release.theme}</h2>
                  <p style={{ fontSize: '13px', color: '#888', margin: '2px 0 0 0' }}>{release.tagline}</p>
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: release.available ? '#2E7D32' : '#999',
                  background: release.available ? '#E8F5E9' : '#F5F5F5',
                  padding: '5px 12px',
                  borderRadius: '16px',
                }}>{release.available ? '● Live' : release.releaseDate}</div>
              </div>

              {/* Chapters */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {release.chapters.map((chapter) => (
                  <div
                    key={chapter.num}
                    id={`chapter-${chapter.num}`}
                    style={{
                      background: '#fff',
                      border: '1px solid #E8E8E8',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: expandedChapter === chapter.num ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
                      opacity: release.available ? 1 : 0.65,
                    }}
                  >
                    <div
                      onClick={() => toggleExpand(chapter.num)}
                      style={{ display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: '16px', alignItems: 'center', padding: '18px 20px', cursor: 'pointer' }}
                    >
                      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: release.available ? '#E91E63' : '#BBB' }}>
                        Ch. {chapter.num}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: '#1A1A1A', lineHeight: 1.35 }}>{chapter.title}</h3>
                        <div style={{ fontSize: '13px', color: '#E91E63', marginTop: '3px', fontWeight: 500 }}>{chapter.hook}</div>
                      </div>
                      <span style={{ color: '#CCC', fontSize: '18px', transform: expandedChapter === chapter.num ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>▾</span>
                    </div>

                    {expandedChapter === chapter.num && (
                      <div style={{ padding: '0 20px 20px 20px', borderTop: '1px solid #F0F0F0', paddingTop: '18px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '30px' }}>
                          <div>
                            <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#555', margin: '0 0 14px 0' }}>{chapter.teaser}</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                              {chapter.topics.map((topic, i) => (
                                <span key={i} style={{ fontSize: '11px', color: '#666', background: '#F5F5F5', padding: '4px 8px', borderRadius: '4px' }}>{topic}</span>
                              ))}
                            </div>
                            <span style={{ fontSize: '11px', color: '#999' }}>{chapter.stats}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleChapterAccess(chapter, release); }}
                              style={{
                                background: release.available ? '#E91E63' : '#F0F0F0',
                                color: release.available ? '#fff' : '#888',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                              }}
                            >{release.available ? (isSubscribed ? 'Read →' : 'Unlock') : 'Notify Me'}</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Notify CTA for locked releases */}
              {!release.available && !isSubscribed && (
                <button
                  onClick={() => { setGateContext({ chapter: release.chapters[0], release }); setShowGateModal(true); }}
                  style={{
                    marginTop: '14px',
                    background: 'transparent',
                    border: '1px solid #E91E63',
                    color: '#E91E63',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >🔔 Notify me when Part {release.id} drops</button>
              )}
            </div>
          ))}
        </main>

        {/* Footer */}
        <footer style={{ background: 'linear-gradient(135deg, #0D0D0D 0%, #1A1A2E 100%)', color: '#fff', padding: '70px 40px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h3 style={{ fontSize: '26px', fontWeight: 600, marginBottom: '12px' }}>
              More data. <span style={{ color: '#E91E63' }}>Less chaos.</span>
            </h3>
            <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '24px' }}>
              See how leading data teams achieve observability with Sifflet.
            </p>
            <a
              href="https://www.siffletdata.com/contact-us"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: '#E91E63',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >Request a Demo</a>
            <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', opacity: 0.5 }}>
              © 2026 Sifflet. All rights reserved.
            </div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; -webkit-font-smoothing: antialiased; }
        button:hover { opacity: 0.9; }
        /* Responsive Hero */
.hero-grid {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
@media (min-width: 768px) {
  .hero-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 60px;
    align-items: center;
  }
}
.progress-card {
  width: 100%;
  max-width: 400px;
}
@media (min-width: 768px) {
  .progress-card {
    max-width: none;
  }
}
        
        /* HubSpot Form Styling */
        #hubspot-form-container .hs-form { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; }
        #hubspot-form-container .hs-form-field { margin-bottom: 16px !important; }
        #hubspot-form-container .hs-form-field label { font-size: 13px !important; font-weight: 500 !important; color: #333 !important; margin-bottom: 6px !important; display: block !important; }
        #hubspot-form-container .hs-input { width: 100% !important; padding: 12px 14px !important; border: 1px solid #E0E0E0 !important; border-radius: 8px !important; font-size: 15px !important; }
        #hubspot-form-container .hs-input:focus { border-color: #E91E63 !important; outline: none !important; }
        #hubspot-form-container .hs-button { width: 100% !important; background: #E91E63 !important; color: #fff !important; border: none !important; padding: 12px 24px !important; border-radius: 8px !important; font-size: 14px !important; font-weight: 600 !important; cursor: pointer !important; }
        #hubspot-form-container .hs-error-msgs { color: #D32F2F !important; font-size: 12px !important; margin-top: 4px !important; }
        #hubspot-form-container .submitted-message { text-align: center !important; padding: 20px !important; color: #2E7D32 !important; }
      `}</style>
    </>
  );
}
