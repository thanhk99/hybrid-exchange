import FuturesTable from "@/src/components/Futures/FuturesTable";
import styles from './page.module.css';

export default function FuturesPage() {
    return (
        <div className={styles.container}>
            <FuturesTable />
        </div>
    );
}
