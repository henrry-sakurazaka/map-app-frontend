export interface User {
    id: number;
    name: string;
    email: string;
    provider?: string;
    uid?: string;
    image_url?: string;
}