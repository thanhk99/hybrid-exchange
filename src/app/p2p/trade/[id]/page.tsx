'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeftOutlined, SendOutlined, UploadOutlined, WarningOutlined } from '@ant-design/icons';
import P2PHeader from '@/src/components/P2P/P2PHeader/P2PHeader';
import CountdownTimer from '@/src/components/P2P/CountdownTimer/CountdownTimer';
import StatusBadge from '@/src/components/P2P/StatusBadge/StatusBadge';
import UserRating from '@/src/components/P2P/UserRating/UserRating';
import PaymentMethodBadge from '@/src/components/P2P/PaymentMethodBadge/PaymentMethodBadge';
import { P2PTrade, TradeMessage } from '@/src/types/p2p';
import P2PService from '@/src/services/p2p';
import styles from './page.module.css';

export default function TradeDetail() {
    const router = useRouter();
    const params = useParams();
    const tradeId = params.id as string;

    const [trade, setTrade] = useState<P2PTrade | null>(null);
    const [messages, setMessages] = useState<TradeMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);

    useEffect(() => {
        loadTradeData();
    }, [tradeId]);

    const loadTradeData = async () => {
        try {
            const [tradeData, messagesData] = await Promise.all([
                P2PService.getTrade(tradeId),
                P2PService.getTradeMessages(tradeId)
            ]);
            setTrade(tradeData);
            setMessages(messagesData);
        } catch (error) {
            console.error('Failed to load trade:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const message = await P2PService.sendTradeMessage(tradeId, newMessage);
            setMessages([...messages, message]);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleConfirmPayment = async () => {
        if (!paymentProof) {
            alert('Vui lòng tải lên bằng chứng thanh toán');
            return;
        }

        try {
            // In real app, upload file first
            const proofUrl = 'https://example.com/proof.jpg';
            await P2PService.confirmPayment(tradeId, proofUrl);
            alert('Đã xác nhận thanh toán!');
            loadTradeData();
        } catch (error) {
            console.error('Failed to confirm payment:', error);
        }
    };

    const handleReleaseCrypto = async () => {
        if (!confirm('Bạn có chắc chắn muốn giải phóng tiền điện tử?')) return;

        try {
            await P2PService.releaseCrypto(tradeId);
            alert('Đã giải phóng tiền điện tử!');
            loadTradeData();
        } catch (error) {
            console.error('Failed to release crypto:', error);
        }
    };

    const handleCancelTrade = async () => {
        const reason = prompt('Lý do hủy giao dịch:');
        if (!reason) return;

        try {
            await P2PService.cancelTrade(tradeId, reason);
            alert('Đã hủy giao dịch!');
            router.push('/p2p');
        } catch (error) {
            console.error('Failed to cancel trade:', error);
        }
    };

    const formatAmount = (num: number) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Đang tải...</p>
            </div>
        );
    }

    if (!trade) {
        return (
            <div className={styles.error}>
                <p>Không tìm thấy giao dịch</p>
            </div>
        );
    }

    const isBuyer = trade.buyerId === 'current_user';
    const counterparty = isBuyer ? trade.sellerName : trade.buyerName;

    return (
        <div className={styles.container}>
            <P2PHeader
                title={`Giao dịch #${trade.id.slice(0, 8)}`}
                subtitle={`${isBuyer ? 'Mua' : 'Bán'} ${trade.order.currency}`}
                actions={
                    <button
                        className={styles.backButton}
                        onClick={() => router.push('/p2p')}
                    >
                        <ArrowLeftOutlined /> Quay lại
                    </button>
                }
            />

            <div className={styles.content}>
                <div className={styles.mainColumn}>
                    {/* Trade Info */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>Thông tin giao dịch</h3>
                            <div className={styles.statusRow}>
                                <StatusBadge status={trade.status} />
                                <CountdownTimer expiresAt={trade.expiresAt} />
                            </div>
                        </div>

                        <div className={styles.tradeInfo}>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Số lượng</span>
                                <span className={styles.infoValue}>
                                    {formatAmount(trade.cryptoAmount)} {trade.order.currency}
                                </span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Đơn giá</span>
                                <span className={styles.infoValue}>
                                    {formatAmount(trade.order.price)} {trade.order.fiatCurrency}
                                </span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Tổng tiền</span>
                                <span className={styles.infoValueHighlight}>
                                    {formatAmount(trade.totalPrice)} {trade.order.fiatCurrency}
                                </span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Phương thức thanh toán</span>
                                <PaymentMethodBadge method={trade.paymentMethod} />
                            </div>
                        </div>
                    </div>

                    {/* Payment Instructions */}
                    {isBuyer && trade.status === 'pending' && (
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>Thông tin thanh toán</h3>
                            <div className={styles.paymentInfo}>
                                <div className={styles.paymentRow}>
                                    <span className={styles.paymentLabel}>Tên tài khoản</span>
                                    <span className={styles.paymentValue}>
                                        {trade.paymentMethod.accountName}
                                    </span>
                                </div>
                                <div className={styles.paymentRow}>
                                    <span className={styles.paymentLabel}>Số tài khoản</span>
                                    <span className={styles.paymentValue}>
                                        {trade.paymentMethod.accountNumber}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.uploadSection}>
                                <label className={styles.uploadLabel}>
                                    Tải lên bằng chứng thanh toán
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                                    className={styles.fileInput}
                                />
                                {paymentProof && (
                                    <p className={styles.fileName}>{paymentProof.name}</p>
                                )}
                            </div>

                            <button
                                className={styles.confirmButton}
                                onClick={handleConfirmPayment}
                                disabled={!paymentProof}
                            >
                                <UploadOutlined /> Xác nhận đã thanh toán
                            </button>
                        </div>
                    )}

                    {/* Seller Actions */}
                    {!isBuyer && trade.status === 'paid' && (
                        <div className={styles.card}>
                            <div className={styles.warningBox}>
                                <WarningOutlined className={styles.warningIcon} />
                                <div>
                                    <p><strong>Vui lòng kiểm tra thanh toán</strong></p>
                                    <p>Đảm bảo bạn đã nhận đủ số tiền trước khi giải phóng tiền điện tử</p>
                                </div>
                            </div>
                            <button
                                className={styles.releaseButton}
                                onClick={handleReleaseCrypto}
                            >
                                Giải phóng {trade.order.currency}
                            </button>
                        </div>
                    )}

                    {/* Actions */}
                    <div className={styles.actions}>
                        <button
                            className={styles.cancelButton}
                            onClick={handleCancelTrade}
                        >
                            Hủy giao dịch
                        </button>
                    </div>
                </div>

                <div className={styles.sideColumn}>
                    {/* Counterparty Info */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>
                            {isBuyer ? 'Người bán' : 'Người mua'}
                        </h3>
                        <div className={styles.userInfo}>
                            <div className={styles.userName}>{counterparty}</div>
                            <UserRating
                                rating={trade.order.merchantRating}
                                completedTrades={trade.order.merchantCompletedTrades}
                                completionRate={trade.order.merchantCompletionRate}
                                size="small"
                            />
                        </div>
                    </div>

                    {/* Chat */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Trò chuyện</h3>
                        <div className={styles.chatContainer}>
                            <div className={styles.messages}>
                                {messages.map(msg => (
                                    <div
                                        key={msg.id}
                                        className={`${styles.message} ${msg.isSystem
                                                ? styles.messageSystem
                                                : msg.senderId === 'current_user'
                                                    ? styles.messageOwn
                                                    : styles.messageOther
                                            }`}
                                    >
                                        {!msg.isSystem && (
                                            <div className={styles.messageSender}>
                                                {msg.senderName}
                                            </div>
                                        )}
                                        <div className={styles.messageContent}>
                                            {msg.message}
                                        </div>
                                        <div className={styles.messageTime}>
                                            {new Date(msg.timestamp).toLocaleTimeString('vi-VN')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.chatInput}>
                                <input
                                    type="text"
                                    placeholder="Nhập tin nhắn..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className={styles.input}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className={styles.sendButton}
                                    disabled={!newMessage.trim()}
                                >
                                    <SendOutlined />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
