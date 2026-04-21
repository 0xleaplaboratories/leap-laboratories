'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchProgramContent } from '@/lib/content.server';
import styles from './Programs.module.css';

function ContentTabList({ tabs, activeId, onClick, onClose }) {
  return (
    <nav className={styles.tabBar} role="tablist" aria-label="Open programs documentation">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <div key={tab.id} className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}>
            <button
              className={styles.tabLabel}
              onClick={() => onClick(tab.id)}
              type="button"
              role="tab"
              aria-selected={isActive}
            >
              {tab.label}
            </button>
            <button
              className={styles.tabClose}
              onClick={(e) => { e.stopPropagation(); onClose(tab.id); }}
              aria-label={`Close ${tab.label}`}
              type="button"
            >
              ✕
            </button>
          </div>
        );
      })}
    </nav>
  );
}

function ProgramDocHeader({ metadata }) {
  if (!metadata?.banner) return null;
  return (
    <header className={styles.docHeader}>
      <div className={styles.docBannerWrapper}>
        <img src={metadata.banner} alt="Program Banner" className={styles.docBannerImg} />
        {metadata.logo && (
          <div className={styles.docLogoWrapper}>
            <img src={metadata.logo} alt="Organization Logo" className={styles.docLogo} />
          </div>
        )}
      </div>
    </header>
  );
}

function PaginationFABs({ current, total, onNext, onPrev }) {
  if (total <= 1) return null;
  return (
    <nav className={styles.paginationActions} aria-label="Documentation pages">
      <button 
        className={`${styles.pageBtn} ${styles.pageBtnPrev}`}
        onClick={onPrev}
        disabled={current === 0}
        title="Previous Page"
      >
        <span>← Previous</span>
      </button>
      <button 
        className={`${styles.pageBtn} ${styles.pageBtnNext}`}
        onClick={onNext}
        disabled={current === total - 1}
        title="Next Page"
      >
        <span>Next →</span>
      </button>
    </nav>
  );
}

function StatusOverlay({ status, activeId }) {
  if (status === 'loading') {
    return <div className={styles.contentLoading}><span>Loading scientific brief...</span></div>;
  }
  if (status === 'error') {
    return (
      <div className={styles.contentError} role="alert">
        <p><span>⚠️ DOCUMENTATION RETRIEVAL FAILED</span></p>
        <p className={styles.contentErrorHint}><span>The requested program brief is unavailable or corrupted.</span></p>
      </div>
    );
  }
  if (!status && activeId) {
    return <div className={styles.contentLoading}><span>Preparing visualization stage...</span></div>;
  }
  return null;
}

export default function ProgramsContent({ openTabs, activeTabId, onTabClick, onTabClose }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef(null);
  const contentPanelRef = useRef(null);
  const contentCache = useRef({});
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    if (!activeTabId) return;
    setCurrentPage(0);
    if (contentCache.current[activeTabId]) return;

    const activeTab = openTabs.find((t) => t.id === activeTabId);
    if (!activeTab?.href) return;

    contentCache.current[activeTabId] = { status: 'loading', metadata: null, pageBlocks: [] };
    forceUpdate(n => n + 1);

    fetchProgramContent(activeTab.href).then((data) => {
      contentCache.current[activeTabId] = data 
        ? { status: 'success', metadata: data.metadata, pageBlocks: data.pageBlocks }
        : { status: 'error', metadata: null, pageBlocks: [] };
      forceUpdate(n => n + 1);
    });
  }, [activeTabId, openTabs]);

  const scrollToTop = () => contentPanelRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  const onNext = () => { setCurrentPage(p => p + 1); scrollToTop(); };
  const onPrev = () => { setCurrentPage(p => p - 1); scrollToTop(); };

  if (openTabs.length === 0) {
    return <div className={styles.contentEmpty}><p className={styles.contentEmptyText}><span>Select a program to view its details.</span></p></div>;
  }

  const activeCache = contentCache.current[activeTabId];

  return (
    <div className={styles.content}>
      <ContentTabList tabs={openTabs} activeId={activeTabId} onClick={onTabClick} onClose={onTabClose} />

      <section ref={containerRef} className={`${styles.paneStage} ${isFullscreen ? styles.contentPanelFullscreen : ''}`}>
        <div ref={contentPanelRef} className={styles.contentPanel} role="tabpanel">
          <StatusOverlay status={activeCache?.status} activeId={activeTabId} />

          {activeCache?.status === 'success' && (
            <article className={styles.markdownArticle}>
              {currentPage === 0 && <ProgramDocHeader metadata={activeCache.metadata} />}
              <div 
                className={styles.markdownBody} 
                dangerouslySetInnerHTML={{ __html: activeCache.pageBlocks[currentPage] || '' }} 
              />
            </article>
          )}
        </div>

        <PaginationFABs 
          current={currentPage} 
          total={activeCache?.pageBlocks?.length || 0} 
          onNext={onNext} 
          onPrev={onPrev} 
        />

        <button className={styles.fullscreenBtn} onClick={toggleFullscreen} aria-label="Toggle Fullscreen">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={isFullscreen ? "M4 14h6m0 0v6m0-6L3 21M20 10h-6m0 0V4m0 6l7-7" : "M15 3h6m0 0v6m0-6L14 10M9 21H3m0 0v-6m0 6l7-7"} />
          </svg>
        </button>
      </section>
    </div>
  );
}
