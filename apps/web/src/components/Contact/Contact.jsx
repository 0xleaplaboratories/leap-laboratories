import { getJSONContent } from "@/lib/content.server";
import Image from "next/image";
import Link from "next/link";
import styles from "./Contact.module.css";

export default async function Contact() {
  const data = await getJSONContent("contact/contact");

  if (!data || !data.contact) return null;

  const { brand, programs, links, copyright } = data.contact;

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Column 1: Brand & Identity */}
          <div className={styles.brandColumn}>
            <div className={styles.logoWrapper}>
              <Image 
                src={`/${brand.logo}`} 
                alt={brand.title} 
                width={64} 
                height={64} 
                className={styles.logo}
              />
              <span className={styles.brandTitle}>{brand.title}</span>
            </div>
            
            <div className={styles.taglineSection}>
              {brand.taglines.map((text, i) => (
                <p key={i} className={styles.tagline}>
                  {i === 0 ? <strong>{text}</strong> : text}
                </p>
              ))}
            </div>

            <div className={styles.contactDetails}>
              <div className={styles.detailItem}>
                <span className={styles.icon}>📍</span>
                <span className={styles.detailText}>Kediri, Indonesia</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.icon}>📞</span>
                <span className={styles.detailText}>+62 853-8592-8081</span>
              </div>
            </div>
          </div>

          {/* Column 2: Programs (Academy & Labs) */}
          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>Programs</h4>
            <div className={styles.linkList}>
              {programs.map((prog, i) => (
                <Link key={prog.tab} href={prog.href} className={styles.footerLink}>
                  {prog.tab}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Society */}
          <div className={styles.linksColumn}>
            {links.filter(l => l.group === "Society").map((group) => (
              <div key={group.group}>
                <h4 className={styles.columnTitle}>{group.group}</h4>
                <div className={styles.linkList}>
                  {group.children.map((child) => (
                    <Link key={child.name} href={child.href} className={styles.footerLink}>
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Column 4: Support & Certification */}
          <div className={styles.linksColumn}>
            {links.filter(l => l.group === "Support").map((group) => (
              <div key={group.group}>
                <h4 className={styles.columnTitle}>{group.group}</h4>
                <div className={styles.linkList}>
                  {group.children.map((child) => (
                    <Link key={child.name} href={child.href} className={styles.footerLink}>
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            
            <div className={styles.mapColumn}>
              <div 
                className={styles.mapWrapper} 
                dangerouslySetInnerHTML={{ __html: data.contact.map }} 
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            <p dangerouslySetInnerHTML={{ __html: copyright }} />
          </div>
          
          <div className={styles.socialLinks}>
            <Link href="https://instagram.com" className={styles.socialIcon} aria-label="Instagram">
               <Image src="/assets/icons/social/instagram.svg" alt="Instagram" width={24} height={24} />
            </Link>
            <Link href="https://linkedin.com" className={styles.socialIcon} aria-label="LinkedIn">
               <Image src="/assets/icons/social/linkedin.svg" alt="LinkedIn" width={24} height={24} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
