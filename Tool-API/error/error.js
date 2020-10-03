module.exports = class ErrorHandler {
    sendError(res, code, message) {
        res.send({
            error: {
                code: code,
                message: message
            }
        });
    }

    sendEmptyBodyError(res) {
        this.sendError(res, 400, 'No body');
    }

    sendNoParameterError(res, parameterName) {
        this.sendError(res,
            400,
            `Body has no parameter \'${parameterName}\'`);
    }
}
