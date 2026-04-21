'use client';

import Image from 'next/image';
import styles from './Programs.module.css';

function TreeNode({ node, depth, openFolderIds, onFolderToggle, onLeafClick, activeTabId }) {
  const isFolder   = node.id.includes('folder') ? true : (node.type === 'folder');
  const isOpen     = isFolder && openFolderIds.has(node.id);
  const isDisabled = node.meta?.disabled === true;
  const isActive   = node.id === activeTabId;

  const indentStyle = { 
    paddingLeft: `${depth * 24 + 16}px`,
    '--depth': depth
  };

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
            <span>▶</span>
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

          <span className={styles.treeLabel}><span>{node.label}</span></span>
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

      <span className={styles.treeLabel}><span>{node.label}</span></span>
    </button>
  );
}

export default function ProgramsFileTree({ programs, openFolderIds, onFolderToggle, onLeafClick, activeTabId }) {
  return (
    <div className={styles.fileTree}>
      <div className={styles.fileTreeBody}>
        {programs.map((rootNode) => (
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
