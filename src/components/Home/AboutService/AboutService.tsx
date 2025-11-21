// components/CompanyServices.tsx
'use client';

import { 
  TeamOutlined, 
  BulbOutlined, 
  BarChartOutlined, 
  BankOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import styles from './AboutService.module.css';

const CompanyServices = () => {
  const services = [
    {
      icon: <TeamOutlined />,
      title: 'Môi giới',
      description: 'Dịch vụ môi giới chứng khoán chuyên nghiệp với đội ngũ chuyên gia giàu kinh nghiệm',
      features: ['Giao dịch nhanh chóng', 'Phí môi giới cạnh tranh', 'Hỗ trợ 24/7'],
      color: '#667eea'
    },
    {
      icon: <BulbOutlined />,
      title: 'Tư vấn đầu tư',
      description: 'Chiến lược đầu tư tối ưu được thiết kế riêng theo nhu cầu và mục tiêu của bạn',
      features: ['Phân tích danh mục', 'Đề xuất đầu tư', 'Theo dõi hiệu suất'],
      color: '#10b981'
    },
    {
      icon: <BarChartOutlined />,
      title: 'Phân tích',
      description: 'Báo cáo phân tích thị trường chuyên sâu và dự báo xu hướng từ các chuyên gia',
      features: ['Phân tích kỹ thuật', 'Phân tích cơ bản', 'Báo cáo định kỳ'],
      color: '#f59e0b'
    },
    {
      icon: <BankOutlined />,
      title: 'Tư vấn tài chính doanh nghiệp',
      description: 'Giải pháp tài chính toàn diện cho doanh nghiệp từ vốn đến quản lý rủi ro',
      features: ['Huy động vốn', 'Quản lý dòng tiền', 'Tối ưu thuế'],
      color: '#ef4444'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Hoạt Động Dịch Vụ Của Công Ty</h2>
        <p className={styles.subtitle}>
          Cung cấp các giải pháp tài chính toàn diện và chuyên nghiệp 
          cho cả nhà đầu tư cá nhân và doanh nghiệp
        </p>
      </div>

      <div className={styles.servicesGrid}>
        {services.map((service, index) => (
          <div 
            key={index} 
            className={styles.serviceCard}
            style={{ '--accent-color': service.color } as React.CSSProperties}
          >
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                {service.icon}
              </div>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
            </div>
            
            <p className={styles.serviceDescription}>{service.description}</p>
            
            <div className={styles.features}>
              {service.features.map((feature, featureIndex) => (
                <div key={featureIndex} className={styles.feature}>
                  <div className={styles.featureDot}></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button className={styles.learnMoreButton}>
              <span>Tìm hiểu thêm</span>
              <ArrowRightOutlined />
            </button>
          </div>
        ))}
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>15+</div>
          <div className={styles.statLabel}>Năm kinh nghiệm</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>50K+</div>
          <div className={styles.statLabel}>Khách hàng</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>$10B+</div>
          <div className={styles.statLabel}>Tài sản quản lý</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>99%</div>
          <div className={styles.statLabel}>Khách hàng hài lòng</div>
        </div>
      </div>
    </div>
  );
};

export default CompanyServices;