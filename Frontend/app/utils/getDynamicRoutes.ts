import { gyms } from "../data/gyms.json"
import titleCaseToKebab from "../utils/titleCaseToKebab"

export default function getDynamicRoutes() {
    const uniqueBarangays = [...new Set(gyms.map(gym => gym.barangay))]

    const barangayRoutes = uniqueBarangays.map(brgy => `/gyms/barangay/${titleCaseToKebab(brgy)}`)

    const gymRoutes = gyms.map(gym => `/gyms/barangay/${titleCaseToKebab(gym.barangay)}/${titleCaseToKebab(gym.name)}`)

    return ["/gyms", ...barangayRoutes, ...gymRoutes]
}
