"use client";
import React, { useState } from "react";
import "./chatbot.css";
import { OpenAIOutlined } from "@ant-design/icons";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="chatbot-container">
      {/* Nút mở/đóng */}
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <OpenAIOutlined />
        </button>
      )}

      {isOpen && (
        <div className={`chatbot-window ${isOpen ? "open" : "close"}`}>
          <div className="chatbot-header">
            <span>Trợ lý SBCB</span>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              −
            </button>
          </div>
          <div className="chatbot-body">
            <div className="chat-message bot">
              Xin chào 👋 Bạn cần trợ giúp? Tìm giải pháp nhanh từ các chủ đề
              phổ biến nhất, hoặc nhập câu hỏi của bạn nếu muốn hỏi điều gì
              khác.
            </div>
          </div>
          <div className="chatbot-footer">
            <input type="text" placeholder="Nhập tin nhắn của bạn..." />
            <button>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
