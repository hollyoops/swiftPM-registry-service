import { Response } from 'node-fetch'

export class HTTPResponseError extends Error {
    status: number

    constructor(response: Response) {
        const msg = `HTTP Error Response: ${response.statusText}`
        super(msg)
        this.message = msg
        this.status = response.status
    }
}
