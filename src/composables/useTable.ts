import { useTableStore, storeToRefs } from '@/stores';

export function useTable() {
    const store = useTableStore();
    const { tables, loading } = storeToRefs(store);

    async function getTables() {
        await store.fetchTables();
    }

    return {
        tables,
        loading,
        getTables
    };
}
