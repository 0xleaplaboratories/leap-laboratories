'use client';

// ─── Why 'use client'? ────────────────────────────────────────
// This component renders interactive elements (clickable rows).
// Even though it has no useState, it must be a Client Component
// because it receives event handler functions as props.

import Image from 'next/image';
import styles from './Services.module.css';

// ─── TreeNode (recursive sub-component) ──────────────────────
function TreeNode({ node, depth, openFolderIds, onFolderToggle, onLeafClick, activeTabId }) {
  const isFolder   = node.id.includes('folder') ? true : (node.type === 'folder'); // Robust check
  const isOpen     = isFolder && openFolderIds.has(node.id);
  const isDisabled = node.meta?.disabled === true;
  const isActive   = node.id === activeTabId;

  // Indentation: each depth level adds 24px of left padding.
  const indentStyle = { 
    paddingLeft: `${depth * 24 + 16}px`,
    '--depth': depth
  };

  // ── Folder node ──────────────────────────────────────────────
  if (isFolder) {
    const folderIcon = isOpen ? node.meta?.iconOpen : node.meta?.iconClose;

    return (
      <div className={styles.treeFolder}>
        <button
          className={`${styles.treeRow} ${isDisabled ? styles.treeRowDisabled : ''} ${isActive ? styles.treeRowActive : ''}`}
          style={indentStyle}
          onClick={() => !isDisabled && onFolderToggle(node.id)}
          disabled={isDisabled}
          aria-expanded={isOpen}
          type="button"
        >
          <span className={`${styles.treeArrow} ${isOpen ? styles.treeArrowOpen : ''}`}>
            ▶
          </span>

          {folderIcon && (
            <Image
              src={folderIcon}
              alt=""
              width={16}
              height={16}
              className={styles.treeIcon}
            />
          )}

          <span className={styles.treeLabel}>{node.label}</span>
        </button>

        {isOpen && node.children?.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            depth={depth + 1}
            openFolderIds={openFolderIds}
            onFolderToggle={onFolderToggle}
            onLeafClick={onLeafClick}
            activeTabId={activeTabId}
          />
        ))}
      </div>
    );
  }

  // ── Leaf node ────────────────────────────────────────────────
  return (
    <button
      className={`${styles.treeRow} ${isDisabled ? styles.treeRowDisabled : ''} ${isActive ? styles.treeRowActive : ''}`}
      style={indentStyle}
      onClick={() => !isDisabled && onLeafClick(node)}
      disabled={isDisabled}
      type="button"
    >
      {node.meta?.icon && (
        <Image
          src={node.meta.icon}
          alt=""
          width={16}
          height={16}
          className={styles.treeIcon}
        />
      )}

      <span className={styles.treeLabel}>{node.label}</span>
    </button>
  );
}

export default function ServicesFileTree({ services, openFolderIds, onFolderToggle, onLeafClick, activeTabId }) {
  return (
    <div className={styles.fileTree}>
      <div className={styles.fileTreeBody}>
        {services.map((rootNode) => (
          <TreeNode
            key={rootNode.id}
            node={rootNode}
            depth={0}
            openFolderIds={openFolderIds}
            onFolderToggle={onFolderToggle}
            onLeafClick={onLeafClick}
            activeTabId={activeTabId}
          />
        ))}
      </div>
    </div>
  );
}
