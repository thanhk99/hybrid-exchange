'use client';

import React from 'react';
import styles from './P2PGuide.module.css';

const P2PGuide: React.FC = () => {
  return (
    <div className={styles.guideContainer}>
      <h3 className={styles.guideTitle}>Cách mua USDT bằng VND thông qua Giao dịch Nhanh P2P</h3>
      
      <div className={styles.guideContent}>
        <p className={styles.guideDescription}>
          Giao dịch Nhanh P2P là cách nhanh nhất và dễ nhất để mua và bán tiền mã hóa với giá tốt nhất. 
          Bạn có thể giao dịch trực tiếp với người dùng khác mà không cần qua sàn giao dịch trung gian.
        </p>
        
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h4>Chọn loại giao dịch</h4>
              <p>Chọn "Mua" để mua USDT hoặc "Bán" để bán USDT</p>
            </div>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h4>Nhập số tiền</h4>
              <p>Nhập số tiền VND bạn muốn thanh toán hoặc số USDT bạn muốn nhận</p>
            </div>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h4>Chọn phương thức thanh toán</h4>
              <p>Chọn phương thức thanh toán phù hợp như ngân hàng, MoMo, ZaloPay</p>
            </div>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h4>Hoàn tất giao dịch</h4>
              <p>Thực hiện thanh toán và xác nhận để hoàn tất giao dịch</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default P2PGuide;