'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import ProgramsFileTree from './ProgramsFileTree';
import ProgramsContent from './ProgramsContent';
import styles from './Programs.module.css';

const DEFAULT_WIDTH = 30;
const MIN_WIDTH     = 15;
const MAX_WIDTH     = 60;

function ExplorerMobileBar({ isDrawerOpen, onToggle, show }) {
  if (!show) return null;
  return (
    <div className={styles.mobileBar}>
      <button className={styles.drawerToggle} onClick={onToggle}>
        <span>{isDrawerOpen ? '✕ Close Menu' : '☰ Explore Programs'}</span>
      </button>
    </div>
  );
}

function ExplorerSidebar({ children, width, isCollapsed, isMobile, isDrawerOpen }) {
  const sidebarStyle = !isMobile 
    ? (isCollapsed ? { width: '0%', overflow: 'hidden' } : { width: `${width}%` })
    : {};
    
  return (
    <aside 
      className={`${styles.leftPane} ${isMobile && isDrawerOpen ? styles.leftPaneOpen : ''}`} 
      style={sidebarStyle}
    >
      {children}
    </aside>
  );
}

function ResizableDivider({ isCollapsed, onStart, show }) {
  if (!show) return null;
  return (
    <div
      className={`${styles.divider} ${isCollapsed ? styles.dividerCollapsed : ''}`}
      onMouseDown={onStart}
      onTouchStart={onStart}
      role="separator"
      aria-label="Resize explorer sidebar"
    />
  );
}

export default function ProgramsExplorer({ programs }) {
  const [activeRootId,      setActiveRootId]     = useState('academy');
  const [openFolderIds,    setOpenFolderIds]    = useState(new Set());
  const [openTabs,         setOpenTabs]         = useState([]);
  const [activeTabId,      setActiveTabId]      = useState(null);
  const [leftWidth,        setLeftWidth]        = useState(DEFAULT_WIDTH);
  const [isLeftCollapsed,  setIsLeftCollapsed]  = useState(false);
  const [dragging,         setDragging]         = useState(false);
  const [isDrawerOpen,     setIsDrawerOpen]     = useState(false);
  const [isMobile,         setIsMobile]         = useState(false);

  const explorerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1100);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFolderToggle = useCallback((id) => {
    setOpenFolderIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleLeafClick = useCallback((leaf) => {
    if (!openTabs.find(t => t.id === leaf.id)) {
      setOpenTabs(prev => [...prev, { id: leaf.id, label: leaf.label, href: leaf.href }]);
    }
    setActiveTabId(leaf.id);
    setIsDrawerOpen(false);
  }, [openTabs]);

  const handleTabClose = useCallback((id) => {
    setOpenTabs(prev => {
      const index = prev.findIndex(t => t.id === id);
      const nextTabs = prev.filter(t => t.id !== id);
      if (activeTabId === id) {
        setActiveTabId(nextTabs.length ? nextTabs[Math.max(0, index - 1)].id : null);
      }
      return nextTabs;
    });
  }, [activeTabId]);

  const handleDragStart = useCallback((e) => {
    const isTouch = e.type === 'touchstart';
    let hasMoved = false;

    const onMove = (me) => {
      if (me.cancelable) me.preventDefault();
      hasMoved = true;
      setDragging(true);
      const rect = explorerRef.current.getBoundingClientRect();
      const pos = isTouch ? me.touches[0] : me;
      const raw = isMobile ? ((pos.clientY - rect.top) / rect.height) * 100 : ((pos.clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, raw)));
      setIsLeftCollapsed(false);
    };

    const onEnd = () => {
      document.removeEventListener(isTouch ? 'touchmove' : 'mousemove', onMove);
      document.removeEventListener(isTouch ? 'touchend' : 'mouseup', onEnd);
      setDragging(false);
      if (!hasMoved) setIsLeftCollapsed(v => !v);
    };

    document.addEventListener(isTouch ? 'touchmove' : 'mousemove', onMove, { passive: false });
    document.addEventListener(isTouch ? 'touchend' : 'mouseup', onEnd);
  }, [isMobile]);

  const activeRoot = programs.find(s => s.id === activeRootId);

  return (
    <div 
      className={`${styles.explorer} ${dragging ? styles.explorerDragging : ''} ${isDrawerOpen ? styles.explorerDrawerShowing : ''}`} 
      ref={explorerRef}
      translate="no"
    >
      <ExplorerMobileBar isDrawerOpen={isDrawerOpen} onToggle={() => setIsDrawerOpen(v => !v)} show={isMobile} />

      <ExplorerSidebar width={leftWidth} isCollapsed={isLeftCollapsed} isMobile={isMobile} isDrawerOpen={isDrawerOpen}>
        <div className={styles.explorerBranding}><span>LEAP-LABORATORIES</span></div>
        <nav className={styles.rootTabs}>
          {programs.map(root => (
            <button
              key={root.id}
              className={`${styles.rootTab} ${activeRootId === root.id ? styles.rootTabActive : ''}`}
              onClick={() => setActiveRootId(root.id)}
            >
              <span>{root.label}</span>
            </button>
          ))}
        </nav>
        <div className={styles.treeContainer}>
          <ProgramsFileTree
            programs={activeRoot?.children || []}
            openFolderIds={openFolderIds}
            onFolderToggle={handleFolderToggle}
            onLeafClick={handleLeafClick}
            activeTabId={activeTabId}
          />
        </div>
      </ExplorerSidebar>

      <ResizableDivider isCollapsed={isLeftCollapsed} onStart={handleDragStart} show={!isMobile} />

      <main className={styles.rightPane}>
        <ProgramsContent
          openTabs={openTabs}
          activeTabId={activeTabId}
          onTabClick={id => setActiveTabId(id)}
          onTabClose={handleTabClose}
        />
      </main>

      {isMobile && isDrawerOpen && (
        <div className={styles.overlay} onClick={() => setIsDrawerOpen(false)} />
      )}
    </div>
  );
}
