'use client';

// ─── Why 'use client'? ────────────────────────────────────────
// This component uses useState and mouse event handlers (for the
// resizable divider). Both require running in the browser.

import { useState, useRef, useCallback, useEffect } from 'react';
import ServicesFileTree from './ServicesFileTree';
import ServicesContent from './ServicesContent';
import styles from './Services.module.css';

// ─── Constants ────────────────────────────────────────────────
const DEFAULT_LEFT_WIDTH_PERCENT = 30;  // Left pane starts at 30% of total width
const MIN_LEFT_WIDTH_PERCENT     = 15;  // Drag cannot go narrower than 15%
const MAX_LEFT_WIDTH_PERCENT     = 60;  // Drag cannot go wider than 60%

export default function ServicesExplorer({ services }) {
  const [activeRootId,      setActiveRootId]     = useState('academy'); // Default to Academy
  const [openFolderIds,    setOpenFolderIds]    = useState(new Set());
  const [openTabs,         setOpenTabs]         = useState([]);
  const [activeTabId,      setActiveTabId]      = useState(null);
  const [leftWidthPercent, setLeftWidthPercent] = useState(DEFAULT_LEFT_WIDTH_PERCENT);
  const [isLeftCollapsed,  setIsLeftCollapsed]  = useState(false);
  const [draggingActive,   setDraggingActive]   = useState(false);
  const [isDrawerOpen,     setIsDrawerOpen]     = useState(false);
  const [isMobile,         setIsMobile]         = useState(false); // Fix hydration issue

  const explorerRef = useRef(null);
  const isDragging  = useRef(false);

  // ── Effect: Responsive Detection ──────────────────────────────
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Handler: folder toggle ────────────────────────────────────
  const handleFolderToggle = useCallback((folderId) => {
    setOpenFolderIds((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);

  // ── Handler: leaf click ───────────────────────────────────────
  const handleLeafClick = useCallback((leaf) => {
    const alreadyOpen = openTabs.some((tab) => tab.id === leaf.id);
    if (alreadyOpen) {
      setActiveTabId(leaf.id);
    } else {
      setOpenTabs((prev) => [...prev, { id: leaf.id, label: leaf.label, href: leaf.href }]);
      setActiveTabId(leaf.id);
    }
    // Mobile: Close drawer on selection
    setIsDrawerOpen(false);
  }, [openTabs]);

  // ── Handler: tab close ────────────────────────────────────────
  const handleTabClose = useCallback((tabId) => {
    setOpenTabs((prev) => {
      const index   = prev.findIndex((t) => t.id === tabId);
      const newTabs = prev.filter((t) => t.id !== tabId);

      setActiveTabId((currentActiveId) => {
        if (currentActiveId !== tabId) return currentActiveId;
        if (newTabs.length === 0) return null;
        const newIndex = Math.max(0, index - 1);
        return newTabs[newIndex].id;
      });

      return newTabs;
    });
  }, []);

  // ── Handler: tab click ────────────────────────────────────────
  const handleTabClick = useCallback((tabId) => {
    setActiveTabId(tabId);
  }, []);

  // ── Handler: divider drag (supports Touch & Mouse) ────────────────
  const handleDividerStart = useCallback((e) => {
    // We only prevent default if we're actually dragging to allow scroll
    const isTouch = e.type === 'touchstart';
    const startX = isTouch ? e.touches[0].clientX : e.clientX;
    const startY = isTouch ? e.touches[0].clientY : e.clientY;

    let hasMoved = false;

    const onMove = (moveEvent) => {
      if (moveEvent.cancelable) moveEvent.preventDefault();
      hasMoved = true;
      isDragging.current = true;
      setDraggingActive(true);

      if (!explorerRef.current) return;
      const containerRect = explorerRef.current.getBoundingClientRect();
      const currX = isTouch ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const currY = isTouch ? moveEvent.touches[0].clientY : moveEvent.clientY;

      const isMobileNow = window.innerWidth < 768;

      if (isMobileNow) {
        const rawPercent = ((currY - containerRect.top) / containerRect.height) * 100;
        const clamped = Math.min(MAX_LEFT_WIDTH_PERCENT, Math.max(MIN_LEFT_WIDTH_PERCENT, rawPercent));
        setIsLeftCollapsed(false);
        setLeftWidthPercent(clamped);
      } else {
        const rawPercent = ((currX - containerRect.left) / containerRect.width) * 100;
        const clamped = Math.min(MAX_LEFT_WIDTH_PERCENT, Math.max(MIN_LEFT_WIDTH_PERCENT, rawPercent));
        setIsLeftCollapsed(false);
        setLeftWidthPercent(clamped);
      }
    };

    const onEnd = () => {
      if (isTouch) {
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
      } else {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
      }

      setDraggingActive(false);
      setTimeout(() => { isDragging.current = false; }, 0);
      if (!hasMoved) {
        setIsLeftCollapsed((prev) => !prev);
      }
    };

    if (isTouch) {
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onEnd);
    } else {
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);
    }
  }, []);



  // ── Computed values ──────────────────────────────────────────

  
  // Filter the services tree based on the active root tab
  const activeRoot = services.find(s => s.id === activeRootId);
  const filteredServices = activeRoot ? activeRoot.children : [];

  const explorerClassName = [
    styles.explorer,
    draggingActive ? styles.explorerDragging : '',
    isDrawerOpen ? styles.explorerDrawerShowing : ''
  ].join(' ');

  const leftStyle = !isMobile 
    ? (isLeftCollapsed ? { width: '0%', overflow: 'hidden' } : { width: `${leftWidthPercent}%` })
    : {};

  return (
    <div className={explorerClassName} ref={explorerRef}>
      
      {/* ── Mobile Control Bar ─────────────────────────────── */}
      {isMobile && (
        <div className={styles.mobileBar}>
          <button 
            className={styles.drawerToggle}
            onClick={() => setIsDrawerOpen(prev => !prev)}
          >
            {isDrawerOpen ? '✕ Close Menu' : '☰ Explore Services'}
          </button>
        </div>
      )}

      {/* ── Left pane: file tree (Mobile: Drawer) ─────────── */}
      <div 
        className={`${styles.leftPane} ${isMobile && isDrawerOpen ? styles.leftPaneOpen : ''}`} 
        style={leftStyle}
      >

        <div className={styles.explorerBranding}>LEAP-LABORATORIES</div>

        {/* Root Tabs */}
        <div className={styles.rootTabs}>
          {services.map(root => (
            <button
              key={root.id}
              className={`${styles.rootTab} ${activeRootId === root.id ? styles.rootTabActive : ''}`}
              onClick={() => setActiveRootId(root.id)}
            >
              {root.label}
            </button>
          ))}
        </div>

        <div className={styles.treeContainer}>
          <ServicesFileTree
            services={filteredServices}
            openFolderIds={openFolderIds}
            onFolderToggle={handleFolderToggle}
            onLeafClick={handleLeafClick}
            activeTabId={activeTabId}
          />
        </div>
      </div>

      {/* ── Divider (Desktop Only) ────────────────────────── */}
      {!isMobile && (
        <div
          className={`${styles.divider} ${isLeftCollapsed ? styles.dividerCollapsed : ''}`}
          onMouseDown={handleDividerStart}
          onTouchStart={handleDividerStart}
          title={isLeftCollapsed ? 'Click to expand file tree' : 'Drag to resize · Click to collapse'}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize file tree"
        />
      )}

      {/* ── Right pane: content tabs ───────────────────────── */}
      <div className={styles.rightPane}>
        <ServicesContent
          openTabs={openTabs}
          activeTabId={activeTabId}
          onTabClick={handleTabClick}
          onTabClose={handleTabClose}
        />
      </div>

      {/* Drawer Overlay (Mobile) */}
      {isMobile && isDrawerOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  );
}
