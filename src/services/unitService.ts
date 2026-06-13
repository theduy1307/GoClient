import type { CreateUnitCommand, UnitDto, UpdateUnitCommand } from '@/types/apiModels';
import type { PagingResultBase } from '@/types/core/paging';
import type { Result } from '@/types/core/result';
import apiClient from './apiClient';

export const unitService = {
    async create(command: CreateUnitCommand): Promise<Result<number>> {
        const response = await apiClient.post<Result<number>>('/api/v1/Unit', command);
        return response.data;
    },

    async update(id: number, command: UpdateUnitCommand): Promise<Result<void>> {
        const response = await apiClient.put<Result<void>>(`/api/v1/Unit/${id}`, command);
        return response.data;
    },

    async delete(id: number): Promise<Result<void>> {
        const response = await apiClient.delete<Result<void>>(`/api/v1/Unit/${id}`);
        return response.data;
    },

    async getById(id: number): Promise<Result<UnitDto>> {
        const response = await apiClient.get<Result<UnitDto>>(`/api/v1/Unit/${id}`);
        return response.data;
    },

    async getPaging(pageIndex: number = 1, pageSize: number = 10): Promise<Result<PagingResultBase<UnitDto>>> {
        const response = await apiClient.get<Result<PagingResultBase<UnitDto>>>('/api/v1/Unit', {
            params: { pageIndex, pageSize }
        });
        return response.data;
    }
};
