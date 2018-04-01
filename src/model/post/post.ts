export interface Post {
    key?: string;
    weather: {
        max: number,
        min: number
    };
    country: string;
    city: string;
    feel: string;
}