<script setup lang="ts">
import { useProduct } from '@/composables/useProduct';
import { useReceipt } from '@/composables/useReceipt';
import { useTable } from '@/composables/useTable';
import { receiptService } from '@/services/receiptService';
import { tableService } from '@/services/tableService';
import { useTableStore } from '@/stores';
import { CreateReceiptCommand, ReceiptDetailDto, ReceiptDto, ReceiptStatus } from '@/types/apiModels';
import Button from 'primevue/button';
import Card from 'primevue/card';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import ProgressSpinner from 'primevue/progressspinner';
import Tag from 'primevue/tag';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PaymentModal from './components/PaymentModal.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const tableStore = useTableStore();
const { tableWithReceipts, loading, getTableWithReceipts, updateLastReceiptId, addReceiptToTableWithReceipts } = useTable();
const { getProductBySearchTerm } = useProduct();
const { activedReceipt, activedReceiptDetails, getReceiptById, clearActivedReceipt } = useReceipt();

const isPaymentModalVisible = ref(false);

const tableId = computed(() => Number(route.params.tableId));
const receiptCode = computed(() => activedReceipt.value?.receiptCode || '');
// Search and selection state
const searchQuery = ref('');
const searchResults = ref<any[]>([]);
const isSearching = ref(false);

interface SelectedProduct {
    productId: number;
    productName: string;
    productTypeName: string;
    price: number;
    quantity: number;
    note: string;
}

const selectedProducts = ref<SelectedProduct[]>([]);

onMounted(async () => {
    if (tableId.value) {
        clearActivedReceipt();
        await getTableWithReceipts(tableId.value);
        await loadActiveReceipt();
    }
});

async function loadActiveReceipt() {
    const receipts = tableWithReceipts.value?.receipts || [];
    const activeReceiptFromTable = receipts.filter((x) => x.status === ReceiptStatus.Serving)[receipts.length - 1] || receipts[receipts.length - 1];
    if (activeReceiptFromTable) {
        await getReceiptById(activeReceiptFromTable.id);
        if (activedReceiptDetails.value) {
            selectedProducts.value = activedReceiptDetails.value.map((d: any) => ({
                productId: d.productId,
                productName: d.productName,
                productTypeName: '',
                price: d.unitPrice || d.price || 0,
                quantity: d.quantity,
                note: ''
            }));
        } else {
            selectedProducts.value = [];
        }
    } else {
        selectedProducts.value = [];
    }
}

async function onSearchInput() {
    if (!searchQuery.value.trim()) {
        searchResults.value = [];
        return;
    }
    isSearching.value = true;
    try {
        const result = await getProductBySearchTerm(searchQuery.value, 1, 10);
        if (result.isSuccess && result.value) {
            searchResults.value = result.value.items;
        } else {
            searchResults.value = [];
        }
    } catch (error) {
        console.error('Failed to search products:', error);
    } finally {
        isSearching.value = false;
    }
}

function selectProduct(product: any) {
    const existing = selectedProducts.value.find((p) => p.productId === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        selectedProducts.value.push({
            productId: product.id,
            productName: product.name,
            productTypeName: product.productTypeName || 'Không phân loại',
            price: product.price,
            quantity: 1,
            note: ''
        });
    }
    searchQuery.value = '';
    searchResults.value = [];
}

function removeProduct(productId: number) {
    selectedProducts.value = selectedProducts.value.filter((p) => p.productId !== productId);
}

const totalSelectedPrice = computed(() => {
    return selectedProducts.value.reduce((sum, p) => sum + p.price * p.quantity, 0);
});

function mappingSelectedProductToReceiptDetails(receiptId: number): ReceiptDetailDto[] {
    return selectedProducts.value.map(
        (p): ReceiptDetailDto => ({
            id: 0,
            receiptId: receiptId,
            productId: p.productId,
            productName: p.productName,
            quantity: p.quantity,
            unitPrice: p.price
        })
    );
}
function goBack() {
    router.push({ name: 'booking' });
}

function getStatusLabel(status: number) {
    switch (status) {
        case 0:
            return 'Available';
        case 1:
            return 'Serving';
        case 2:
            return 'Billing';
        default:
            return 'Unknown';
    }
}

function getStatusSeverity(status: number) {
    switch (status) {
        case 0:
            return 'success';
        case 1:
            return 'info';
        case 2:
            return 'danger';
        default:
            return 'secondary';
    }
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

async function handleOrder() {
    if (selectedProducts.value.length === 0) return;

    const createReceiptCommand: CreateReceiptCommand = {
        totalAmount: totalSelectedPrice.value,
        tableId: tableId.value,
        status: ReceiptStatus.Serving,
        receiptDetails: selectedProducts.value.map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
            unitPrice: p.price
        }))
    };

    const updateStatusRequest = {
        status: 1 // TableStatus.Serving
    };

    loading.value = true;
    try {
        const [statusResult, receiptResult] = await Promise.all([tableService.updateStatus(tableId.value, updateStatusRequest), receiptService.create(createReceiptCommand)]);

        if (statusResult.isSuccess && receiptResult.isSuccess) {
            toast.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Gọi món thành công!',
                life: 3000
            });

            // Update table status in store
            if (tableWithReceipts.value) {
                tableWithReceipts.value.status = 1;
                const newReceipt: ReceiptDto = {
                    id: receiptResult.value || 0,
                    receiptCode: ``,
                    tableId: tableId.value,
                    totalAmount: totalSelectedPrice.value,
                    status: ReceiptStatus.Serving,
                    receiptDetails: [...mappingSelectedProductToReceiptDetails(receiptResult.value || 0)]
                };
                addReceiptToTableWithReceipts(newReceipt);
                updateLastReceiptId(receiptResult.value || 0);
            }
            const table = tableStore.tables.find((t) => t.id === tableId.value);
            if (table) {
                table.status = '1';
            }

            // Refresh table details from API
            await getTableWithReceipts(tableId.value);
            await loadActiveReceipt();
        } else {
            toast.add({
                severity: 'error',
                summary: 'Thất bại',
                detail: 'Có lỗi xảy ra khi cập nhật bàn hoặc tạo hóa đơn.',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Order creation error:', error);
        toast.add({
            severity: 'error',
            summary: 'Lỗi hệ thống',
            detail: 'Lỗi kết nối hoặc hệ thống.',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
}

function handlePayment() {
    isPaymentModalVisible.value = true;
}

async function onPaymentSuccess() {
    toast.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Thanh toán thành công!',
        life: 3000
    });
    // Reload table status and active receipt after payment success
    await getTableWithReceipts(tableId.value);
    await loadActiveReceipt();
}
</script>

<template>
    <div class="flex flex-col gap-4 p-2 md:p-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <Button icon="pi pi-arrow-left" severity="secondary" rounded outlined @click="goBack" />
                <h1 class="text-xl md:text-2xl font-bold text-surface-900 dark:text-surface-0">Chi tiết bàn ăn</h1>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center min-h-[300px]">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" fill="transparent" animationDuration=".5s" />
        </div>

        <!-- Content -->
        <div v-else-if="tableWithReceipts" class="grid grid-cols-12 gap-4">
            <!-- Top Section: Table Info & Add Product side-by-side on desktop, stacked on mobile -->
            <div class="col-span-12 md:col-span-4 flex">
                <!-- Table Info Card -->
                <Card class="w-full">
                    <template #title>
                        <span class="text-lg md:text-xl font-semibold">Thông tin bàn</span>
                    </template>
                    <template #content>
                        <div class="flex flex-col gap-3">
                            <div class="flex justify-between items-center py-2 border-b border-surface-200 dark:border-surface-700">
                                <span class="text-surface-600 dark:text-surface-400">Tên bàn:</span>
                                <span class="font-bold text-surface-900 dark:text-surface-0">{{ tableWithReceipts.name }}</span>
                            </div>
                            <div class="flex justify-between items-center py-2 border-b border-surface-200 dark:border-surface-700">
                                <span class="text-surface-600 dark:text-surface-400">Trạng thái:</span>
                                <Tag :severity="getStatusSeverity(tableWithReceipts.status)" :value="getStatusLabel(tableWithReceipts.status)"></Tag>
                            </div>
                            <div v-if="receiptCode.length" class="flex justify-between items-center py-2">
                                <span class="text-surface-600 dark:text-surface-400">Mã hóa đơn:</span>
                                <span class="font-mono text-surface-900 dark:text-surface-0">#{{ receiptCode }}</span>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>

            <div class="col-span-12 md:col-span-8 flex">
                <!-- Product Search Card -->
                <Card class="w-full">
                    <template #title>
                        <span class="text-lg md:text-xl font-semibold">Thêm món ăn</span>
                    </template>
                    <template #content>
                        <div class="flex flex-col gap-3 relative">
                            <label class="font-medium text-sm text-surface-600 dark:text-surface-400">Tìm kiếm món:</label>
                            <div class="relative w-full">
                                <span class="w-full">
                                    <InputText v-model="searchQuery" @input="onSearchInput" placeholder="Nhập tên sản phẩm để tìm kiếm..." class="w-full pl-10" />
                                </span>

                                <!-- Floating Search Results -->
                                <div v-if="searchResults.length > 0" class="absolute left-0 right-0 z-50 mt-1 bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg shadow-lg max-h-[250px] overflow-y-auto">
                                    <div
                                        v-for="product in searchResults"
                                        :key="product.id"
                                        class="flex justify-between items-center p-3 hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer border-b border-surface-100 dark:border-surface-800 last:border-none"
                                        @click="selectProduct(product)"
                                    >
                                        <div class="flex flex-col">
                                            <span class="font-bold text-sm text-surface-900 dark:text-surface-0">{{ product.name }}</span>
                                            <span class="text-xs text-surface-500">{{ product.productTypeName || 'Không phân loại' }}</span>
                                        </div>
                                        <span class="font-bold text-sm text-primary">{{ formatCurrency(product.price) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>

            <!-- Bottom Section: Selected Products (Full Width) -->
            <div class="col-span-12">
                <Card class="w-full">
                    <template #title>
                        <span class="text-lg md:text-xl font-semibold">Các món đã chọn</span>
                    </template>
                    <template #content>
                        <div v-if="selectedProducts.length === 0" class="text-center py-12 text-surface-500">Chưa chọn món nào. Hãy tìm kiếm và chọn món ở trên.</div>
                        <div v-else class="flex flex-col gap-4">
                            <!-- Items list -->
                            <div class="flex flex-col gap-3 max-h-[450px] overflow-y-auto pr-1">
                                <div
                                    v-for="item in selectedProducts"
                                    :key="item.productId"
                                    class="p-3 md:p-4 border border-surface-200 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-800 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4"
                                >
                                    <!-- Name & Type -->
                                    <div class="col-span-12 md:col-span-4">
                                        <span class="font-bold text-surface-900 dark:text-surface-0 text-sm md:text-base block mb-0.5">{{ item.productName }}</span>
                                        <span class="text-xs text-surface-500 block">{{ item.productTypeName }}</span>
                                    </div>

                                    <!-- Note -->
                                    <div class="col-span-12 md:col-span-4">
                                        <InputText v-model="item.note" placeholder="Ghi chú thêm..." class="w-full text-xs p-2" />
                                    </div>

                                    <!-- Price & Quantity & Delete -->
                                    <div class="col-span-12 md:col-span-4 flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-surface-200 dark:border-surface-700 pt-3 md:pt-0">
                                        <div class="text-right min-w-[70px]">
                                            <span class="text-xs text-surface-500 block md:hidden">Đơn giá:</span>
                                            <span class="font-semibold text-sm text-primary">{{ formatCurrency(item.price) }}</span>
                                        </div>
                                        <div class="flex items-center gap-4">
                                            <InputNumber v-model="item.quantity" showButtons buttonLayout="horizontal" :min="1" class="w-32" inputClass="w-8 text-center text-sm p-1" incrementButtonClass="p-1" decrementButtonClass="p-1" />
                                            <Button icon="pi pi-trash" severity="danger" rounded @click="removeProduct(item.productId)" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Summary and Actions -->
                            <div class="border-t border-surface-200 dark:border-surface-700 pt-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                <div class="flex gap-2 items-baseline">
                                    <span class="text-surface-600 dark:text-surface-400 font-medium text-sm md:text-base">Tổng cộng tiền món mới:</span>
                                    <span class="text-green-600 dark:text-green-400 font-bold text-xl md:text-2xl">{{ formatCurrency(totalSelectedPrice) }}</span>
                                </div>

                                <div class="flex gap-3 justify-end">
                                    <Button v-if="selectedProducts.length > 0" label="Gọi món" :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-send'" severity="info" class="text-sm px-5 py-2.5" @click="handleOrder" />
                                    <Button v-if="tableWithReceipts.status === 1" label="Thanh toán" icon="pi pi-credit-card" severity="success" class="text-sm px-5 py-2.5" @click="handlePayment" />
                                </div>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
        </div>

        <!-- Error / Not Found -->
        <div v-else class="text-center py-8">
            <span class="text-lg text-red-500">Không tìm thấy thông tin bàn ăn hoặc có lỗi xảy ra.</span>
        </div>

        <!-- Payment Dialog -->
        <PaymentModal v-model:visible="isPaymentModalVisible" @success="onPaymentSuccess" />
    </div>
</template>
