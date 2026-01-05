import styles from "./Header.module.css";
import { useRouter } from "next/navigation";

const HeaderLogo = () => {
    const router = useRouter();
    return (
        <div className={styles.logo} onClick={() => router.push("/")}>
            <img src="/imgs/Logo-VIX.svg" alt="logo" className={styles.logoImg} />
        </div>
    );
};

export default HeaderLogo;
