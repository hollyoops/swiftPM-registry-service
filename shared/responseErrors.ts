import { Response } from 'node-fetch'

export class HTTPResponseError extends Error {
    constructor(response: Response) {
        const msg = `HTTP Error Response: ${response.status} ${response.statusText}`
        super(msg)
        this.message = msg
    }
}
