import { createClient } from "@sanity/client";

export const sanityClient = createClient({
    projectId: import.meta.env.VITE_SANITY_ID,
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: false,
});
