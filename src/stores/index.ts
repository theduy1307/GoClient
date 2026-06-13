import { createPinia, storeToRefs } from 'pinia';

const pinia = createPinia();

export { pinia, storeToRefs };
export * from './employee';
export default pinia;
