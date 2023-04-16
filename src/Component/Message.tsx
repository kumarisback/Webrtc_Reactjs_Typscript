export class Message {
    id: number;
    username: string;
    message: string;
    offer: {
        type: string;
        sdp: string;
    };

    constructor(id: number, username: string, message: string, type: string, sdp: string) {
        this.id = id;
        this.username = username;
        this.message = message;
        this.offer = { type, sdp };
    }
}
