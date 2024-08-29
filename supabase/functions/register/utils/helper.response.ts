export const resResult = <T>(result: T) => {
    return {
        result,
        err: null,
    };
};

export const resError = (err: string) => {
    return {
        result: null,
        err,
    };
};
