'use client';

import Image from 'next/image';
import styles from './Programs.module.css';

function TreeIcon({ isFolder }) {
  const iconSrc = isFolder ? '/assets/icons/folder.svg' : '/assets/icons/file-markdown.svg';
  return (
    <Image
      src={iconSrc}
      alt={isFolder ? 'Folder' : 'File'}
      width={14}
      height={14}
      className={styles.treeIcon}
    />
  );
}

function TreeRow({ node, depth, isOpen, isActive, isDisabled, onToggle, onClick }) {
  const isFolder = !!(node.id.includes('folder') || node.children);
  
  return (
    <button
      className={`${styles.treeRow} ${isActive ? styles.treeRowActive : ''} ${isDisabled ? styles.treeRowDisabled : ''}`}
      onClick={isFolder ? onToggle : onClick}
      style={{ paddingLeft: `${depth * 16 + 12}px` }}
      disabled={isDisabled}
      aria-expanded={isFolder ? isOpen : undefined}
    >
      {isFolder && (
        <span className={`${styles.treeArrow} ${isOpen ? styles.treeArrowOpen : ''}`} aria-hidden="true">
          ▶
        </span>
      )}
      <TreeIcon isFolder={isFolder} />
      <span className={styles.treeLabel}>{node.label}</span>
    </button>
  );
}

function TreeBranch({ node, depth, openFolderIds, onFolderToggle, onLeafClick, activeTabId }) {
  const isFolder = !!(node.id.includes('folder') || node.children);
  const isOpen = openFolderIds.has(node.id);
  const isActive = node.id === activeTabId;
  const isDisabled = node.disabled;

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!isDisabled) onFolderToggle(node.id);
  };

  const handleLeafClick = (e) => {
    e.stopPropagation();
    if (!isDisabled) onLeafClick(node);
  };

  return (
    <li className={styles.treeNode}>
      <TreeRow 
        node={node}
        depth={depth}
        isOpen={isOpen}
        isActive={isActive}
        isDisabled={isDisabled}
        onToggle={handleToggle}
        onClick={handleLeafClick}
      />

      {isFolder && isOpen && node.children && (
        <ul className={styles.treeChildren}>
          {node.children.map((child) => (
            <TreeBranch
              key={child.id}
              node={child}
              depth={depth + 1}
              openFolderIds={openFolderIds}
              onFolderToggle={onFolderToggle}
              onLeafClick={onLeafClick}
              activeTabId={activeTabId}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function ProgramsFileTree({ programs, openFolderIds, onFolderToggle, onLeafClick, activeTabId }) {
  return (
    <nav className={styles.fileTree} aria-label="Program documentation explorer">
      <header className={styles.fileTreeHeader}>
        <h3 className={styles.fileTreeTitle}>EXPLORER</h3>
      </header>
      <div className={styles.fileTreeBody}>
        <ul className={styles.rootTreeList}>
          {programs.map((root) => (
            <TreeBranch
              key={root.id}
              node={root}
              depth={0}
              openFolderIds={openFolderIds}
              onFolderToggle={onFolderToggle}
              onLeafClick={onLeafClick}
              activeTabId={activeTabId}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
}
