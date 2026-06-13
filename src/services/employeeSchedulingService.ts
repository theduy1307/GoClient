import type { CreateEmployeeSchedulingCommand } from '@/types/apiModels';
import type { Result } from '@/types/core/result';
import apiClient from './apiClient';

export const employeeSchedulingService = {
    async modifyScheduling(command: CreateEmployeeSchedulingCommand): Promise<Result<number>> {
        const response = await apiClient.post<Result<number>>('/api/v1/EmployeeScheduling', command);
        return response.data;
    }
};
