'use client';
import React, { useState, useRef, useEffect } from 'react';
import styles from './TopMenuList.module.css';

interface MenuItem {
  title: string;
  onClick: () => void;
}

interface TopMenuListProps {
  menuItems: MenuItem[];
  defaultActive?: number;
}

const TopMenuList: React.FC<TopMenuListProps> = ({ 
  menuItems, 
  defaultActive = 1
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultActive);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (index: number, onClick: () => void) => {
    setActiveIndex(index);
    setIsMenuOpen(false);
    onClick();
  };

  return (
    <div className={styles.navContainer}>
      {/* Desktop Menu */}
      <nav className={styles.nav}>
        <ul className={styles.list}>
          {menuItems.map((item, index) => (
            <li 
              key={index}
              className={`${styles.item} ${activeIndex === index ? styles.active : ''}`}
              onClick={() => handleItemClick(index, item.onClick)}
            >
              {item.title}
            </li>
          ))}
        </ul>

        {/* Hamburger Button */}
        <button 
          ref={buttonRef}
          className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div 
        ref={menuRef}
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.show : ''}`}
      >
        <div className={styles.mobileHeader}>
          <span>Menu</span>
          <button 
            className={styles.closeButton}
            onClick={() => setIsMenuOpen(false)}
          >
            ×
          </button>
        </div>
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`${styles.mobileItem} ${activeIndex === index ? styles.active : ''}`}
            onClick={() => handleItemClick(index, item.onClick)}
          >
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopMenuList;