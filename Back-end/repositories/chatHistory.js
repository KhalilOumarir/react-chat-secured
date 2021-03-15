const repo = require("./repository");

class chatHistory extends repo {


    async createRoom(roomName) {
        const records = await this.getAll();
        records[roomName] = [];
        await this.writeAll(records);
    }


    async addMessage(room, message, username) {
        let records = await this.getAll();
        const record = Object.keys(records).length;

        let messageWithUser = `${username}: ${message}`;
        if (!record) {
            await this.createRoom(room);
            //update the records again because we just created a new object

            records = await this.getAll();
            records[room].push(messageWithUser);
            await this.writeAll(records);
        } else {
            //add the message into the room array and save
            records[room].push(messageWithUser);
            await this.writeAll(records);
        }
    }

    async getMessages(room) {
        let records = await this.getAll();
        let messages = [];
        if (records[room]) {
            let messagesLength = records[room].length;
            //show only 30 messages 
            for (let x = 20; x > 0; x--) {
                if (records[room][(messagesLength - (x - 1)) - 1]) {
                    messages.push(records[room][(messagesLength - (x - 1)) - 1]);
                }

            }

            return messages;
        } else {
            await this.createRoom(room);
            records = await this.getAll();
            return records[room];
        }
    }



}


module.exports = new chatHistory("chat-history.json", "{}");