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
import { useUser } from '@/src/contexts/UserContext';
import { useNotifications } from '@/src/contexts/NotificationContext';
import styles from './page.module.css';

import { Notification as ToastNotification } from '@/src/components/common/Notification/Notification';
import { ConfirmModal } from '@/src/components/common/ConfirmModal/ConfirmModal';

export default function TradeDetail() {
    const router = useRouter();
    const params = useParams();
    const tradeId = params.id as string;
    const { user } = useUser();

    const [trade, setTrade] = useState<P2PTrade | null>(null);
    const [messages, setMessages] = useState<TradeMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [notification, setNotification] = useState({
        type: 'info' as 'success' | 'error' | 'info' | 'warning',
        message: '',
        isVisible: false
    });
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showReleaseModal, setShowReleaseModal] = useState(false);

    const { notifications } = useNotifications();

    const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
        setNotification({ type, message, isVisible: true });
    };

    const closeNotification = () => {
        setNotification(prev => ({ ...prev, isVisible: false }));
    };

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
            showNotification('error', 'Không thể tải thông tin giao dịch');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTradeData();
    }, [tradeId]);

    // Listen for real-time updates
    useEffect(() => {
        if (notifications.length > 0) {
            const latestNotification = notifications[0];
            console.log('Latest notification:', latestNotification);

            // Check if the notification relates to this trade
            // Convert IDs to strings for comparison to avoid type mismatches
            const notifTradeId = latestNotification.data?.tradeId?.toString();
            const notifOrderId = latestNotification.data?.orderId?.toString();
            const currentTradeId = tradeId.toString();

            console.log(`Checking match: TradeID=${currentTradeId}, NotifTradeID=${notifTradeId}, NotifOrderId=${notifOrderId}`);

            if (notifTradeId === currentTradeId || notifOrderId === currentTradeId) {
                console.log('Received update for this trade, reloading data...');
                loadTradeData();

                // Optional: Show a toast to inform user if it's a significant update
                // showNotification('info', 'Trạng thái giao dịch đã được cập nhật');
            }
        }
    }, [notifications, tradeId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const message = await P2PService.sendTradeMessage(tradeId, newMessage);
            setMessages([...messages, message]);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
            showNotification('error', 'Gửi tin nhắn thất bại');
        }
    };

    const handleConfirmPayment = async () => {
        try {
            await P2PService.confirmPayment(tradeId, '');
            showNotification('success', 'Đã xác nhận thanh toán!');
            // Reload trade data and messages to show updated status and system message
            await loadTradeData();
        } catch (error) {
            console.error('Failed to confirm payment:', error);
            showNotification('error', 'Xác nhận thanh toán thất bại. Vui lòng thử lại.');
        }
    };

    const handleReleaseCrypto = async () => {
        try {
            await P2PService.releaseCrypto(tradeId);
            showNotification('success', 'Đã giải phóng tiền điện tử!');
            loadTradeData();
        } catch (error) {
            console.error('Failed to release crypto:', error);
            showNotification('error', 'Giải phóng tiền thất bại. Vui lòng thử lại.');
        }
    };

    const handleCancelTrade = async () => {
        try {
            await P2PService.cancelTrade(tradeId, 'User cancelled');
            showNotification('success', 'Đã hủy giao dịch!');
            setTimeout(() => {
                router.push('/p2p');
            }, 1500);
        } catch (error: any) {
            console.error('Failed to cancel trade:', error);
            showNotification('error', error.message || 'Hủy giao dịch thất bại');
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

    // Determine if current user is the ad creator (Maker) or the matcher (Taker)
    const isMaker = user?.uid === trade.order.merchantId;

    // Determine if current user is buyer
    // - If Maker and order type is 'buy' → User is Buyer
    // - If Maker and order type is 'sell' → User is Seller
    // - If Taker and order type is 'buy' → User is Seller
    // - If Taker and order type is 'sell' → User is Buyer
    const isBuyer = isMaker
        ? trade.order.type === 'buy'  // Maker: buy ad = buyer
        : trade.order.type === 'sell'; // Taker: sell ad = buyer

    const counterparty = isBuyer ? trade.sellerName : trade.buyerName;

    // Check if trade has expired
    const isExpired = new Date(trade.expiresAt) < new Date();

    return (
        <div className={styles.container}>
            <ToastNotification
                type={notification.type}
                message={notification.message}
                isVisible={notification.isVisible}
                onClose={closeNotification}
            />

            <ConfirmModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleCancelTrade}
                title="Hủy giao dịch"
                content="Bạn có chắc chắn muốn hủy giao dịch này không? Hành động này không thể hoàn tác."
                confirmText="Xác nhận hủy"
                isDanger={true}
            />

            <ConfirmModal
                isOpen={showReleaseModal}
                onClose={() => setShowReleaseModal(false)}
                onConfirm={handleReleaseCrypto}
                title="Xác nhận đã nhận tiền"
                content="Bạn có chắc chắn đã nhận đủ số tiền từ người mua? Sau khi xác nhận, tiền điện tử sẽ được chuyển cho người mua và hành động này không thể hoàn tác."
                confirmText="Đã nhận được tiền"
                isDanger={false}
            />

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
                    {/* Role Banner */}
                    <div className={`${styles.roleBanner} ${isBuyer ? styles.roleBuyer : styles.roleSeller}`}>
                        {isBuyer ? 'Bạn là NGƯỜI MUA' : 'Bạn là NGƯỜI BÁN'}
                    </div>

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
                        </div>
                    </div>

                    {/* Payment Instructions */}
                    {isBuyer && (trade.status === 'pending' || trade.status === 'ORDER_PLACED' || trade.status === 'AWAITING_PAYMENT' || trade.status === 'order_placed' || trade.status === 'awaiting_payment') && (
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>Thông tin ngân hàng thụ hưởng</h3>

                            {isExpired && (
                                <div className={styles.warningBox} style={{ marginBottom: '1rem' }}>
                                    <WarningOutlined className={styles.warningIcon} />
                                    <div>
                                        <p><strong>Giao dịch đã hết hạn</strong></p>
                                        <p>Bạn không thể xác nhận thanh toán cho giao dịch đã hết hạn</p>
                                    </div>
                                </div>
                            )}

                            <div className={styles.paymentInfo}>
                                {trade.paymentMethod.bankName && (
                                    <div className={styles.paymentRow}>
                                        <span className={styles.paymentLabel}>Ngân hàng</span>
                                        <span className={styles.paymentValue}>
                                            {trade.paymentMethod.bankName}
                                        </span>
                                    </div>
                                )}
                                <div className={styles.paymentRow}>
                                    <span className={styles.paymentLabel}>Số tài khoản</span>
                                    <span className={styles.paymentValue}>
                                        {trade.paymentMethod.accountNumber}
                                    </span>
                                </div>
                                <div className={styles.paymentRow}>
                                    <span className={styles.paymentLabel}>Chủ tài khoản</span>
                                    <span className={styles.paymentValue}>
                                        {trade.paymentMethod.accountName}
                                    </span>
                                </div>
                                {trade.paymentMethod.branch && (
                                    <div className={styles.paymentRow}>
                                        <span className={styles.paymentLabel}>Chi nhánh</span>
                                        <span className={styles.paymentValue}>
                                            {trade.paymentMethod.branch}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <button
                                className={styles.confirmButton}
                                onClick={handleConfirmPayment}
                                disabled={isExpired}
                                style={isExpired ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                            >
                                <UploadOutlined /> Đã thanh toán
                            </button>
                        </div>
                    )}

                    {/* Seller Actions */}
                    {!isBuyer && (trade.status === 'pending' || trade.status === 'ORDER_PLACED' || trade.status === 'AWAITING_PAYMENT' || trade.status === 'order_placed' || trade.status === 'awaiting_payment') && (
                        <div className={styles.card}>
                            <div className={styles.warningBox}>
                                <WarningOutlined className={styles.warningIcon} />
                                <div>
                                    <p><strong>Đang chờ người mua thanh toán</strong></p>
                                    <p>Vui lòng đợi người mua xác nhận đã chuyển tiền</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isBuyer && (trade.status === 'paid' || trade.status === 'PAYMENT_SENT' || trade.status === 'AWAITING_RELEASE' || trade.status === 'payment_sent' || trade.status === 'awaiting_release') && (
                        <div className={styles.card}>
                            <div className={styles.warningBox}>
                                <WarningOutlined className={styles.warningIcon} />
                                <div>
                                    <p><strong>Người mua đã xác nhận thanh toán</strong></p>
                                    <p>Vui lòng kiểm tra tài khoản ngân hàng của bạn. Sau khi xác nhận đã nhận đủ số tiền, nhấn nút bên dưới để giải phóng coin cho người mua.</p>
                                </div>
                            </div>
                            <button
                                className={styles.releaseButton}
                                onClick={() => setShowReleaseModal(true)}
                            >
                                Đã nhận được tiền
                            </button>
                        </div>
                    )}

                    {/* Actions */}
                    {(trade.status === 'pending' || trade.status === 'ORDER_PLACED' || trade.status === 'AWAITING_PAYMENT' || trade.status === 'order_placed' || trade.status === 'awaiting_payment') && (
                        <div className={styles.actions}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setShowCancelModal(true)}
                            >
                                Hủy giao dịch
                            </button>
                        </div>
                    )}
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
