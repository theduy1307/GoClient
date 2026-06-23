import type { CreateReceiptCommand, ReceiptDto, UpdateReceiptCommand, UpdateReceiptStatusRequest } from '@/types/apiModels';
import type { PagingResultBase } from '@/types/core/paging';
import type { Result } from '@/types/core/result';
import apiClient from './apiClient';

export const receiptService = {
    async create(command: CreateReceiptCommand): Promise<Result<number>> {
        const response = await apiClient.post<Result<number>>('/api/v1/Receipt', command);
        return response.data;
    },

    async update(id: number, command: UpdateReceiptCommand): Promise<Result<void>> {
        const response = await apiClient.put<Result<void>>(`/api/v1/Receipt/${id}`, command);
        return response.data;
    },

    async delete(id: number): Promise<Result<void>> {
        const response = await apiClient.delete<Result<void>>(`/api/v1/Receipt/${id}`);
        return response.data;
    },

    async getById(id: number): Promise<Result<ReceiptDto>> {
        const response = await apiClient.get<Result<ReceiptDto>>(`/api/v1/Receipt/${id}`);
        return response.data;
    },

    async getPaging(pageIndex: number = 1, pageSize: number = 10): Promise<Result<PagingResultBase<ReceiptDto>>> {
        const response = await apiClient.get<Result<PagingResultBase<ReceiptDto>>>('/api/v1/Receipt', {
            params: { pageIndex, pageSize }
        });
        return response.data;
    },
    async updateStatus(id: number, request: UpdateReceiptStatusRequest): Promise<Result<void>> {
        const response = await apiClient.patch<Result<void>>(`/api/v1/Receipt/${id}/status`, request);
        return response.data;
    }
};
