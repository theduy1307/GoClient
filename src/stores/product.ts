import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ProductDto } from '@/types/apiModels';
import { productService } from '@/services/productService';

export const useProductStore = defineStore('product', () => {
    const products = ref<ProductDto[]>([]);
    const loading = ref<boolean>(false);

    async function searchProducts(searchTerm: string, pageIndex: number = 1, pageSize: number = 10) {
        loading.value = true;
        try {
            const result = await productService.getPaging(searchTerm, pageIndex, pageSize);
            if (result.isSuccess && result.value) {
                products.value = result.value.items;
            } else {
                products.value = [];
            }
            return result;
        } catch (error) {
            console.error('Failed to fetch products:', error);
            products.value = [];
            throw error;
        } finally {
            loading.value = false;
        }
    }

    return {
        products,
        loading,
        searchProducts
    };
});
