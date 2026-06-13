import type { CreateProductCommand, ProductDto, UpdateProductCommand } from '@/types/apiModels';
import type { PagingResultBase } from '@/types/core/paging';
import type { Result } from '@/types/core/result';
import apiClient from './apiClient';

export const productService = {
    async create(command: CreateProductCommand): Promise<Result<number>> {
        const response = await apiClient.post<Result<number>>('/api/v1/Product', command);
        return response.data;
    },

    async update(id: number, command: UpdateProductCommand): Promise<Result<void>> {
        const response = await apiClient.put<Result<void>>(`/api/v1/Product/${id}`, command);
        return response.data;
    },

    async delete(id: number): Promise<Result<void>> {
        const response = await apiClient.delete<Result<void>>(`/api/v1/Product/${id}`);
        return response.data;
    },

    async getById(id: number): Promise<Result<ProductDto>> {
        const response = await apiClient.get<Result<ProductDto>>(`/api/v1/Product/${id}`);
        return response.data;
    },

    async getPaging(pageIndex: number = 1, pageSize: number = 10): Promise<Result<PagingResultBase<ProductDto>>> {
        const response = await apiClient.get<Result<PagingResultBase<ProductDto>>>('/api/v1/Product', {
            params: { pageIndex, pageSize }
        });
        return response.data;
    }
};
