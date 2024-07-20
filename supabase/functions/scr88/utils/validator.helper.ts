import { $regexp, $url } from "jsr:@showichiro/validators";
export function isUrl(
    url: string,
) {
    return $url(url);
}
export async function isUrlAlive(url: string) {
    const res = await fetch(url);
    return res.status === 200;
}
