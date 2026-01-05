import { useState } from 'react';
import { FaSpinner } from "react-icons/fa";
import { Transaction } from "@/src/services/wallet";
import FilterButtons from "../FilterButtons/FilterButtons";
import EmptyState from "../EmptyState/EmptyState";
import Pagination from "../Pagination/Pagination";
import TransactionRow from "./components/TransactionRow";
import styles from './TransactionHistory.module.css';

interface TransactionHistoryProps {
    transactions: Transaction[];
    isLoading: boolean;
    filter: string;
    onFilterChange: (filter: string) => void;
    filterOptions: Array<{ value: string; label: string }>;
}

export default function TransactionHistory({
    transactions,
    isLoading,
    filter,
    onFilterChange,
    filterOptions
}: TransactionHistoryProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Calculate pagination
    const totalPages = Math.ceil(transactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTransactions = transactions.slice(startIndex, startIndex + itemsPerPage);

    // Reset to page 1 when filter changes
    const handleFilterChange = (newFilter: string) => {
        setCurrentPage(1);
        onFilterChange(newFilter);
    };

    return (
        <div className={styles.historySection}>
            <div className={styles.historyHeader}>
                <h3 className={styles.historyTitle}>Lịch sử giao dịch</h3>
                <FilterButtons
                    options={filterOptions}
                    activeFilter={filter}
                    onChange={handleFilterChange}
                />
            </div>

            {isLoading ? (
                <div className={styles.loading}>
                    <FaSpinner className={styles.spin} />
                </div>
            ) : transactions.length === 0 ? (
                <EmptyState
                    icon={<div style={{ background: '#1e2329', padding: '16px', borderRadius: '50%', display: 'inline-flex' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#5E6673" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7 7H17" stroke="#5E6673" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7 12H17" stroke="#5E6673" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7 17H12" stroke="#5E6673" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>}
                    title="Chưa có giao dịch nào"
                    message="Các giao dịch nạp tiền gần đây của bạn sẽ xuất hiện tại đây."
                />
            ) : (
                <>
                    <div className={styles.historyTable}>
                        {paginatedTransactions.map((tx) => (
                            <TransactionRow key={tx.id} transaction={tx} styles={styles} />
                        ))}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={transactions.length}
                    />
                </>
            )}

            <div className={styles.historyFooter}>
                <a href="/assets/history" className={styles.viewAllLink}>
                    Xem tắt cả lịch sử →
                </a>
            </div>
        </div>
    );
}
