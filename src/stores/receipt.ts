import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { ReceiptDto, ReceiptDetailDto } from '@/types/apiModels';
import { receiptService } from '@/services/receiptService';

export const useReceiptStore = defineStore('receipt', () => {
    const activedReceipt = ref<ReceiptDto | null>(null);
    const activedReceiptDetails = ref<ReceiptDetailDto[]>([]);
    const loading = ref<boolean>(false);

    // Watch active receipt details and update totalAmount automatically
    watch(
        activedReceiptDetails,
        (details) => {
            if (activedReceipt.value && details) {
                activedReceipt.value.totalAmount = details.reduce((sum, item) => {
                    const price = item.unitPrice ?? 0;
                    return sum + item.quantity * price;
                }, 0);
            }
        },
        { deep: true }
    );

    async function fetchReceiptById(id: number) {
        loading.value = true;
        try {
            const result = await receiptService.getById(id);
            if (result.isSuccess && result.value) {
                activedReceipt.value = result.value;
                activedReceiptDetails.value = result.value.receiptDetails || [];
            } else {
                activedReceipt.value = null;
                activedReceiptDetails.value = [];
            }
            return result;
        } catch (error) {
            console.error('Failed to fetch receipt:', error);
            activedReceipt.value = null;
            activedReceiptDetails.value = [];
            throw error;
        } finally {
            loading.value = false;
        }
    }

    return {
        activedReceipt,
        activedReceiptDetails,
        loading,
        fetchReceiptById
    };
});
