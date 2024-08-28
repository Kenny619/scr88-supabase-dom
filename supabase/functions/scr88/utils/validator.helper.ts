import { $url } from "jsr:@showichiro/validators";

export function isUrl(url: string): boolean {
    return $url(url);
}

export async function isUrlAlive(url: string): Promise<boolean> {
    try {
        const res = await fetch(url);
        return res.ok;
    } catch (_) {
        return false;
    }
}

export function isRegex(regex: string): boolean {
    try {
        const _ = new RegExp(regex);
        return true;
    } catch (_) {
        return false;
    }
}
