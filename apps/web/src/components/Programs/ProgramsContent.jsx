'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { fetchProgramContent } from '@/lib/programActions';
import styles from './Programs.module.css';

export default function ProgramsContent({ openTabs, activeTabId, onTabClick, onTabClose }) {
  // contentCache stores fetched markdown objects by tab id.
  // Shape: { [tabId]: { status: 'loading' | 'success' | 'error', metadata: object, content: string } }
  const contentCache = useRef({});
  const [, forceUpdate] = useState(0);
  const triggerRerender = () => forceUpdate((n) => n + 1);

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

      <div className={styles.contentPanel} role="tabpanel">
        <div className={`${styles.contentLoading} ${activeCache?.status === 'loading' ? '' : styles.hideAlways}`}>
          <span><span>Loading document...</span></span>
        </div>

        <div className={`${styles.contentError} ${activeCache?.status === 'error' ? '' : styles.hideAlways}`}>
          <p><span>⚠️ Could not load content for this program.</span></p>
          <p className={styles.contentErrorHint}>
            <span>The document might be missing or corrupted.</span>
          </p>
        </div>

        <div className={`${styles.markdownBody} ${activeCache?.status === 'success' ? '' : styles.hideAlways}`}>
          <ReactMarkdown>{activeCache?.content || ''}</ReactMarkdown>
        </div>

        <div className={`${styles.contentLoading} ${(!activeCache && activeTabId) ? '' : styles.hideAlways}`}>
          <span><span>Preparing content...</span></span>
        </div>
      </div>
    </div>
  );
}
