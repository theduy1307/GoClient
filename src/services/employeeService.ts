import type { CreateEmployeeCommand, EmployeeDto } from '@/types/apiModels';
import type { PagingResultBase } from '@/types/core/paging';
import type { Result } from '@/types/core/result';
import apiClient from './apiClient';

export const employeeService = {
    async create(command: CreateEmployeeCommand): Promise<Result<number>> {
        const response = await apiClient.post<Result<number>>('/api/v1/Employee', command);
        return response.data;
    },

    async getById(id: number): Promise<Result<EmployeeDto>> {
        const response = await apiClient.get<Result<EmployeeDto>>(`/api/v1/Employee/${id}`);
        return response.data;
    },

    async getMe(): Promise<Result<EmployeeDto>> {
        const response = await apiClient.get<Result<EmployeeDto>>('/api/v1/Employee/Me');
        return response.data;
    },

    async getPaging(pageIndex: number, pageSize: number): Promise<Result<PagingResultBase<EmployeeDto>>> {
        const response = await apiClient.get<Result<PagingResultBase<EmployeeDto>>>('/api/v1/Employee', {
            params: { pageIndex, pageSize }
        });
        return response.data;
    }
};
