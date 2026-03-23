export interface Gym {
    id: string
    name: string
    barangay: ValidBarangays
    address: string
    location: {
        lat: number
        lng: number
    }
    profile_image: string
    images: readonly string[]
    map_link: string
}

export interface GymV2 extends Gym {
    gym_description?: string
    opening_hours?: readonly {
        readonly day: string
        readonly time: string
        readonly close: string
    }[]
    social_links?: readonly {
        readonly name: string
        readonly link: string
    }[]
    contact_info?: {
        readonly phone?: string
        readonly email?: string
    }
}

export const BARANGAYS =
    ["All Locations", "San Pedro", "Manggahan", "San Miguel", "Maunlad",
        "San Manuel", "Santa Monica", "San Jose", "Tagumpay", "Tiniguiban",
        "Sicsican"] as const;

export type Barangays = typeof BARANGAYS[number];
export type ValidBarangays = Exclude<Barangays, "All Locations">;

export interface GymCardData {
    id: string;
    name: string;
    profile_image: string;
    barangay: ValidBarangays;
    address: string;
}
export interface GymDetailsModalData {
    gym: GymV2
}

export type SortKey = "name" | "barangay"
export type SortOrder = "asc" | "desc"
export type SortOption = {
    label: string
    key: SortKey
    order: SortOrder
}