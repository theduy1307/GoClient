import { tableService } from '@/services/tableService';
import { storeToRefs, useTableStore } from '@/stores';
import { ReceiptDto } from '@/types/apiModels';

export function useTable() {
    const store = useTableStore();
    const { tables, loading, tableWithReceipts } = storeToRefs(store);

    async function getTables() {
        await store.fetchTables();
    }

    async function getTableWithReceipts(tableId: number) {
        store.loading = true;
        try {
            const result = await tableService.getTableWithReceipts(tableId);
            if (result.isSuccess && result.value) {
                store.tableWithReceipts = result.value;
            } else {
                store.tableWithReceipts = null;
            }
        } catch (error) {
            console.error('Failed to get table with receipts:', error);
            store.tableWithReceipts = null;
        } finally {
            store.loading = false;
        }
    }

    function updateLastReceiptId(receiptId: number) {
        if (store.tableWithReceipts && store.tableWithReceipts.receipts.length > 0) {
            store.tableWithReceipts.receipts[store.tableWithReceipts.receipts.length - 1].id = receiptId;
        }
    }
    function addReceiptToTableWithReceipts(receipt: ReceiptDto) {
        if (store.tableWithReceipts) {
            store.tableWithReceipts.receipts.push(receipt);
        }
    }

    return {
        tables,
        loading,
        tableWithReceipts,
        getTables,
        getTableWithReceipts,
        updateLastReceiptId,
        addReceiptToTableWithReceipts
    };
}
