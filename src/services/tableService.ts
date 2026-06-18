import type { CreateTableCommand, TableDto, TableWithReceipts, UpdateTableCommand, UpdateTableStatusRequest } from '@/types/apiModels';
import type { PagingResultBase } from '@/types/core/paging';
import type { Result } from '@/types/core/result';
import apiClient from './apiClient';

export const tableService = {
    async create(command: CreateTableCommand): Promise<Result<number>> {
        const response = await apiClient.post<Result<number>>('/api/v1/Table', command);
        return response.data;
    },

    async update(id: number, command: UpdateTableCommand): Promise<Result<void>> {
        const response = await apiClient.put<Result<void>>(`/api/v1/Table/${id}`, command);
        return response.data;
    },

    async delete(id: number): Promise<Result<void>> {
        const response = await apiClient.delete<Result<void>>(`/api/v1/Table/${id}`);
        return response.data;
    },

    async getById(id: number): Promise<Result<TableDto>> {
        const response = await apiClient.get<Result<TableDto>>(`/api/v1/Table/${id}`);
        return response.data;
    },

    async getPaging(pageIndex: number = 1, pageSize: number = 100): Promise<Result<PagingResultBase<TableDto>>> {
        const response = await apiClient.get<Result<PagingResultBase<TableDto>>>('/api/v1/Table', {
            params: { pageIndex, pageSize }
        });
        return response.data;
    },

    async getTableWithReceipts(tableId: number): Promise<Result<TableWithReceipts>> {
        const response = await apiClient.get<Result<TableWithReceipts>>(`/api/v1/Table/${tableId}/serving-receipt/`);
        return response.data;
    },

    async updateStatus(id: number, request: UpdateTableStatusRequest): Promise<Result<void>> {
        const response = await apiClient.patch<Result<void>>(`/api/v1/Table/${id}/status`, request);
        return response.data;
    }
};

