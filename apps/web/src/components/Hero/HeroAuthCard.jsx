'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';

/**
 * RoleSelector: Renders a dropdown to pick a user role within the active app.
 */
function RoleSelector({ roles, selectedRole, onRoleChange }) {
  return (
    <div className={styles.roleWrapper}>
      <label className={styles.roleLabel} htmlFor="role-select">
        I am a
      </label>
      <select
        id="role-select"
        className={styles.roleSelect}
        value={selectedRole}
        onChange={(e) => onRoleChange(e.target.value)}
      >
        {roles.map((role) => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * AuthProviders: Renders OAuth buttons and Email input/flow logic based on JSON data.
 */
function AuthProviders({ providers, flows, activeFlow, onFlowChange, emailRef }) {
  return (
    <div className={styles.authProviders}>
      {providers.map((provider, index) => {
        // OAuth Button
        if (provider.type === 'oauth') {
          return (
            <button
              key={provider.id}
              className={styles.oauthBtn}
              onClick={() => console.log('OAuth clicked:', provider.id)}
              type="button"
            >
              <span className={styles.oauthIcon} aria-hidden="true">
                {provider.icon?.startsWith('http') ? (
                  <Image 
                    src={provider.icon} 
                    alt={provider.label} 
                    width={20} 
                    height={20} 
                  />
                ) : (
                  provider.id === 'google' ? 'G' : '•'
                )}
              </span>
              {provider.label}
            </button>
          );
        }

        // Email / Password-less block
        if (provider.type === 'email') {
          const hasPrevious = index > 0;
          return (
            <div key={provider.id} className={styles.emailBlock}>
              {hasPrevious && (
                <div className={styles.divider} aria-hidden="true">
                  <span>or</span>
                </div>
              )}

              <input
                ref={emailRef}
                className={styles.emailInput}
                type="email"
                placeholder={provider.placeholder || provider.label}
                aria-label={provider.label}
              />

              <div className={styles.flowBtns}>
                {Object.entries(flows).map(([flowKey, flow]) => (
                  <button
                    key={flowKey}
                    className={`${styles.flowBtn} ${activeFlow === flowKey ? styles.flowBtnActive : ''}`}
                    onClick={() => onFlowChange(flowKey)}
                    type="button"
                  >
                    {flow.label}
                  </button>
                ))}
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

/**
 * HeroAuthCard: The main interactive container for the Hero section's authentication logic.
 */
export default function HeroAuthCard({ apps }) {
  const [activeAppId, setActiveAppId] = useState(apps[0].id);
  const [selectedRole, setSelectedRole] = useState(apps[0].roles[0].value);
  const [activeFlow, setActiveFlow] = useState('signIn');
  
  const emailInputRef = useRef(null);

  const activeApp = apps.find((app) => app.id === activeAppId);

  useEffect(() => {
    const handleFocusEvent = () => {
      if (emailInputRef.current) {
        emailInputRef.current.focus();
        emailInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    window.addEventListener('leap:focus-auth', handleFocusEvent);
    return () => window.removeEventListener('leap:focus-auth', handleFocusEvent);
  }, []);

  const handleAppChange = (appId) => {
    const newApp = apps.find((app) => app.id === appId);
    setActiveAppId(appId);
    setSelectedRole(newApp.roles[0].value);
    setActiveFlow('signIn');
  };

  return (
    <div className={styles.authCard}>
      {/* ── App Tabs ───────────────────────────────────────── */}
      <div className={styles.tabs} role="tablist">
        {apps.map((app) => (
          <button
            key={app.id}
            role="tab"
            aria-selected={activeAppId === app.id}
            className={`${styles.tab} ${activeAppId === app.id ? styles.tabActive : ''}`}
            onClick={() => handleAppChange(app.id)}
            type="button"
          >
            {app.label}
          </button>
        ))}
      </div>

      {/* ── Tab Panel ──────────────────────────────────────── */}
      <div
        role="tabpanel"
        aria-label={`${activeApp.label} authentication form`}
        className={styles.tabPanel}
      >
        <p className={styles.appDescription}>{activeApp.description}</p>

        <RoleSelector
          roles={activeApp.roles}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
        />

        <AuthProviders
          providers={activeApp.auth.providers}
          flows={activeApp.auth.flows}
          activeFlow={activeFlow}
          onFlowChange={setActiveFlow}
          emailRef={emailInputRef}
        />
      </div>
    </div>
  );
}

