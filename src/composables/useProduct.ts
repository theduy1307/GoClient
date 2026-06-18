import { useProductStore, storeToRefs } from '@/stores';

export function useProduct() {
    const store = useProductStore();
    const { products, loading } = storeToRefs(store);

    async function getProductBySearchTerm(searchTerm: string, pageIndex: number = 1, pageSize: number = 10) {
        return await store.searchProducts(searchTerm, pageIndex, pageSize);
    }

    return {
        products,
        loading,
        getProductBySearchTerm
    };
}
