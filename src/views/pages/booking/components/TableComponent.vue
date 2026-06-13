<script setup lang="ts">
import type { TableDto } from '@/types/apiModels';
import Card from 'primevue/card';
import Tag from 'primevue/tag';

defineProps<{
    table: TableDto;
}>();
</script>

<template>
    <Card class="aspect-square flex flex-col justify-center items-center text-center border border-surface-200 dark:border-surface-700 shadow-sm hover:shadow-md transition-shadow duration-200">
        <template #title>
            <div class="text-lg font-bold truncate max-w-full px-2 text-surface-900 dark:text-surface-0">
                {{ table.name }}
            </div>
        </template>
        <template #content>
            <div class="flex flex-col items-center justify-center gap-3 mt-1">
                <Tag v-if="Number(table.status) === 0" severity="success" value="Available"></Tag>
                <Tag v-else-if="Number(table.status) === 1" severity="info" value="Serving"></Tag>
                <Tag v-else-if="Number(table.status) === 2" severity="danger" value="Billing"></Tag>
                <Tag v-else severity="secondary" :value="table.status"></Tag>
                
                <span class="text-sm text-surface-500 dark:text-surface-400">
                    Sức chứa: {{ table.capacity }}
                </span>
            </div>
        </template>
    </Card>
</template>

<style scoped>
:deep(.p-card) {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
}
:deep(.p-card-body) {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>
