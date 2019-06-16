import React from 'react';
import styles from './index.module.less';

export default function Sidebar({ alldata }) {
  return (
    <div className={styles.sidebar}>
      {alldata && (
        <ul className={styles.ulsidebar}>
          {alldata.map(item => (
            <li
              key={item.title}
              className={`${styles.sidebaritem} ${item.current &&
                styles.current} ${item.botstatus && styles.botstatus}`}
            >
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
