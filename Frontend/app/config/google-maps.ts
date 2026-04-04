
export const MAPS_CONFIG = () => {
    const config = useRuntimeConfig();
    return {
        apiKey: config.public.googleMapsApiKey,
        staticMap: {
            baseUrl: "https://maps.googleapis.com/maps/api/staticmap",
            defaultZoom: 17,
            defaultSize: { width: 700, height: 700 },
            markerColor: "0x2f855a",
        },
    }
};