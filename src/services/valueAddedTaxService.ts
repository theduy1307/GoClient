import type { CreateValueAddedTaxCommand, UpdateValueAddedTaxCommand, ValueAddedTaxDto } from '@/types/apiModels';
import type { PagingResultBase } from '@/types/core/paging';
import type { Result } from '@/types/core/result';
import apiClient from './apiClient';

export const valueAddedTaxService = {
    async create(command: CreateValueAddedTaxCommand): Promise<Result<number>> {
        const response = await apiClient.post<Result<number>>('/api/v1/ValueAddedTax', command);
        return response.data;
    },

    async update(id: number, command: UpdateValueAddedTaxCommand): Promise<Result<void>> {
        const response = await apiClient.put<Result<void>>(`/api/v1/ValueAddedTax/${id}`, command);
        return response.data;
    },

    async delete(id: number): Promise<Result<void>> {
        const response = await apiClient.delete<Result<void>>(`/api/v1/ValueAddedTax/${id}`);
        return response.data;
    },

    async getById(id: number): Promise<Result<ValueAddedTaxDto>> {
        const response = await apiClient.get<Result<ValueAddedTaxDto>>(`/api/v1/ValueAddedTax/${id}`);
        return response.data;
    },

    async getPaging(pageIndex: number = 1, pageSize: number = 10): Promise<Result<PagingResultBase<ValueAddedTaxDto>>> {
        const response = await apiClient.get<Result<PagingResultBase<ValueAddedTaxDto>>>('/api/v1/ValueAddedTax', {
            params: { pageIndex, pageSize }
        });
        return response.data;
    }
};
