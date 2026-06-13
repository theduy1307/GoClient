<script setup lang="ts">
import { onMounted } from 'vue';
import Toast from 'primevue/toast';
import { ACCESS_TOKEN_KEY } from '@/constants/auth';
import { useEmployee } from '@/composables/useEmployee';

const { fetchMe } = useEmployee();

onMounted(async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
        try {
            await fetchMe();
        } catch (error) {
            console.error('Error loading employee info:', error);
        }
    }
});
</script>

<template>
    <router-view />
    <Toast />
</template>

<style scoped></style>
