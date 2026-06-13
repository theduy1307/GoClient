import { ref } from 'vue';
import { authService } from '@/services/authService';
import { useEmployeeStore } from '@/stores';
import type { MenuItem } from '@/types/apiModels';

export function useMenu() {
    const menuItems = ref<MenuItem[]>([]);
    const loading = ref<boolean>(false);
    const employeeStore = useEmployeeStore();

    async function fetchMenu() {
        if (!employeeStore.currentEmployee) {
            return [];
        }
        loading.value = true;
        try {
            const result = await authService.getMenu(employeeStore.currentEmployee.id);
            if (result.isSuccess && result.value) {
                menuItems.value = result.value;
                return result.value;
            }
            return [];
        } catch (error) {
            console.error('Failed to fetch menu:', error);
            return [];
        } finally {
            loading.value = false;
        }
    }

    return {
        menuItems,
        loading,
        fetchMenu
    };
}
