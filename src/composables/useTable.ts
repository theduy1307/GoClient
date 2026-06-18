import { tableService } from '@/services/tableService';
import { storeToRefs, useTableStore } from '@/stores';

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

    return {
        tables,
        loading,
        tableWithReceipts,
        getTables,
        getTableWithReceipts
    };
}
