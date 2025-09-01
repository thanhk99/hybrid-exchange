import React, { useEffect, useRef, useState } from "react";
import "./Btn.css";

export interface BtnDropdownItem {
  label?: string;
  icon?: React.ReactNode;
  iconright?: React.ReactNode;
  onClick?: () => void;
}

interface BtnDropdownProps {
  label?: string;
  iconleft?: React.ReactNode;
  iconright?: React.ReactNode;
  items?: BtnDropdownItem[];
  className?: string;
  onClick?: () => void;
  onSelect?: (value: string) => void;
}

const ButtonDropdown = ({
  label,
  iconleft,
  iconright,
  items,
  className,
  onSelect
}: BtnDropdownProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(label || "");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = items?.filter((i) =>
    i.label?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className={`btn ${className}`}>
      <div className="btn-item" onClick={() => setOpen(!open)}>
        <div className="item-iconleft">{iconleft}</div>
        <div className="item-label">{selected}</div>
        <div className={`item-iconright ${open ? "rotate" : ""}`}>{iconright}</div>
      </div>

      {open && (
        <div className="btn-children">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={search}
              className="btn-input"
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {filtered?.map((i, key) => (
            <div
              className="btnchild-container"
              key={key}
              onClick={() => {
                setSelected(i.label || "");
                i.onClick?.();
                setOpen(false);
                if (i.label) {
                  onSelect?.(i.label);  
                }
              }}
            >
              <div className="child-left">{i.icon}</div>
              <div className="child-right">{i.label}</div>
              {i.label === selected && (
                <div className="child-check">✔</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ButtonDropdown;