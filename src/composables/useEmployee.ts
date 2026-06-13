import { employeeService } from '@/services/employeeService';
import { storeToRefs, useEmployeeStore } from '@/stores';

export function useEmployee() {
    const store = useEmployeeStore();
    const { currentEmployee, loading, isAuthenticated } = storeToRefs(store);

    async function fetchMe() {
        loading.value = true;
        try {
            const result = await employeeService.getMe();
            if (result.isSuccess && result.value) {
                store.setEmployee(result.value);
            } else {
                store.clearEmployee();
            }
            return result;
        } catch (error) {
            store.clearEmployee();
            console.error('Failed to fetch employee details:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    return {
        currentEmployee,
        loading,
        isAuthenticated,
        fetchMe,
        clearEmployee: store.clearEmployee
    };
}
