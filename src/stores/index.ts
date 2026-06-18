import { createPinia, storeToRefs } from 'pinia';

const pinia = createPinia();

export { pinia, storeToRefs };
export * from './employee';
export * from './table';
export * from './product';
export default pinia;
