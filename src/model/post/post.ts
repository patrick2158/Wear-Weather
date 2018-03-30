export interface Post {
    key?: string;
    weather: {
        max: number,
        min: number
    };
    city: string;
    feel: string;
}