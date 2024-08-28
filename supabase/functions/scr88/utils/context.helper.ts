export function result<T>(result: T) {
    return { result: result as T, err: null };
}

export function err(err: string) {
    return { result: null, err: err };
}
