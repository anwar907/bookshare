export function getTokenExpiration(hours: number = 24): Date {
    const now = new Date();
    return new Date(now.getTime() + (hours * 60 * 60 * 1000));
}

export function isTokenExpired(expireAt: Date): boolean {
    return new Date() > expireAt;
}