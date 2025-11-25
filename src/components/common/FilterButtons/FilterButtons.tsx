import React from 'react';
import styles from './FilterButtons.module.css';

interface FilterOption {
    value: string;
    label: string;
}

interface FilterButtonsProps {
    options: FilterOption[];
    activeFilter: string;
    onChange: (value: string) => void;
}

export default function FilterButtons({ options, activeFilter, onChange }: FilterButtonsProps) {
    return (
        <div className={styles.filterButtons}>
            {options.map((option) => (
                <button
                    key={option.value}
                    className={`${styles.filterButton} ${activeFilter === option.value ? styles.filterActive : ''}`}
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
