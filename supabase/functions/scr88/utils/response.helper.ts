const createResponse = (
    pass: boolean,
    msg: string,
    status: number,
): Response => {
    const resBody = pass
        ? JSON.stringify({ pass: pass, result: msg })
        : JSON.stringify({ pass: pass, errMsg: msg });
    return new Response(resBody, { status: status });
};

export default createResponse;
