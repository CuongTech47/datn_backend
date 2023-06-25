'use strict'

const StatusCode = {
    FORBIDDEN : 403,
    CONFLICT : 409
}


const ReasonStatusCode = {
    FORBIDDEN : 'BAD REQUEST ERROR',
    CONFLICT : 'CONFLICT ERROR'
}

const {
    StatusCodes,
    ReasonPhrases
} = require('../utils/httpStatusCode')


class ErrorResponse extends Error {
    constructor(message , status) {
        super(message)
        this.status = status
    }
}


class ConflictRequestError extends ErrorResponse {
    constructor(message , statusCode) {
        super(message,statusCode)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT , statusCode = StatusCode.FORBIDDEN) {
        super(message , statusCode)
    }
}


class AuthFailureError extends ErrorResponse {
    constructor( message = ReasonPhrases.UNAUTHORIZED , statusCode = StatusCodes.UNAUTHORIZED) {
        super(message , statusCode)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError
}