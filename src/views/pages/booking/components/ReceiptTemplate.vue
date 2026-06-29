<script setup lang="ts">
import { useReceipt } from '@/composables/useReceipt';
import { Divider } from 'primevue';
import QrcodeVue from 'qrcode.vue';
import { computed } from 'vue';

// Use the useReceipt composable to get active receipt info
const { activedReceipt, activedReceiptDetails } = useReceipt();

// Get current date and time
const currentDateTime = computed(() => {
    const now = new Date();
    return now.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
});

// Format currency in VND
const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) return '0 đ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// QR code data
const qrValue = '00020101021138580010A000000727012800069704070114190730309640100208QRIBFTTA53037045802VN830084006304A148';

// Print function
const printReceipt = () => {
    window.print();
};
</script>

<template>
    <div class="receipt-container">
        <!-- Receipt Paper Sheet representation -->
        <div class="receipt-paper">
            <!-- Header -->
            <div class="receipt-header">
                <h2 class="store-name">TRƯỜNG HUY QUÁN</h2>
                <div class="store-info">
                    <p>ĐC: 92 Nguyễn Du, phường Thuận An, TP.HCM</p>
                    <p>ĐT: 0353 603 631</p>
                </div>
            </div>

            <hr class="receipt-divider" />

            <!-- Receipt Meta Info -->
            <div class="receipt-meta">
                <div class="meta-row">
                    <span>Mã hóa đơn:</span>
                    <span class="font-bold">#{{ activedReceipt?.receiptCode || 'N/A' }}</span>
                </div>
                <div class="meta-row">
                    <span>Ngày giờ:</span>
                    <span>{{ currentDateTime }}</span>
                </div>
            </div>

            <hr class="receipt-divider" />

            <!-- Items Table -->
            <div class="receipt-items">
                <!-- Table Header -->
                <div class="table-header">
                    <div class="col-name">Tên sản phẩm</div>
                    <div class="col-qty">SL</div>
                    <div class="col-total">Tổng tiền</div>
                </div>

                <!-- Table Rows -->
                <div v-if="activedReceiptDetails && activedReceiptDetails.length > 0">
                    <div v-for="item in activedReceiptDetails" :key="item.id" class="table-row">
                        <div class="col-name product-name">{{ item.productName }}</div>
                        <div class="col-qty">{{ item.quantity }}</div>
                        <div class="col-total font-semibold">{{ formatCurrency(item.quantity * item.unitPrice) }}</div>
                    </div>
                </div>
                <div v-else class="no-items">Chưa có sản phẩm nào</div>
            </div>

            <hr class="receipt-divider" />

            <!-- Total Amount -->
            <div class="receipt-total">
                <span class="total-label">Tổng cộng:</span>
                <span class="total-value">{{ formatCurrency(activedReceipt?.totalAmount) }}</span>
            </div>

            <hr class="receipt-divider" />

            <!-- QR Code Payment & Footer Info -->
            <div class="receipt-footer">
                <div class="qr-code-wrapper">
                    <qrcode-vue :value="qrValue" :size="130" level="M" render-as="canvas" />
                </div>
                <p class="bank-info">TRAN THE DUY - TECHCOMBANK</p>
                <hr class="receipt-divider" />
                <p class="thank-you-msg">Cảm ơn quý khách - Hẹn gặp lại</p>
            </div>
        </div>

        <!-- Print Action Button (Hidden during print) -->
        <div class="text-center mt-4 no-print">
            <button class="print-btn" @click="printReceipt">
                <i class="pi pi-print mr-2"></i> In hóa đơn
            </button>
        </div>
    </div>
</template>

<style scoped>
.receipt-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
}

.receipt-paper {
    font-family: 'Courier New', Courier, monospace;
    background-color: #fff;
    color: #000;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.receipt-header {
    text-align: center;
    margin-bottom: 12px;
}

.store-name {
    font-weight: bold;
    font-size: 18px;
    margin: 0 0 6px 0;
    letter-spacing: 0.5px;
}

.store-info p {
    margin: 2px 0;
    font-size: 12px;
    color: #555;
}

.receipt-divider {
    border: none;
    border-top: 1px dashed #bbb;
    margin: 12px 0;
}

.receipt-meta {
    font-size: 13px;
}

.meta-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
}

.font-bold {
    font-weight: bold;
}

.receipt-items {
    font-size: 13px;
}

.table-header {
    display: flex;
    font-weight: bold;
    margin-bottom: 8px;
    border-bottom: 1px solid #eee;
    padding-bottom: 4px;
}

.table-row {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    line-height: 1.4;
}

.col-name {
    width: 55%;
    text-align: left;
}

.col-qty {
    width: 15%;
    text-align: center;
}

.col-total {
    width: 30%;
    text-align: right;
}

.product-name {
    word-break: break-word;
}

.font-semibold {
    font-weight: 600;
}

.no-items {
    text-align: center;
    color: #888;
    padding: 15px 0;
}

.receipt-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
}

.total-label {
    font-size: 14px;
    font-weight: bold;
}

.total-value {
    font-size: 18px;
    font-weight: bold;
}

.receipt-footer {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.qr-code-wrapper {
    background-color: #fff;
    padding: 6px;
    border: 1px solid #eee;
    border-radius: 4px;
    display: inline-block;
    margin-bottom: 8px;
}

.bank-info {
    margin: 4px 0;
    font-weight: bold;
    font-size: 12px;
    letter-spacing: 0.5px;
}

.thank-you-msg {
    margin: 8px 0 0 0;
    font-size: 12px;
    font-style: italic;
    font-weight: 600;
}

.print-btn {
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 24px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.2s;
}

.print-btn:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    background-color: #2563eb;
}

.print-btn i {
    margin-right: 6px;
}

/* Print specific styles */
@page {
    size: 80mm auto; /* Standard K80 thermal paper width */
    margin: 0;       /* Removes browser header/footer and page margins */
}

@media print {
    html, body, .receipt-container, .receipt-paper {
        height: auto !important;
        min-height: 0 !important;
        max-height: none !important;
    }

    body {
        margin: 0;
        padding: 0;
        background: #fff;
    }
    
    .receipt-container {
        width: 100%;
        max-width: 100%;
        padding: 0 !important;
        margin: 0 !important;
    }

    .receipt-paper {
        width: 100% !important;
        max-width: 100% !important;
        border: none !important;
        box-shadow: none !important;
        padding: 8px !important;
        margin: 0 !important;
        border-radius: 0 !important;
    }
    
    .no-print {
        display: none !important;
    }
}
</style>
