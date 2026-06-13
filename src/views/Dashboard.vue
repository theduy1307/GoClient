<script setup lang="ts">
import BestSellingWidget from '@/components/common/dashboard/BestSellingWidget.vue';
import NotificationsWidget from '@/components/common/dashboard/NotificationsWidget.vue';
import RecentSalesWidget from '@/components/common/dashboard/RecentSalesWidget.vue';
import RevenueStreamWidget from '@/components/common/dashboard/RevenueStreamWidget.vue';
import StatsWidget from '@/components/common/dashboard/StatsWidget.vue';
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <StatsWidget />

        <div class="col-span-12 xl:col-span-6">
            <RecentSalesWidget />
            <BestSellingWidget />
        </div>
        <div class="col-span-12 xl:col-span-6">
            <RevenueStreamWidget />
            <NotificationsWidget />
        </div>
    </div>
</template>
