import { useReceiptStore, storeToRefs } from '@/stores';

export function useReceipt() {
    const store = useReceiptStore();
    const { activedReceipt, activedReceiptDetails, loading } = storeToRefs(store);

    async function getReceiptById(id: number) {
        return await store.fetchReceiptById(id);
    }

    return {
        activedReceipt,
        activedReceiptDetails,
        loading,
        getReceiptById
    };
}
