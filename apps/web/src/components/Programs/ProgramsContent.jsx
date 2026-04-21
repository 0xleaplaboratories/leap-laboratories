'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchProgramContent } from '@/lib/content.server';
import styles from './Programs.module.css';

export default function ProgramsContent({ openTabs, activeTabId, onTabClick, onTabClose }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const contentCache = useRef({});
  const [, forceUpdate] = useState(0);
  const triggerRerender = () => forceUpdate((n) => n + 1);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    if (!activeTabId) return;
    if (contentCache.current[activeTabId]) return;

    const activeTab = openTabs.find((t) => t.id === activeTabId);
    if (!activeTab?.href) return;

    contentCache.current[activeTabId] = { status: 'loading', metadata: null, content: null };
    triggerRerender();

    fetchProgramContent(activeTab.href)
      .then((data) => {
        if (data && data.content) {
          contentCache.current[activeTabId] = { status: 'success', metadata: data.metadata, content: data.content };
        } else {
          contentCache.current[activeTabId] = { status: 'error', metadata: null, content: null };
        }
        triggerRerender();
      })
      .catch((error) => {
        console.error('Failed to fetch program content:', error);
        contentCache.current[activeTabId] = { status: 'error', metadata: null, content: null };
        triggerRerender();
      });
  }, [activeTabId, openTabs]);

  if (openTabs.length === 0) {
    return (
      <div className={styles.contentEmpty}>
        <p className={styles.contentEmptyText}>
          <span>Select a program from the file tree to view its details.</span>
        </p>
      </div>
    );
  }

  const activeCache = activeTabId ? contentCache.current[activeTabId] : null;

  return (
    <div className={styles.content}>
      <div className={styles.tabBar} role="tablist">
        {openTabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
            >
              <button
                className={styles.tabLabel}
                onClick={() => onTabClick(tab.id)}
                type="button"
                role="tab"
                aria-selected={isActive}
              >
                {tab.label}
              </button>
              <button
                className={styles.tabClose}
                onClick={(e) => { e.stopPropagation(); onTabClose(tab.id); }}
                aria-label={`Close ${tab.label}`}
                type="button"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      <section 
        ref={containerRef}
        className={`${styles.paneStage} ${isFullscreen ? styles.contentPanelFullscreen : ''}`}
      >
        <div 
          className={styles.contentPanel} 
          role="tabpanel"
        >
          <div className={`${styles.contentLoading} ${activeCache?.status === 'loading' ? '' : styles.hideAlways}`}>
            <span>Loading scientific brief...</span>
          </div>

          <div className={`${styles.contentError} ${activeCache?.status === 'error' ? '' : styles.hideAlways}`}>
            <p><span>⚠️ DOCUMENTATION RETRIEVAL FAILED</span></p>
            <p className={styles.contentErrorHint}>
              <span>The requested program brief is unavailable or corrupted.</span>
            </p>
          </div>

          <article className={`${activeCache?.status === 'success' ? '' : styles.hideAlways}`}>
            {activeCache?.metadata?.banner && (
              <header className={styles.docHeader}>
                <div className={styles.docBannerWrapper}>
                  <img 
                    src={activeCache.metadata.banner} 
                    alt="Program Header" 
                    className={styles.docBannerImg} 
                  />
                  {activeCache?.metadata?.logo && (
                    <div className={styles.docLogoWrapper}>
                      <img src={activeCache.metadata.logo} alt="Logo" className={styles.docLogo} />
                    </div>
                  )}
                </div>
              </header>
            )}

            <div 
              className={styles.markdownBody}
              dangerouslySetInnerHTML={{ __html: activeCache?.content || '' }} 
            />
          </article>

          <div className={`${styles.contentLoading} ${(!activeCache && activeTabId) ? '' : styles.hideAlways}`}>
            <span>Preparing visualization stage...</span>
          </div>
        </div>

        <button
          className={`${styles.fullscreenBtn} ${!isFullscreen ? styles.pulseAnimation : ''}`}
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14h6m0 0v6m0-6L3 21M20 10h-6m0 0V4m0 6l7-7" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6m0 0v6m0-6L14 10M9 21H3m0 0v-6m0 6l7-7" />
            </svg>
          )}
        </button>
      </section>
    </div>
  );
}
