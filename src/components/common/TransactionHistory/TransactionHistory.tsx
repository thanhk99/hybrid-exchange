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
                <EmptyState message="Chưa có giao dịch nào" />
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
        </div>
    );
}
