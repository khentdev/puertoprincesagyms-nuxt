import type { ValidBarangays } from "../store/index"
import type { StaticMapOptions } from "../utils/mapHelpers"

export const BARANGAY_MAP_OPTIONS: Record<ValidBarangays, StaticMapOptions> = {
    Maunlad: {
        zoom: 18,
        maptype: "hybrid",
        markerColor: "red",
        scale: 2,
    },
    "San Miguel": {
        zoom: 17,
        maptype: "hybrid",
        markerColor: "red",
        scale: 2,
    },
    "San Pedro": {
        zoom: 16,
        maptype: "hybrid",
        markerColor: "red",
        scale: 2,
    },
    "San Manuel": {
        zoom: 18,
        maptype: "hybrid",
        markerColor: "red",
        scale: 2,
    },
    "Santa Monica": {
        zoom: 17,
        maptype: "hybrid",
        markerColor: "red",
        scale: 2,
    },
    "San Jose": {
        zoom: 17,
        maptype: "hybrid",
        markerColor: "red",
        scale: 2,
    },
    Tagumpay: {
        zoom: 17,
        maptype: "hybrid",
        markerColor: "red",
        scale: 2,
    },
    Tiniguiban: {
        zoom: 17,
        maptype: "hybrid",
        markerColor: "red",
        scale: 2,
    },
    Sicsican: {
        zoom: 17,
        maptype: "hybrid",
        markerColor: "red",
        scale: 2,
    }
}

export const getBarangayMapOptions = (barangay: ValidBarangays): StaticMapOptions =>
    BARANGAY_MAP_OPTIONS[barangay] || {}