"use client";
import React, { useState, useEffect } from "react";
import "./Footer.css";

const footerSections = [
  {
    subSections: [
      {
        title: "Giới thiệu về SBCB",
        items: [
          "Về SBCB",
          "Thông báo về Quyền riêng tư của Ứng viên",
          "Cơ hội nghề nghiệp",
          "Liên hệ với chúng tôi",
          "Điều khoản dịch vụ",
          "Thông báo Bảo mật",
          "Công khai thông tin",
          "Thông báo của người tố giác hành vi hối lộ",
          "Thực thi pháp luật",
          "Ứng dụng SBCB",
        ],
      },
    ],
  },
  {
    subSections: [
      {
        title: "Sản phẩm",
        items: [
          "Mua tiền mã hóa",
          "Giao dịch P2P",
          "Chuyển đổi",
          "Giao dịch",
          "Kiếm tiền",
          "OKC",
          "Bot giao dịch",
          "Tất cả tiền mã hóa",
          "Học viện",
          "TradingView",
          "xBTC",
        ],
      },
    ],
  },
  {
    subSections: [
      {
        title: "Dịch vụ",
        items: [
          "Đối tác",
          "API",
          "Dữ liệu lịch sử thị trường",
          "Biểu phí CEX",
          "Ứng dụng niêm yết",
          "Đơn đăng ký thương nhân P2P",
        ],
      },
      {
        title: "Hỗ trợ",
        items: [
          "Trung tâm hỗ trợ",
          "Xác minh chính thức",
          "Thông báo",
          "Kết nối với SBCB",
        ],
      },
    ],
  },
  {
    subSections: [
      {
        title: "Mua tiền mã hóa",
        items: [
          "Mua USDT",
          "Mua USDC",
          "Mua Bitcoin",
          "Mua Ethereum",
          "Mua ADA",
          "Mua Solana",
          "Mua Litecoin",
          "Mua XRP",
        ],
      },
      {
        title: "Công cụ tính tiền mã hóa",
        items: [
          "BTC sang VND",
          "ETH sang VND",
          "USDT sang VND",
          "SOL sang VND",
          "XRP sang VND",
        ],
      },
    ],
  },
  {
    subSections: [
      {
        title: "Giao dịch",
        items: [
          "BTC USDC",
          "ETH USDC",
          "BTC USDT",
          "ETH USDT",
          "LTC USDT",
          "SOL USDT",
          "XRP USDT",
          "Giá Bitcoin",
          "Giá Ethereum",
          "Giá Cardano",
          "Giá Solana",
          "Giá XRP",
          "Dự đoán giá Bitcoin",
          "Dự đoán giá Ethereum",
          "Dự đoán giá XRP",
          "Cách mua crypto",
          "Cách mua Bitcoin",
        ],
      },
    ],
  },
];

const Footer: React.FC = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    // Khởi tạo trạng thái open cho từng group
    const initialSections = footerSections.map((section) => ({
      ...section,
      subSections: section.subSections.map((sub) => ({
        ...sub,
        open: window.innerWidth > 768,
      })),
    }));
    setSections(initialSections);
    setIsDesktop(window.innerWidth > 768);

    const handleResize = () => {
      const desktop = window.innerWidth > 768;
      setIsDesktop(desktop);
      setSections((prev) =>
        prev.map((section) => ({
          ...section,
          subSections: section.subSections.map((sub: any) => ({
            ...sub,
            open: desktop,
          })),
        }))
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleGroup = (sectionIdx: number, groupIdx: number) => {
    if (isDesktop) return;
    setSections((prev) =>
      prev.map((section, sIdx) =>
        sIdx !== sectionIdx
          ? section
          : {
              ...section,
              subSections: section.subSections.map((sub: any, gIdx: number) =>
                gIdx !== groupIdx ? sub : { ...sub, open: !sub.open }
              ),
            }
      )
    );
  };

  return (
    <div className="footer">
      <div className="footer-container">
        {sections.map((section, sectionIdx) =>
          section.subSections.map((group: any, groupIdx: number) => (
            <div className="footer-column" key={group.title}>
              <div
                className="footer-header"
                onClick={() => toggleGroup(sectionIdx, groupIdx)}
              >
                <h3>{group.title}</h3>
                <span className={`arrow${group.open ? " open" : ""}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path
                      fill="#ffffff"
                      d="M297.4 470.6C309.9 483.1 330.2 483.1 342.7 470.6L534.7 278.6C547.2 266.1 547.2 245.8 534.7 233.3C522.2 220.8 501.9 220.8 489.4 233.3L320 402.7L150.6 233.4C138.1 220.9 117.8 220.9 105.3 233.4C92.8 245.9 92.8 266.2 105.3 278.7L297.3 470.7z"
                    />
                  </svg>
                </span>
              </div>
              <ul className={group.open || isDesktop ? "show" : ""}>
                {group.items.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Footer;
