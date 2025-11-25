import React from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styles from './Pagination.module.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage: number;
    totalItems: number;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    totalItems
}: PaginationProps) {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className={styles.pagination}>
            <div className={styles.pageInfo}>
                Hiển thị {startItem}-{endItem} / {totalItems}
            </div>
            <div className={styles.pageButtons}>
                <button
                    className={`${styles.pageButton} ${currentPage === 1 ? styles.pageButtonDisabled : ''}`}
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                >
                    <LeftOutlined /> Trước
                </button>
                <span className={styles.pageNumber}>
                    Trang {currentPage} / {totalPages}
                </span>
                <button
                    className={`${styles.pageButton} ${currentPage === totalPages ? styles.pageButtonDisabled : ''}`}
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                >
                    Sau <RightOutlined />
                </button>
            </div>
        </div>
    );
}
