"use client";
import React, { useState } from "react";
import "./page.css";
import Chatbot from "./components/chatbot/chatbot";

export default function Home() {
    const [email, setEmail] = useState("");
    const [openIndex, setOpenIndex] = useState<number | null>(null);
  
    const [isPlaying, setIsPlaying] = useState(false);
  
    const handlePlay = () => {
      setIsPlaying(true);
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Email đăng ký: ${email}`);
    };
  
    const faqData = [
      {
        question: "Vix cung cấp những sản phẩm nào?",
        answer: `Vix là sàn giao dịch tiền mã hóa tiên phong cung cấp các dịch vụ tài chính đột phá.
  Chúng tôi mang đến dịch vụ giao dịch và earning cho hàng triệu người dùng trên toàn thế giới ở hơn 180 khu vực.
  
  Với Vix, bạn có thể:
  - Giao dịch nhiều loại token và cặp giao dịch.
  - Kết nối với Nền tảng TradingView nổi tiếng thế giới và giao dịch tiền mã hoá trực tiếp với các biểu đồ supercharged.`,
      },
      {
        question:
          "Làm sao để mua Bitcoin và cá c loại tiền mã hóa khác trên Vix?",
        answer: `Bạn có thể đăng ký tài khoản, xác minh danh tính và nạp tiền để mua bán Bitcoin cùng nhiều loại tiền mã hóa khác.`,
      },
      {
        question: "Tiền mã hóa là gì ?",
        answer: `Tiền mã hóa là một đồng tiền kỹ thuật số phi tập trung hoạt động trên công nghệ blockchain. Đặc điểm chính của tiền mã hóa bao gồm tính minh bạch, giao dịch không biên giới và tính bất biến. Một số tiền mã hóa phổ biến nhất theo vốn hóa thị trường, bao gồm Bitcoin, Ethereum, Tether, có thể được giao dịch trên Vix.`,
      },
    ];
  
    const toggleFAQ = (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
    };
  
  return (
    <div className="container">
      {/* <div className="top-bar">
        <h1>SECURE BLOCKCHAIN CAPITAL BANK</h1>
        <p>
          Vix là một trong những sàn giao dịch tiền mã hoá hàng đầu thế giới,
          cung cấp nền tảng mua bán, giao dịch spot, futures, staking và DeFi
          với công nghệ tiên tiến. Với giao diện thân thiện, tính bảo mật cao và
          phí giao dịch cạnh tranh, Vix phù hợp cho cả người mới lẫn nhà đầu tư
          chuyên nghiệp, mang đến trải nghiệm giao dịch nhanh chóng, an toàn và
          đa dạng sản phẩm tài chính số.
        </p>
      </div> */}

      <div className="content1">
        <div className="left-content1">
          <h1>Trải nghiệm ứng dụng crypto toàn diện tại Việt Nam</h1>
          <div className="description">
            <div>
              <button className="started-btn">Bắt đầu giao dịch</button>
            </div>
            <div>
              <button className="started-btn">Dùng thử Vix</button>
            </div>
          </div>
          {/* <div className="sponsors">
            <img src="/imgs/logo3.png" alt="logo3" />
            <img src="/imgs/logo2.png" alt="logo2" />
            <img src="/imgs/logo1.png" alt="logo1" />
          </div> */}
        </div>
        <div className="phone-image">
          <video
            className="first-img"
            style={{ visibility: "visible" }}
            autoPlay
            loop
            muted
            playsInline
            width={280}
            height={580}
            aria-label="Ảnh minh họa app OKX"
            role="img"
            poster="https://www.okx.com/cdn/assets/imgs/258/CD17373D221B990B.png?x-oss-process=image/format,webp/ignore-error,1"
          >
            <source
              src="https://www.okx.com/cdn/assets/files/258/EE47D9F39F18508F.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>

      <div className="content2">
        <h1>Giao dịch như một chuyên gia</h1>
        <p>
          Nhận mức phí thấp nhất, giao dịch nhanh nhất, API mạnh mẽ và nhiều hơn
          nữa
        </p>
        <div className="trade-image">
          {/* <iframe
            src="https://www.youtube.com/embed/EEX0EHTTePE?autoplay=1&mute=1&loop=1&playlist=EEX0EHTTePE&controls=0&showinfo=0&modestbranding=1"
            title="Trade Video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
          ></iframe> */}
          <video autoPlay loop muted playsInline>
            <source src="/imgs/mid.mov" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* <div className="content4">
        <h1>How to trade like a pro</h1>
        <video autoPlay loop muted playsInline>
            <source src="/imgs/mid.mov" type="video/mp4"/>
        </video>  
      </div> */}

      <div className="content3">
        <h1>Đồng hành cùng bạn trên mọi bước đường</h1>
        <p>
          Từ việc thực hiện giao dịch tiền mã hóa đầu tiên đến việc trở thành một
          nhà giao dịch dày dạn kinh nghiệm, bạn sẽ có chúng tôi hướng dẫn bạn
          trong suốt quá trình. Không có câu hỏi nào là quá nhỏ. Không còn những
          đêm mất ngủ. Hãy tự tin vào tiền mã hóa của bạn.
        </p>
        <div className="evolution-image">
          <video
            className="second-img"
            style={{ visibility: "visible" }}
            autoPlay
            loop
            muted
            playsInline
            width={1080}
            height={260}
            aria-label="Ảnh minh họa app OKX"
            role="img"
            poster="https://www.okx.com/cdn/assets/imgs/2210/2763D233C494439D.jpg?x-oss-process=image/format,webp/ignore-error,1"
          >
            <source
              src="https://www.okx.com/cdn/assets/files/2210/D47D930F643E7A00.webm"
              type="video/webm"
            />
          </video>
        </div>
      </div>

      <div className="content5">
        {/* <div className="text-section">
          <h1>Vix là gì ?</h1>
          <p>
            Tìm hiểu lý do vì sao app tiền mã hóa này được đối tác toàn cầu yêu
            thích
          </p>
        </div> */}
        <video controls muted playsInline onPlay={handlePlay}>
          <source src="/imgs/end.mov" type="video/mp4" />
        </video>

        {/* overlay text */}
        {!isPlaying && (
          <div className="overlay-text">
            <h2>Tái định nghĩa hệ thống</h2>
            <h2>Chào mừng đến Web3</h2>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="faq-container">
        <h1>Bạn có câu hỏi? Chúng tôi có câu trả lời.</h1>
        {faqData.map((item, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <span>{item.question}</span>
              <button className="toggle-btn">
                {openIndex === index ? "−" : "+"}
              </button>
            </div>
            {openIndex === index && (
              <div className="faq-answer">
                <p style={{ whiteSpace: "pre-line" }}>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <Chatbot />
    </div>
  );
}
