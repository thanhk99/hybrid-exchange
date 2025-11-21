'use client';

import { 
  RocketOutlined, 
  SafetyCertificateOutlined, 
  GiftOutlined, 
  StarOutlined,
  PlayCircleOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import styles from './AccountPromotion.module.css';
import { useRouter } from 'next/navigation';
import TokenService from '@/src/services/token';


function AccountPromotion(){
  const features = [
    {
      icon: <RocketOutlined />,
      title: 'Giao dịch nhanh chóng',
      description: 'Tốc độ xử lý chỉ 0.1 giây'
    },
    {
      icon: <SafetyCertificateOutlined />,
      title: 'Bảo mật tuyệt đối',
      description: 'Đa lớp bảo mật tiên tiến'
    },
    {
      icon: <GiftOutlined />,
      title: 'Quà tặng hấp dẫn',
      description: 'Nhận ngay $10 khi đăng ký'
    },
    {
      icon: <StarOutlined />,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ chuyên gia luôn sẵn sàng'
    }
  ];

  const router = useRouter();
  const handleDemoAccount = () => {
    router.push("/register")
  };

  const handleStartTrading = () => {
    if(TokenService.isLogin()){
      router.push("/spot")
    }else{
      router.push("/login")
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.gradientOverlay}></div>
        <div className={styles.particles}>
          {[...Array(20)].map((_, i) => (
            <div key={i} className={styles.particle}></div>
          ))}
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.textSection}>
          <div className={styles.badge}>
            <span>🎯 SÀN GIAO DỊCH SỐ 1 VIỆT NAM</span>
          </div>
          
          <h1 className={styles.title}>
            Bắt Đầu Hành Trình
            <span className={styles.highlight}> Giao Dịch Crypto</span>
            Của Bạn
          </h1>
          
          <p className={styles.description}>
            Tham gia cộng đồng hơn 2 triệu nhà giao dịch trên nền tảng an toàn và 
            chuyên nghiệp nhất. Trải nghiệm công nghệ hiện đại với phí giao dịch 
            thấp nhất thị trường.
          </p>

          <div className={styles.features}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  {feature.icon}
                </div>
                <div className={styles.featureText}>
                  <div className={styles.featureTitle}>{feature.title}</div>
                  <div className={styles.featureDesc}>{feature.description}</div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.buttons}>
            <button 
              className={styles.demoButton}
              onClick={handleDemoAccount}
            >
              <PlayCircleOutlined />
              <span>Mở tài khoản Demo</span>
              <div className={styles.buttonGlow}></div>
            </button>
            
            <button 
              className={styles.tradingButton}
              onClick={handleStartTrading}
            >
              <span>Bắt đầu giao dịch</span>
              <ArrowRightOutlined />
              <div className={styles.buttonGlow}></div>
            </button>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>2M+</div>
              <div className={styles.statLabel}>Người dùng</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>$50B+</div>
              <div className={styles.statLabel}>Khối lượng giao dịch</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>99.9%</div>
              <div className={styles.statLabel}>Uptime</div>
            </div>
          </div>
        </div>

        <div className={styles.visualSection}>
          <div className={styles.cardStack}>
            <div className={styles.card1}>
              <div className={styles.cardContent}>
                <div className={styles.cardIcon}>📈</div>
                <div className={styles.cardText}>
                  <div className={styles.cardTitle}>Tài khoản Demo</div>
                  <div className={styles.cardDesc}>$10,000 ảo để thực hành</div>
                </div>
              </div>
            </div>
            <div className={styles.card2}>
              <div className={styles.cardContent}>
                <div className={styles.cardIcon}>💰</div>
                <div className={styles.cardText}>
                  <div className={styles.cardTitle}>Thưởng đăng ký</div>
                  <div className={styles.cardDesc}>Nhận ngay $10 tiền thật</div>
                </div>
              </div>
            </div>
            <div className={styles.card3}>
              <div className={styles.cardContent}>
                <div className={styles.cardIcon}>⚡</div>
                <div className={styles.cardText}>
                  <div className={styles.cardTitle}>Giao dịch ngay</div>
                  <div className={styles.cardDesc}>Xác minh trong 5 phút</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPromotion;