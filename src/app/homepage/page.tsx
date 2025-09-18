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
          <img src="/imgs/phone.png" alt="phone" />
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
          <img src="/imgs/evolution.png" alt="evolution" />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
