### 1. Overall Folder Structure

The architecture below is designed using a **Feature-based** approach combined with **Layered Architecture**, ensuring the source code scales elegantly as the project grows.

```text
src/
├── assets/             # Global static assets (images, fonts, global css)
├── components/         # Global/Shared UI components
│   ├── base/           # Base components (wrappers of PrimeVue + Tailwind)
│   └── common/         # Complex shared components (Header, Footer, Sidebar)
├── composables/        # Reusable Vue composition logic (hooks)
├── config/             # Environment, PrimeVue, and Tailwind configurations
├── constants/          # Application-wide constants and enums
├── layouts/            # Page layout components (Default, Auth, Dashboard)
├── plugins/            # Vue plugins initialization (i18n, custom directives)
├── router/             # Vue Router configuration and navigation guards
├── services/           # API services using Axios
├── stores/             # Global state management using Pinia
├── types/              # TypeScript interfaces/types (if using TS)
├── utils/              # Pure utility functions (helpers, formatters)
├── views/              # Page components, grouped by feature domains
│   ├── auth/
│   ├── dashboard/
│   └── users/
├── App.vue             # Root component
└── main.ts/.js         # Application entry point

```

---

### 2. Directory Functions and Specific Examples

- **`assets/`**: Contains raw, unprocessed static assets.
- _Example:_ `assets/css/tailwind.css` (Tailwind entry point), `assets/images/logo.png`.

- **`composables/`**: Houses shared custom hooks, extracting logic away from the UI.
- _Example:_ `useAuth.ts`, `useWindowSize.ts`.

- **`services/`**: The communication layer with the Backend. Abstracting Axios away from components makes data mocking and interceptor management much easier.
- _Example:_ `apiClient.ts` (Axios interceptor setup), `services/userService.ts` (API call functions like `fetchUsers()`).

- **`stores/`**: Contains Pinia stores for global state management. Each major feature domain should have its own store.
- _Example:_ `stores/authStore.ts`, `stores/cartStore.ts`.

- **`utils/`**: Pure functions for minor logic handling, completely decoupled from Vue's reactivity.
- _Example:_ `formatDate.ts`, `currencyHelper.ts`.

- **`layouts/`**: The structural skeletons of the web app. Views will be rendered inside the `<router-view>` of a Layout.
- _Example:_ `AppLayout.vue` (contains Header, Sidebar), `AuthLayout.vue` (contains only a centered form on a blank screen).

---

### 3. Component Organization Strategy (Shared vs. View-Specific)

The core principle here is: **"Do not dump everything into the `src/components/` folder."** If a component is exclusively used by a single screen, it must reside within that screen's specific directory.

#### A. Shared Components

Located in `src/components/`. These are utilized across multiple views or layouts.

- `src/components/base/`: Contains foundational components, typically customized from PrimeVue combined with Tailwind to create a unique design system. (Example: `BaseButton.vue`, `BaseInput.vue`).
- `src/components/common/`: Contains more complex components built by composing several base components together. (Example: `AppConfirmationModal.vue`, `GlobalNotification.vue`).

#### B. View-Specific Components

Located directly within the feature/view's directory at `src/views/[FeatureName]/components/`.

- _Example:_ You have a Dashboard page containing a revenue chart. This chart is not used anywhere else except on the Dashboard.

```text
src/views/
└── dashboard/
    ├── components/
    │   ├── RevenueChart.vue     # Used exclusively for the Dashboard
    │   └── RecentActivity.vue   # Used exclusively for the Dashboard
    └── DashboardView.vue        # Main component, imports the children above

```

````

---

### 4. Anatomy of a "Base Component"

For large-scale projects, a Base Component should not merely be a single `.vue` file. It should be encapsulated within a directory to hold its documentation, unit tests, and type definitions.

**Folder structure of a Base Component:**
```text
src/components/base/BaseButton/
├── BaseButton.vue          # Component file
├── BaseButton.spec.ts      # Unit tests
├── index.ts                # Entry point for easy exporting
└── types.ts                # Types/Interfaces definitions

````

#### Code Example (Using `<script setup>`):

**1. `types.ts**`

```typescript
// Define interfaces for component props
export interface BaseButtonProps {
    label: string;
    severity?: 'primary' | 'secondary' | 'danger';
    isLoading?: boolean;
}
```

**2. `BaseButton.vue**`

```vue
<template>
    <!-- 
    Wrapping PrimeVue Button.
    Using Tailwind CSS for custom styling while keeping PrimeVue's functionality. 
  -->
    <Button :label="label" :loading="isLoading" :class="computedClasses" @click="handleClick">
        <!-- Expose slots for custom content if needed -->
        <template #icon>
            <slot name="icon"></slot>
        </template>
    </Button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Button from 'primevue/button';
import type { BaseButtonProps } from './types';

// Define props with default values
const props = withDefaults(defineProps<BaseButtonProps>(), {
    severity: 'primary',
    isLoading: false
});

// Define emits
const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void;
}>();

// Compute dynamic Tailwind classes based on severity prop
const computedClasses = computed(() => {
    const baseClasses = 'font-bold rounded-lg transition-colors duration-200';

    const severityClasses: Record<string, string> = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        danger: 'bg-red-500 hover:bg-red-600 text-white'
    };

    return `${baseClasses} ${severityClasses[props.severity]}`;
});

// Handle button click event
const handleClick = (event: MouseEvent) => {
    if (!props.isLoading) {
        emit('click', event);
    }
};
</script>
```

**3. `BaseButton.spec.ts` (Unit Test)**

```typescript
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseButton from './BaseButton.vue';

describe('BaseButton.vue', () => {
    it('renders the label correctly', () => {
        // Mount the component with a test label
        const wrapper = mount(BaseButton, {
            props: {
                label: 'Submit'
            }
        });

        // Assert that the text is rendered
        expect(wrapper.text()).toContain('Submit');
    });

    it('emits click event when not loading', async () => {
        // Mount the component
        const wrapper = mount(BaseButton, {
            props: { label: 'Click Me' }
        });

        // Trigger click
        await wrapper.trigger('click');

        // Assert that click event was emitted
        expect(wrapper.emitted()).toHaveProperty('click');
    });
});
```

**4. `index.ts**`

```typescript
// Export the component as default for easy import
export { default as BaseButton } from './BaseButton.vue';
// Export types for consumers
export * from './types';
```
