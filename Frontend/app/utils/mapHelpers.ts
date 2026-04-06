import type { GymV2 } from "../store"

export interface StaticMapOptions {
    width?: number
    height?: number
    zoom?: number
    markerColor?: string
    scale?: 1 | 2
    maptype?: "roadmap" | "satellite" | "terrain" | "hybrid"
}
export function generateStaticMapUrl(
    gym: GymV2,
    options: StaticMapOptions = {}
): string {
    const { staticMap, apiKey } = MAPS_CONFIG()
    const {
        width = staticMap.defaultSize.width,
        height = staticMap.defaultSize.height,
        zoom = staticMap.defaultZoom,
        markerColor = staticMap.markerColor,
        scale = 2,
        maptype = "hybrid",
    } = options

    const { lat, lng } = gym.location
    const markerLabel = encodeURIComponent(gym.name.charAt(0).toUpperCase())

    const params = new URLSearchParams({
        center: `${lat},${lng}`,
        zoom: zoom.toString(),
        size: `${width}x${height}`,
        maptype,
        markers: `color:${markerColor}|label:${markerLabel}|${lat},${lng}`,
        scale: scale.toString(),
        key: apiKey,
    })

    return `${staticMap.baseUrl}?${params.toString()}`
}

export function generateEmbedMapUrl(gym: GymV2): string {
    const { lat, lng } = gym.location
    return `https://maps.google.com/maps?q=${lat},${lng}&z=16&t=h&output=embed`
}
