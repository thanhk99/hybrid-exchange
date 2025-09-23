"use client";
import React, { useState } from "react";
import "./page.css";

const Homepage: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý đăng ký email ở đây
    alert(`Email đăng ký: ${email}`);
  };

  return (
    <div className="container">
      <div className="content1">
        <div className="left-content1">
          <h1>Trải nghiệm ứng dụng crypto toàn diện tại Việt Nam</h1>
          <form className="input-group" onSubmit={handleSubmit}>
            <input
              type="email"
              className="form-input"
              placeholder="Địa chỉ email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </form>
          <div className="sponsors">
            <img src="/imgs/logo3.png" alt="logo3" />
            <img src="/imgs/logo2.png" alt="logo2" />
            <img src="/imgs/logo1.png" alt="logo1" />
          </div>
        </div>
        <div className="phone-image">
          {/* <img src="/imgs/phone.png" alt="phone" /> */}
          <video className="first-img" style={{ visibility: "visible" }} title="" autoPlay loop muted playsInline width={280} height={580} aria-label="Ảnh minh họa app OKX" role="img" poster="https://www.okx.com/cdn/assets/imgs/258/CD17373D221B990B.png?x-oss-process=image/format,webp/ignore-error,1">
            <source src="https://www.okx.com/cdn/assets/files/258/EE47D9F39F18508F.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="content2">
        <h1>Trade like a pro</h1>
        <p>Get the lowest fees, fastest transations, powerful APIs, and more</p>
        <div className="trade-image">
          <iframe
            src="https://www.youtube.com/embed/EEX0EHTTePE?autoplay=1&mute=1&loop=1&playlist=EEX0EHTTePE&controls=0&showinfo=0&modestbranding=1"
            title="Trade Video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
          ></iframe>
        </div>
      </div>

      <div className="content3">
        <h1>With you every step of the way</h1>
        <p>
          From making your first crypto trade to becoming a seasoned trader,
          you'll have us to guide you through the process. No question is too
          small. No sleepless nights. Have confidence in your crypto.
        </p>
        <div className="evolution-image">
          {/* <img src="/imgs/evolution.png" alt="evolution" /> */}
          <video className="second-img" style={{ visibility: "visible" }} title="" autoPlay loop muted playsInline width={1080} height={260} aria-label="Ảnh minh họa app OKX" role="img" poster="https://www.okx.com/cdn/assets/imgs/2210/2763D233C494439D.jpg?x-oss-process=image/format,webp/ignore-error,1">
            <source src="https://www.okx.com/cdn/assets/files/2210/D47D930F643E7A00.webm" type="video/webm" />
          </video>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
