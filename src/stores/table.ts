import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { TableDto, TableWithReceipts } from '@/types/apiModels';
import { tableService } from '@/services/tableService';

export const useTableStore = defineStore('table', () => {
    const tables = ref<TableDto[]>([]);
    const tableWithReceipts = ref<TableWithReceipts | null>(null);
    const loading = ref<boolean>(false);

    async function fetchTables() {
        loading.value = true;
        try {
            const result = await tableService.getPaging(1, 100);
            if (result.isSuccess && result.value) {
                tables.value = result.value.items;
            } else {
                tables.value = [];
            }
        } catch (error) {
            console.error('Failed to fetch tables:', error);
            tables.value = [];
        } finally {
            loading.value = false;
        }
    }

    return {
        tables,
        tableWithReceipts,
        loading,
        fetchTables
    };
});

