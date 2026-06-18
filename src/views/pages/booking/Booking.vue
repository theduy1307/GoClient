<script setup lang="ts">
import { useTable } from '@/composables/useTable';
import Card from 'primevue/card';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TableComponent from './components/TableComponent.vue';

const router = useRouter();
const { tables, loading, getTables } = useTable();

onMounted(async () => {
    await getTables();
});

function viewTableDetail(tableId: number) {
    router.push({ name: 'table-detail', params: { tableId } });
}
</script>

<template>
    <div class="grid grid-cols-12 gap-4">
        <!-- Widget Bên trái (Tỉ lệ 3/4 -> col-span-9) -->
        <div class="col-span-12 lg:col-span-9">
            <Card class="h-full">
                <template #title>
                    <div class="flex justify-between items-center px-2">
                        <span class="text-xl font-semibold text-surface-900 dark:text-surface-0">Danh sách bàn ăn</span>
                        <span class="text-sm text-surface-500 font-normal" v-if="loading">Đang tải...</span>
                    </div>
                </template>
                <template #content>
                    <div v-if="tables.length === 0 && !loading" class="text-center py-8 text-surface-500">Không có dữ liệu bàn ăn.</div>
                    <div class="grid grid-cols-4 gap-4" v-else>
                        <div v-for="table in tables" :key="table.id" class="w-full cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-200" @click="viewTableDetail(table.id)">
                            <TableComponent :table="table" />
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <!-- Widget Bên phải (Tỉ lệ 1/4 -> col-span-3) -->
        <div class="col-span-12 lg:col-span-3">
            <Card class="h-full">
                <template #title>
                    <span class="text-xl font-semibold text-surface-900 dark:text-surface-0">Thông tin chung</span>
                </template>
                <template #content>
                    <div class="flex flex-col gap-4 mt-2">
                        <div class="p-3 border border-surface-200 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-800">
                            <h4 class="font-bold text-sm mb-2 text-surface-800 dark:text-surface-200">Trạng thái bàn:</h4>
                            <div class="flex flex-col gap-2 text-sm">
                                <div class="flex items-center gap-2">
                                    <span class="w-3.5 h-3.5 bg-green-500 rounded-full"></span>
                                    <span class="text-surface-700 dark:text-surface-300">Available (Sẵn sàng)</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="w-3.5 h-3.5 bg-blue-500 rounded-full"></span>
                                    <span class="text-surface-700 dark:text-surface-300">Serving (Đang phục vụ)</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="w-3.5 h-3.5 bg-red-500 rounded-full"></span>
                                    <span class="text-surface-700 dark:text-surface-300">Billing (Chờ thanh toán)</span>
                                </div>
                            </div>
                        </div>

                        <div class="p-3 border border-surface-200 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-800">
                            <h4 class="font-bold text-sm mb-2 text-surface-800 dark:text-surface-200">Thống kê:</h4>
                            <div class="flex flex-col gap-1.5 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-surface-600 dark:text-surface-400">Tổng số bàn:</span>
                                    <span class="font-bold text-surface-900 dark:text-surface-100">{{ tables.length }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-surface-600 dark:text-surface-400 font-medium text-green-600">Available:</span>
                                    <span class="font-bold text-green-600">{{ tables.filter((t) => Number(t.status) === 0).length }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-surface-600 dark:text-surface-400 font-medium text-blue-600">Serving:</span>
                                    <span class="font-bold text-blue-600">{{ tables.filter((t) => Number(t.status) === 1).length }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-surface-600 dark:text-surface-400 font-medium text-red-600">Billing:</span>
                                    <span class="font-bold text-red-600">{{ tables.filter((t) => Number(t.status) === 2).length }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<style scoped></style>
