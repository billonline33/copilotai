"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.scss";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link
          href="/todo"
          className={`${styles.navLink} ${
            pathname === "/todo" ? styles.active : ""
          }`}
        >
          <span className={styles.icon}>📝</span>
          <span>To-Do List</span>
        </Link>

        <Link
          href="/math-practice"
          className={`${styles.navLink} ${
            pathname === "/math-practice" || pathname === "/" ? styles.active : ""
          }`}
        >
          <span className={styles.icon}>🔢</span>
          <span>Math Practice</span>
        </Link>
      </div>
    </nav>
  );
}
