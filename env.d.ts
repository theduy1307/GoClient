/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module 'primevue/toasteventbus' {
    const ToastEventBus: {
        on(type: string, handler: (event: any) => void): void;
        off(type: string, handler: (event: any) => void): void;
        emit(type: string, event?: any): void;
    };
    export default ToastEventBus;
}

