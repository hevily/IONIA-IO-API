const jsonRpcError = require('./jsonRpcError');

class JsonRpc {
    constructor() {
        this.methods = {};
    }

    registMethod(methodName, func) {
        this.methods[methodName] = func;
    }

    app() {
        return async (ctx, next) => {
            const contentType = ctx.request.header['content-type'].toLowerCase();
            const requestBody = ctx.request.body;
            const response = {
                jsonrpc: requestBody.jsonrpc,
                id: requestBody.id
            };
            ctx.body = response;
            
            if(this.isInvalidRequest(ctx.request.method, contentType, requestBody)) {
                this.handleError('Invalid Request', ctx.request.header, requestBody);
                response.error = jsonRpcError.InvalidRequest;
                return;
            }
            
            const method = this.methods[requestBody.method];

            if(method === undefined) {
                this.handleError('Method not found', ctx.request.header, requestBody);
                response.error = jsonRpcError.MethodNotFound;
                return;
            }

            try {
                if(['register', 'login', 'logout'].indexOf(requestBody.method) > -1) {
                    response.result = await method(ctx, requestBody.params);
                }
                else {
                    response.result = await method(requestBody.params);
                }

                if(response.result === undefined) {
                    response.result = null;
                }
            }catch(error) {
                this.handleError(error, ctx.request.header, requestBody);
                response.error = jsonRpcError.InternalError;
            }
        };
    }

    isInvalidRequest(httpMethod, contentType, requestBody) {
        return requestBody.jsonrpc !== '2.0' ||
               httpMethod !== 'POST' ||
               [undefined, ''].indexOf(requestBody.method) > -1 ||
               [undefined, ''].indexOf(requestBody.id) > -1;
    }

    // default error handler
    async handleError(error, requestHeader, requestBody) {
        console.log(error);
    }
}

module.exports = new JsonRpc();