const InvalidRequest = {
    code: -32600,
    message: 'Invalid Request'
};

const ParseError = {
    code: -32700,
    message: 'Parse error'
};

const MethodNotFound = {
    code: -32601,
    message: 'Method not found'
};

const InvalidParams = {
    code: -32602,
    message: 'Invalid params'
};

const InternalError = {
    code: -32603,
    message: 'Internal error'
};

module.exports = {
    InvalidRequest,
    ParseError,
    MethodNotFound,
    InvalidParams,
    InternalError
}