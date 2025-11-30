/**
 * P2P Ad Management Examples
 * This file demonstrates how to use the updateAd and cancelAd methods
 */

import P2PService from '@/src/services/p2p';

/**
 * Example 1: Update an ad (edit price, amounts, terms, etc.)
 */
export const updateAdExample = async (adId: string | number) => {
    try {
        const result = await P2PService.updateAd(adId, {
            price: 24000,
            minAmount: 100,
            maxAmount: 1000,
            availableAmount: 500,
            isActive: true,
            termsConditions: "New terms"
        });

        console.log('Ad updated successfully:', result);
        return result;
    } catch (error) {
        console.error('Failed to update ad:', error);
        throw error;
    }
};

/**
 * Example 2: Deactivate an ad using the Edit API (set isActive to false)
 */
export const deactivateAdUsingEdit = async (adId: string | number) => {
    try {
        const result = await P2PService.updateAd(adId, {
            isActive: false
        });

        console.log('Ad deactivated successfully:', result);
        return result;
    } catch (error) {
        console.error('Failed to deactivate ad:', error);
        throw error;
    }
};

/**
 * Example 3: Cancel an ad using the Cancel API
 * This will also unlock any remaining funds for SELL ads
 */
export const cancelAdExample = async (adId: string | number) => {
    try {
        const result = await P2PService.cancelAd(adId);

        console.log('Ad cancelled successfully:', result);
        return result;
    } catch (error) {
        console.error('Failed to cancel ad:', error);
        throw error;
    }
};

/**
 * Example 4: Update multiple fields at once
 */
export const updateMultipleFields = async (adId: string | number) => {
    try {
        const result = await P2PService.updateAd(adId, {
            price: 25000,
            minAmount: 200,
            maxAmount: 2000,
            availableAmount: 1000,
            termsConditions: "Updated payment terms: Please transfer within 15 minutes"
        });

        console.log('Ad updated with multiple fields:', result);
        return result;
    } catch (error) {
        console.error('Failed to update ad:', error);
        throw error;
    }
};

/**
 * Example 5: Update only the price
 */
export const updatePriceOnly = async (adId: string | number, newPrice: number) => {
    try {
        const result = await P2PService.updateAd(adId, {
            price: newPrice
        });

        console.log('Price updated successfully:', result);
        return result;
    } catch (error) {
        console.error('Failed to update price:', error);
        throw error;
    }
};

/**
 * Example 6: React component usage
 */
export const AdManagementComponent = () => {
    const handleUpdateAd = async (adId: string) => {
        try {
            await P2PService.updateAd(adId, {
                price: 24000,
                minAmount: 100,
                maxAmount: 1000,
                availableAmount: 500,
                isActive: true,
                termsConditions: "New terms"
            });

            alert('Ad updated successfully!');
            // Refresh the ad list or update state
        } catch (error: any) {
            alert(`Failed to update ad: ${error.message}`);
        }
    };

    const handleDeactivateAd = async (adId: string) => {
        try {
            await P2PService.updateAd(adId, {
                isActive: false
            });

            alert('Ad deactivated successfully!');
            // Refresh the ad list or update state
        } catch (error: any) {
            alert(`Failed to deactivate ad: ${error.message}`);
        }
    };

    const handleCancelAd = async (adId: string) => {
        try {
            await P2PService.cancelAd(adId);

            alert('Ad cancelled successfully! Funds unlocked.');
            // Refresh the ad list or update state
        } catch (error: any) {
            alert(`Failed to cancel ad: ${error.message}`);
        }
    };

    return null; // Your component JSX here
};
