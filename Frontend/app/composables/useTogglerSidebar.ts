import { ref } from "vue";

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

export const useToggleSidebar = () => {
    return {
        isSidebarOpen,
        toggleSidebar,
    };
};