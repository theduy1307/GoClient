import type { CreateProductTypeCommand, ProductTypeDto, UpdateProductTypeCommand } from '@/types/apiModels';
import type { PagingResultBase } from '@/types/core/paging';
import type { Result } from '@/types/core/result';
import apiClient from './apiClient';

export const productTypeService = {
    async create(command: CreateProductTypeCommand): Promise<Result<number>> {
        const response = await apiClient.post<Result<number>>('/api/v1/ProductType', command);
        return response.data;
    },

    async update(id: number, command: UpdateProductTypeCommand): Promise<Result<void>> {
        const response = await apiClient.put<Result<void>>(`/api/v1/ProductType/${id}`, command);
        return response.data;
    },

    async delete(id: number): Promise<Result<void>> {
        const response = await apiClient.delete<Result<void>>(`/api/v1/ProductType/${id}`);
        return response.data;
    },

    async getById(id: number): Promise<Result<ProductTypeDto>> {
        const response = await apiClient.get<Result<ProductTypeDto>>(`/api/v1/ProductType/${id}`);
        return response.data;
    },

    async getPaging(pageIndex: number = 1, pageSize: number = 10): Promise<Result<PagingResultBase<ProductTypeDto>>> {
        const response = await apiClient.get<Result<PagingResultBase<ProductTypeDto>>>('/api/v1/ProductType', {
            params: { pageIndex, pageSize }
        });
        return response.data;
    }
};
