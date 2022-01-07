export function isEmpty(str: string | undefined): boolean {
    return str === null || str === undefined || str.length === 0 || str.trim().length === 0
}