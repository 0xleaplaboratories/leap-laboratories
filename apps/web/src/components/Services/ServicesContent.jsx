'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { fetchServiceContent } from '@/lib/serviceActions';
import styles from './Services.module.css';

export default function ServicesContent({ openTabs, activeTabId, onTabClick, onTabClose }) {
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

    fetchServiceContent(activeTab.href)
      .then((data) => {
        if (data && data.content) {
          contentCache.current[activeTabId] = { status: 'success', metadata: data.metadata, content: data.content };
        } else {
          contentCache.current[activeTabId] = { status: 'error', metadata: null, content: null };
        }
        triggerRerender();
      })
      .catch((error) => {
        console.error('Failed to fetch service content:', error);
        contentCache.current[activeTabId] = { status: 'error', metadata: null, content: null };
        triggerRerender();
      });
  }, [activeTabId, openTabs]);

  if (openTabs.length === 0) {
    return (
      <div className={styles.contentEmpty}>
        <p className={styles.contentEmptyText}>
          Select a service from the file tree to view its details.
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
        {activeCache?.status === 'loading' && (
          <div className={styles.contentLoading}>
            <span>Loading document...</span>
          </div>
        )}

        {activeCache?.status === 'error' && (
          <div className={styles.contentError}>
            <p>Could not load content for this service.</p>
            <p className={styles.contentErrorHint}>
              The document might be missing or corrupted.
            </p>
          </div>
        )}

        {activeCache?.status === 'success' && (
          <div className={styles.markdownBody}>
            <ReactMarkdown>{activeCache.content}</ReactMarkdown>
          </div>
        )}

        {!activeCache && activeTabId && (
          <div className={styles.contentLoading}>
            <span>Preparing content...</span>
          </div>
        )}
      </div>
    </div>
  );
}
