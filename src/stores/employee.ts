import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { EmployeeDto } from '@/types/apiModels';

export const useEmployeeStore = defineStore('employee', () => {
    const currentEmployee = ref<EmployeeDto | null>(null);
    const loading = ref<boolean>(false);

    const isAuthenticated = computed(() => !!currentEmployee.value);

    function setEmployee(employee: EmployeeDto | null) {
        currentEmployee.value = employee;
    }

    function clearEmployee() {
        currentEmployee.value = null;
    }

    return {
        currentEmployee,
        loading,
        isAuthenticated,
        setEmployee,
        clearEmployee
    };
});
