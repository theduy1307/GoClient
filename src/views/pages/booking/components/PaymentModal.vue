<script setup lang="ts">
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

defineProps<{
    visible: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
    (e: 'success'): void;
}>();

function handleSuccess() {
    emit('success');
    emit('update:visible', false);
}
</script>

<template>
    <Dialog :visible="visible" @update:visible="emit('update:visible', $event)" modal header="Thanh toán hoá đơn" :style="{ width: '350px' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="flex flex-col items-center gap-4 py-2">
            <!-- QR code image with rounded corners -->
            <img src="/src/assets/images/qr-banking.jpg" class="rounded-2xl border border-surface-200 dark:border-surface-700 max-w-full h-auto shadow-sm" alt="QR Banking Code" />

            <span class="text-sm text-surface-500 text-center"> Quét mã QR trên để tiến hành thanh toán chuyển khoản. </span>
        </div>

        <template #footer>
            <div class="flex justify-center w-full">
                <Button label="Thanh toán thành công" icon="pi pi-check-circle" severity="success" class="w-full" @click="handleSuccess" />
            </div>
        </template>
    </Dialog>
</template>
