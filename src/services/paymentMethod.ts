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

            // Handle both single object and array responses
            let methods: PaymentMethod[] = [];
            if (Array.isArray(data)) {
                methods = data;
            } else if (data && typeof data === 'object') {
                // Single object returned, wrap in array
                methods = [data];
            }

            // Filter only active payment methods (treat null/undefined as active)
            const activeMethods = methods.filter((pm: PaymentMethod) => pm.isActive !== false);
            return activeMethods;
        } catch (error: any) {
            console.error('Error fetching payment methods:', error);
            throw error; // Throw error instead of returning empty array
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

    /**
     * Get list of Vietnamese banks
     * Returns a comprehensive list of major banks in Vietnam
     */
    getVietnameseBanks(): Array<{ code: string; name: string; shortName: string }> {
        return [
            { code: 'VCB', name: 'Ngân hàng TMCP Ngoại thương Việt Nam', shortName: 'Vietcombank' },
            { code: 'TCB', name: 'Ngân hàng TMCP Kỹ thương Việt Nam', shortName: 'Techcombank' },
            { code: 'BIDV', name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam', shortName: 'BIDV' },
            { code: 'VTB', name: 'Ngân hàng TMCP Công thương Việt Nam', shortName: 'VietinBank' },
            { code: 'ACB', name: 'Ngân hàng TMCP Á Châu', shortName: 'ACB' },
            { code: 'MB', name: 'Ngân hàng TMCP Quân đội', shortName: 'MBBank' },
            { code: 'VPB', name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng', shortName: 'VPBank' },
            { code: 'TPB', name: 'Ngân hàng TMCP Tiên Phong', shortName: 'TPBank' },
            { code: 'STB', name: 'Ngân hàng TMCP Sài Gòn Thương Tín', shortName: 'Sacombank' },
            { code: 'HDB', name: 'Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh', shortName: 'HDBank' },
            { code: 'SHB', name: 'Ngân hàng TMCP Sài Gòn - Hà Nội', shortName: 'SHB' },
            { code: 'EIB', name: 'Ngân hàng TMCP Xuất Nhập khẩu Việt Nam', shortName: 'Eximbank' },
            { code: 'MSB', name: 'Ngân hàng TMCP Hàng Hải', shortName: 'MSB' },
            { code: 'OCB', name: 'Ngân hàng TMCP Phương Đông', shortName: 'OCB' },
            { code: 'NAB', name: 'Ngân hàng TMCP Nam Á', shortName: 'Nam A Bank' },
            { code: 'VAB', name: 'Ngân hàng TMCP Việt Á', shortName: 'VietABank' },
            { code: 'SCB', name: 'Ngân hàng TMCP Sài Gòn', shortName: 'SCB' },
            { code: 'VIB', name: 'Ngân hàng TMCP Quốc tế Việt Nam', shortName: 'VIB' },
            { code: 'ABB', name: 'Ngân hàng TMCP An Bình', shortName: 'ABBANK' },
            { code: 'SEA', name: 'Ngân hàng TMCP Đông Nam Á', shortName: 'SeABank' },
            { code: 'BAB', name: 'Ngân hàng TMCP Bắc Á', shortName: 'BacABank' },
            { code: 'PGB', name: 'Ngân hàng TMCP Xăng dầu Petrolimex', shortName: 'PGBank' },
            { code: 'LPB', name: 'Ngân hàng TMCP Bưu Điện Liên Việt', shortName: 'LienVietPostBank' },
            { code: 'KLB', name: 'Ngân hàng TMCP Kiên Long', shortName: 'KienLongBank' },
            { code: 'CAKE', name: 'Ngân hàng số CAKE by VPBank', shortName: 'CAKE' },
            { code: 'UBANK', name: 'Ngân hàng số Ubank by VPBank', shortName: 'Ubank' },
            { code: 'TIMO', name: 'Ngân hàng số Timo by VPBank', shortName: 'Timo' },
            { code: 'VIET', name: 'Ngân hàng TMCP Việt Nam Thương Tín', shortName: 'VietBank' },
            { code: 'BAO', name: 'Ngân hàng TMCP Bảo Việt', shortName: 'BaoVietBank' },
            { code: 'PVB', name: 'Ngân hàng TMCP Đại Chúng Việt Nam', shortName: 'PVcomBank' },
            { code: 'SAIGON', name: 'Ngân hàng TMCP Sài Gòn Công Thương', shortName: 'SaigonBank' },
            { code: 'NCB', name: 'Ngân hàng TMCP Quốc Dân', shortName: 'NCB' },
            { code: 'OJB', name: 'Ngân hàng TMCP Đại Dương', shortName: 'OceanBank' },
            { code: 'GPB', name: 'Ngân hàng Thương mại TNHH MTV Dầu Khí Toàn Cầu', shortName: 'GPBank' },
            { code: 'VCCB', name: 'Ngân hàng TMCP Bản Việt', shortName: 'VietCapitalBank' },
            { code: 'AGRI', name: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam', shortName: 'Agribank' },
            { code: 'COOP', name: 'Ngân hàng Hợp tác xã Việt Nam', shortName: 'Co-opBank' },
            { code: 'CBB', name: 'Ngân hàng Thương mại TNHH MTV Xây dựng Việt Nam', shortName: 'CBBank' },
            { code: 'IVB', name: 'Ngân hàng TNHH Indovina', shortName: 'IndovinaBank' },
            { code: 'SHBVN', name: 'Ngân hàng TNHH MTV Shinhan Việt Nam', shortName: 'Shinhan Bank' },
            { code: 'WOORI', name: 'Ngân hàng TNHH MTV Woori Việt Nam', shortName: 'Woori Bank' },
            { code: 'HSBC', name: 'Ngân hàng TNHH MTV HSBC Việt Nam', shortName: 'HSBC' },
            { code: 'SC', name: 'Ngân hàng TNHH MTV Standard Chartered Việt Nam', shortName: 'Standard Chartered' },
            { code: 'CITI', name: 'Ngân hàng Citibank Việt Nam', shortName: 'Citibank' },
            { code: 'PBVN', name: 'Ngân hàng TNHH MTV Public Việt Nam', shortName: 'Public Bank' },
            { code: 'HONGLEONG', name: 'Ngân hàng TNHH MTV Hong Leong Việt Nam', shortName: 'Hong Leong Bank' },
        ];
    }
}

export default new PaymentMethodService();
