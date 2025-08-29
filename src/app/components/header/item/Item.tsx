import { useRef, useState } from "react";

import "./Item.css";

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
  className?: string;
  onClick: () => void;
  headerContent? : React.ReactNode;
}

const HeaderItem = ({ label, childrens, className, icon, headerContent}: IProps) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowMenu(false);
    }, 600);
  };

  return (
    <div
      className={`header-item ${className}`}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div className="item">
        <div className="label">
          <p>{label}</p>
        </div>
        <div className="item-icon">{icon}</div>
      </div>

      {showMenu && (
        <div className="childrens">
          {headerContent && <div className="dropdown-header">{headerContent}</div>} 
          
          {childrens?.map((i, key) => (
            <div className="childrens-container" key={key} onClick={i.onClick}>
              <div className="childrens-containerleft">{i.icon}</div>
              <div className="childrens-containerright">
                <div className="container-label">{i.label}</div>
                <div className="container-content">{i.content}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeaderItem;
