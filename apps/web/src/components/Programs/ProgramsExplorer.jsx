'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import ProgramsFileTree from './ProgramsFileTree';
import ProgramsContent from './ProgramsContent';
import styles from './ProgramsExplorer.module.css';

const DEFAULT_LEFT_WIDTH_PERCENT = 30;
const MIN_LEFT_WIDTH_PERCENT     = 15;
const MAX_LEFT_WIDTH_PERCENT     = 60;

export default function ProgramsExplorer({ programs }) {
  const [activeRootId,      setActiveRootId]     = useState('academy');
  const [openFolderIds,    setOpenFolderIds]    = useState(new Set());
  const [openTabs,         setOpenTabs]         = useState([]);
  const [activeTabId,      setActiveTabId]      = useState(null);
  const [leftWidthPercent, setLeftWidthPercent] = useState(DEFAULT_LEFT_WIDTH_PERCENT);
  const [isLeftCollapsed,  setIsLeftCollapsed]  = useState(false);
  const [draggingActive,   setDraggingActive]   = useState(false);
  const [isDrawerOpen,     setIsDrawerOpen]     = useState(false);
  const [isMobile,         setIsMobile]         = useState(false);
  const [hasMounted,       setHasMounted]       = useState(false);

  const explorerRef = useRef(null);
  const isDragging  = useRef(false);

  useEffect(() => {
    setHasMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 1100);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle Deep Linking from URL Hash
  useEffect(() => {
    if (!hasMounted || !programs.length) return;

    const handleHashLink = () => {
      const hash = window.location.hash;
      if (!hash.startsWith('#programs/')) return;

      const fullPath = hash.replace('#programs/', '');
      const parts = fullPath.split('/');
      const rootId = parts[0];

      // Match the internal ID format (hyphenated) for searching
      const fullId = fullPath.replace(/\//g, '-');

      // 1. Switch to the correct Root Tab (Academy / Labs)
      if (rootId) {
        const rootExists = programs.find(p => p.id === rootId);
        if (rootExists) {
          setActiveRootId(rootId);
          
          // Explicit scroll to ensure precise landing
          setTimeout(() => {
            const element = document.getElementById(`programs/${rootId}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      }

      // 2. Search for the Deep Node (Folder or File)
      const findNodeAndPath = (nodes, targetId, currentPath = []) => {
        for (const node of nodes) {
          if (node.id === targetId) return { node, path: currentPath };
          if (node.children) {
            const result = findNodeAndPath(node.children, targetId, [...currentPath, node.id]);
            if (result) return result;
          }
        }
        return null;
      }

      const target = findNodeAndPath(programs, fullId);
      if (target) {
        const { node, path } = target;

        // 2. ALWAYS expand ancestor folders + target folder to show the structure
        setOpenFolderIds(prev => {
          const next = new Set(prev);
          path.forEach(id => next.add(id));
          if (node.type === 'folder') {
            next.add(node.id);
          }
          return next;
        });

        // 3. Metadata Guard: Stop here if content is disabled
        if (node.meta?.disabled) return;

        // 4. Open the file if it's an active leaf
        if (node.type === 'leaf') {
          setOpenTabs(prev => {
            const alreadyOpen = prev.some(t => t.id === node.id);
            if (alreadyOpen) return prev;
            return [...prev, { id: node.id, label: node.label, href: node.href }];
          });
          setActiveTabId(node.id);
        }
      }
    };

    // Run once on mount/programs-load
    handleHashLink();

    // Listen for changes
    window.addEventListener('hashchange', handleHashLink);
    
    // Supplement with click listener for same-page hash links (like from footer)
    const handleGlobalClick = (e) => {
      const target = e.target.closest('a');
      if (target && target.hash && target.hash.startsWith('#programs/')) {
        // Small delay to let the browser update the hash
        setTimeout(handleHashLink, 50);
      }
    };
    
    window.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('hashchange', handleHashLink);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [hasMounted, programs]);

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

  const handleLeafClick = useCallback((leaf) => {
    const alreadyOpen = openTabs.some((tab) => tab.id === leaf.id);
    if (alreadyOpen) {
      setActiveTabId(leaf.id);
    } else {
      setOpenTabs((prev) => [...prev, { id: leaf.id, label: leaf.label, href: leaf.href }]);
      setActiveTabId(leaf.id);
    }
    setIsDrawerOpen(false);
  }, [openTabs]);

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

  const handleTabClick = useCallback((tabId) => {
    setActiveTabId(tabId);
  }, []);

  const handleDividerStart = useCallback((e) => {
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

      const isMobileNow = window.innerWidth < 1100;

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

  const activeRoot = programs.find(s => s.id === activeRootId);
  const filteredPrograms = activeRoot ? activeRoot.children : [];

  const explorerClassName = [
    styles.explorer,
    draggingActive ? styles.explorerDragging : '',
    isDrawerOpen ? styles.explorerDrawerShowing : '',
    'notranslate'
  ].join(' ');

  const leftStyle = !isMobile 
    ? (isLeftCollapsed ? { width: '0%', overflow: 'hidden' } : { width: `${leftWidthPercent}%` })
    : {};

  return (
    <div className={explorerClassName} ref={explorerRef} translate="no">
      <div className={`${styles.mobileBar} ${hasMounted && isMobile ? styles.showOnMobile : styles.hideAlways}`}>
        <button 
          className={styles.drawerToggle}
          onClick={() => setIsDrawerOpen(prev => !prev)}
        >
            <span className={isDrawerOpen ? styles.hideAlways : ''}><span>☰ Explore Programs</span></span>
            <span className={!isDrawerOpen ? styles.hideAlways : ''}><span>✕ Close Menu</span></span>
        </button>
      </div>

      <div 
        className={`${styles.leftPane} ${isMobile && isDrawerOpen ? styles.leftPaneOpen : ''}`} 
        style={leftStyle}
      >
        <div className={styles.explorerBranding}><span>LEAP-LABORATORIES</span></div>

        <div className={styles.rootTabs}>
          {programs.map(root => (
            <button
              key={root.id}
              id={`programs/${root.id}`}
              className={`${styles.rootTab} ${activeRootId === root.id ? styles.rootTabActive : ''}`}
              onClick={() => setActiveRootId(root.id)}
            >
              <span>{root.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.treeContainer}>
          <ProgramsFileTree
            programs={filteredPrograms}
            openFolderIds={openFolderIds}
            onFolderToggle={handleFolderToggle}
            onLeafClick={handleLeafClick}
            activeTabId={activeTabId}
          />
        </div>
      </div>

      <div
        className={`${styles.divider} ${isLeftCollapsed ? styles.dividerCollapsed : ''} ${hasMounted && isMobile ? styles.hideAlways : styles.showOnDesktop}`}
        onMouseDown={handleDividerStart}
        onTouchStart={handleDividerStart}
        title={isLeftCollapsed ? 'Click to expand file tree' : 'Drag to resize · Click to collapse'}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize file tree"
      />

      <div className={styles.rightPane}>
        <ProgramsContent
          openTabs={openTabs}
          activeTabId={activeTabId}
          onTabClick={handleTabClick}
          onTabClose={handleTabClose}
        />
      </div>

      <div 
        className={`${styles.overlay} ${hasMounted && isMobile && isDrawerOpen ? styles.showOnMobile : styles.hideAlways}`} 
        onClick={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
