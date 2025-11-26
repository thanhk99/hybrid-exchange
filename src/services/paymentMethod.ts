import axiosInstance from '@/src/libs/axios';
import { PaymentMethod } from '@/src/types/p2p';

class PaymentMethodService {
    /**
     * Get all payment methods (active only)
     */
    async getPaymentMethods(): Promise<PaymentMethod[]> {
        try {
            const response = await axiosInstance.get('/api/v1/payment-methods');
            const data = response.data.data || response.data;

            // Filter only active payment methods
            return Array.isArray(data) ? data.filter((pm: PaymentMethod) => pm.isActive) : [];
        } catch (error) {
            console.error('Error fetching payment methods:', error);
            return [];
        }
    }

    /**
     * Get payment method by ID
     */
    async getPaymentMethodById(id: string): Promise<PaymentMethod | null> {
        try {
            const response = await axiosInstance.get(`/api/v1/payment-methods/${id}`);
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error fetching payment method:', error);
            return null;
        }
    }

    /**
     * Add new payment method
     */
    async addPaymentMethod(data: Partial<PaymentMethod>): Promise<PaymentMethod> {
        try {
            const response = await axiosInstance.post('/api/v1/payment-methods', data);
            return response.data.data || response.data;
        } catch (error: any) {
            console.error('Error adding payment method:', error);
            throw new Error(error.response?.data?.message || 'Failed to add payment method');
        }
    }

    /**
     * Update payment method
     */
    async updatePaymentMethod(id: string, data: Partial<PaymentMethod>): Promise<PaymentMethod> {
        try {
            const response = await axiosInstance.put(`/api/v1/payment-methods/${id}`, data);
            return response.data.data || response.data;
        } catch (error: any) {
            console.error('Error updating payment method:', error);
            throw new Error(error.response?.data?.message || 'Failed to update payment method');
        }
    }

    /**
     * Delete payment method (soft delete)
     */
    async deletePaymentMethod(id: string): Promise<void> {
        try {
            await axiosInstance.delete(`/api/v1/payment-methods/${id}`);
        } catch (error: any) {
            console.error('Error deleting payment method:', error);
            throw new Error(error.response?.data?.message || 'Failed to delete payment method');
        }
    }

    /**
     * Set payment method as default
     */
    async setDefaultPaymentMethod(id: string): Promise<PaymentMethod> {
        try {
            const response = await axiosInstance.put(`/api/v1/payment-methods/${id}`, {
                isDefault: true
            });
            return response.data.data || response.data;
        } catch (error: any) {
            console.error('Error setting default payment method:', error);
            throw new Error(error.response?.data?.message || 'Failed to set default payment method');
        }
    }
}

export default new PaymentMethodService();
