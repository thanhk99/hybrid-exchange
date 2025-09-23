import './btn.css';
import React from 'react';

interface ButtonProps{
    size? : 'small' | 'medium' | 'large' ;
    background? : 'green' | 'red' | 'none' ;
    iconLeft? : React.ReactNode;
    iconRight? : React.ReactNode;
    children? : React.ReactNode;
    onClick? : () => void;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
  size = 'medium',
  background = 'green',
  iconLeft,
  iconRight,
  children,
  onClick,
  className = ''
}) => {
  return (
    <button
      className={`btn ${size} ${background} ${className}`}
      onClick={onClick}
    >
      {iconLeft && <span className="icon left">{iconLeft}</span>}
      {children && <span className="label">{children}</span>}
      {iconRight && <span className="icon right">{iconRight}</span>}
    </button>
  );
};

export default Button;