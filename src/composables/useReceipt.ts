import { storeToRefs, useReceiptStore } from '@/stores';

export function useReceipt() {
    const store = useReceiptStore();
    const { activedReceipt, activedReceiptDetails, loading } = storeToRefs(store);

    async function getReceiptById(id: number) {
        return await store.fetchReceiptById(id);
    }

    function clearActivedReceipt() {
        store.activedReceipt = null;
        store.activedReceiptDetails = [];
    }

    return {
        activedReceipt,
        activedReceiptDetails,
        loading,
        getReceiptById,
        clearActivedReceipt
    };
}
