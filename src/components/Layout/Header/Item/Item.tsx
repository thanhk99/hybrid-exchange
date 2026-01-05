import { useRef, useState } from "react";
import styles from "./Item.module.css";

export interface IChildrenItem {
  label?: string;
  icon?: React.ReactNode;
  content?: string;
  onClick: () => void;
}

interface IProps {
  label: string;
  icon?: React.ReactNode;
  childrens?: IChildrenItem[];
  onClick: () => void;
  headerContent?: React.ReactNode;
  trigger?: "hover" | "click";
  mobile?: boolean;
  align?: "left" | "right";
}

const HeaderItem = ({
  label,
  childrens,
  icon,
  headerContent,
  trigger = "hover",
  mobile = false,
  align = "left"
}: IProps) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (trigger === "hover" && !mobile) {
      setShowMenu(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === "hover" && !mobile) {
      timeoutRef.current = setTimeout(() => {
        setShowMenu(false);
      }, 300);
    }
  };

  const handleClick = () => {
    if (trigger === "click" || mobile) {
      setShowMenu((prev) => !prev);
    }
  };

  return (
    <div
      className={`${styles.headerItem} ${mobile ? styles.mobile : ''}`}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div className={styles.item} onClick={handleClick}>
        <div className={styles.label}>
          <p>{label}</p>
        </div>
        {icon && <div className={styles.itemIcon}>{icon}</div>}
      </div>

      {showMenu && (
        <div className={`${styles.childrens} ${showMenu ? styles.active : ''} ${mobile ? styles.mobileChildrens : ''} ${styles[align] || ''}`}>
          {headerContent && <div className={styles.dropdownHeader}>{headerContent}</div>}

          {childrens?.map((i, key) => (
            <div className={styles.childrensContainer} key={key} onClick={i.onClick}>
              {i.icon && <div className={styles.childrensContainerLeft}>{i.icon}</div>}
              <div className={styles.childrensContainerRight}>
                <div className={styles.containerLabel}>{i.label}</div>
                {i.content && <div className={styles.containerContent}>{i.content}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeaderItem;