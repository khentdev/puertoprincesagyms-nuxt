import { useStorage } from "@vueuse/core";
import gymsJson from "../data/gyms.json";
import type { Barangays, GymV2, SortOption } from "./";

const DEFAULT_SORT: SortOption = {
    label: "Name (A-Z)",
    key: "name",
    order: "asc",
}

export const useGymStore = defineStore("gymStore", () => {
    const gyms = ref<GymV2[]>(gymsJson.gyms as GymV2[])

    const selectedBarangay = useCookie<Barangays>("selectedBarangay", {
        default: () => "All Locations",
    })
    const setSelectedBarangay = (barangay: Barangays) => {
        selectedBarangay.value = barangay
    }
    const getGymCountsInBarangay = computed(() =>
        gyms.value.filter((gym) => gym.barangay === selectedBarangay.value).length
    )

    const allGymCount = computed(() => gyms.value.length);

    const MAX_CACHE_SIZE = 50
    const sortedCache = new Map<string, GymV2[]>()
    const filteredGyms = computed(() => {
        const sort = selectedSort.value ?? DEFAULT_SORT
        const cacheKey = `${selectedBarangay.value}-${sort.key}-${sort.order}`
        if (sortedCache.has(cacheKey))
            return sortedCache.get(cacheKey)

        const gymsToSort = selectedBarangay.value === "All Locations" ? gyms.value : gyms.value.filter((gym) => gym.barangay === selectedBarangay.value)
        const sortedGyms = [...gymsToSort].sort((a, b) => {
            const keyA = a[sort.key]
            const keyB = b[sort.key]
            if (keyA < keyB) return sort.order === "asc" ? -1 : 1
            if (keyA > keyB) return sort.order === "asc" ? 1 : -1
            return 0
        })

        if (sortedCache.size >= MAX_CACHE_SIZE) {
            const firstKey = sortedCache.keys().next().value!
            sortedCache.delete(firstKey)
        }
        sortedCache.set(cacheKey, sortedGyms)
        return sortedGyms
    })

    const selectedGym = ref<GymV2 | null>(null)
    const setSelectedGym = ({ id }: { id: string }) => {
        selectedGym.value = gyms.value.find((gym) => gym.id === id) || null
    }

    const closeSelectedGym = () => {
        selectedGym.value = null
    }

    const selectedSort = useCookie<SortOption>("selectedSort", {
        default: () => DEFAULT_SORT,
    })
    const setSelectedSort = (sort: SortOption) => {
        selectedSort.value = sort
    }

    return {
        gyms,
        selectedBarangay,
        setSelectedBarangay,
        filteredGyms,
        getGymCountsInBarangay,
        selectedGym,
        setSelectedGym,
        closeSelectedGym,
        selectedSort,
        setSelectedSort,
        allGymCount,
    }
})