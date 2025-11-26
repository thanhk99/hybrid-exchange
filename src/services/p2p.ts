/**
 * P2P Service - Main wrapper
 * This file re-exports functionality from specialized services for backward compatibility
 */

import P2POrderService from './p2pOrder';
import P2PTradeService from './p2pTrade';
import PaymentMethodService from './paymentMethod';

class P2PService {
    // Re-export order methods
    getOrders = P2POrderService.getOrders.bind(P2POrderService);
    createOrder = P2POrderService.createOrder.bind(P2POrderService);
    getUserOrders = P2POrderService.getUserOrders.bind(P2POrderService);
    getUserStats = P2POrderService.getUserStats.bind(P2POrderService);

    // Re-export trade methods
    createTrade = P2PTradeService.createTrade.bind(P2PTradeService);
    getTrade = P2PTradeService.getTrade.bind(P2PTradeService);
    confirmPayment = P2PTradeService.confirmPayment.bind(P2PTradeService);
    releaseCrypto = P2PTradeService.releaseCrypto.bind(P2PTradeService);
    cancelTrade = P2PTradeService.cancelTrade.bind(P2PTradeService);
    getTradeMessages = P2PTradeService.getTradeMessages.bind(P2PTradeService);
    sendTradeMessage = P2PTradeService.sendTradeMessage.bind(P2PTradeService);

    // Re-export payment method methods
    getPaymentMethods = PaymentMethodService.getPaymentMethods.bind(PaymentMethodService);
    getPaymentMethodById = PaymentMethodService.getPaymentMethodById.bind(PaymentMethodService);
    addPaymentMethod = PaymentMethodService.addPaymentMethod.bind(PaymentMethodService);
    updatePaymentMethod = PaymentMethodService.updatePaymentMethod.bind(PaymentMethodService);
    deletePaymentMethod = PaymentMethodService.deletePaymentMethod.bind(PaymentMethodService);
}

export default new P2PService();

// Also export individual services for direct access
export { P2POrderService, P2PTradeService, PaymentMethodService };
