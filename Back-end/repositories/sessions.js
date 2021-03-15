const repository = require("./repository");

class sessionsDB extends repository {

    async addSession(room, user) {
        const records = await this.getAll();
        const namespaces = Object.keys(records); // get the ns in the db
        namespaces.forEach((ns) => {
            const rooms = Object.keys(records[ns]); // get the rooms in the ns
            const joinedRoom = rooms.find((singleRoom) => { // in the rooms of the ns , look for the room that the user has joined in , and we'll use that room to put data into
                return room === singleRoom;
            })

            if (joinedRoom) {

                records[ns][joinedRoom].push(user);

            }

        })
        await this.writeAll(records);


    }

    async checkSession(room, userSocket) {
        const records = await this.getAll();
        const namespaces = Object.keys(records);
        let foundUser = false;
        let joinedRoom;
        for (let ns of namespaces) {
            const rooms = Object.keys(records[ns]);
            for (let singleRoom of rooms) {

                if (singleRoom == room) {
                    joinedRoom = singleRoom;
                    break;
                }
            }
            if (joinedRoom) {

                let tempArray = records[ns][joinedRoom];

                if (tempArray.length) {
                    const userToCheck = records[ns][joinedRoom].find((userdata) => {
                        return userdata.user == userSocket.user;
                    });
                    if (userToCheck) {
                        console.log("user has been found ");
                        userToCheck.id.push(userSocket.id[0]);
                        foundUser = true;
                        await this.writeAll(records);
                        return foundUser;

                    } else {
                        console.log("there is no user in the db ");
                        foundUser = false;
                        return foundUser;
                    }
                } else {
                    console.log("There is no record in the db");
                    foundUser = false;
                    return foundUser;
                }
                break;
            }
        }


    }

    async deleteSession(room, userSocket) {
        let records = await this.getAll();
        const namespaces = Object.keys(records);
        let joinedRoom;
        for (let ns of namespaces) {
            const rooms = Object.keys(records[ns]);
            for (let singleRoom of rooms) {

                if (singleRoom == room) {
                    joinedRoom = singleRoom;
                    break;
                }
            }
            if (joinedRoom) {
                let tempArray = records[ns][joinedRoom];

                if (tempArray.length) {

                    const userToDelete = records[ns][joinedRoom].find((userdata) => {
                        return userdata.user == userSocket.user;
                    })
                    if (userToDelete.id.length <= 1) {
                        console.log("Deleting Session...");
                        records[ns][joinedRoom] = records[ns][joinedRoom].filter((userdata) => {
                            return userdata.user !== userSocket.user;
                        })

                        await this.writeAll(records);

                        console.log("Session has been deleted successfully.");
                        break;
                    } else {
                        userToDelete.id.pop();
                        await this.writeAll(records);
                        break;
                    }

                } else {
                    console.log("There is no records in the DB to remove.");
                    break;
                }
                break;
            }
        }
    }

    async connectedSession(room) {
        const records = await this.getAll();
        if (records) {
            let joinedRoom;
            const namespaces = Object.keys(records); // get the ns in the db
            for (let ns of namespaces) {
                const rooms = Object.keys(records[ns]);
                for (let singleRoom of rooms) {

                    if (singleRoom == room) {
                        joinedRoom = singleRoom;
                        break;
                    }
                }
                if (joinedRoom) {
                    let tempArray = records[ns][joinedRoom];

                    if (tempArray.length) {
                        return tempArray.length;

                    }

                    break;
                }
            }
        }
    }

    async hasUserConnected(user, room) {
        const records = await this.getAll();
        if (records) {
            let joinedRoom;
            const namespaces = Object.keys(records); // get the ns in the db
            for (let ns of namespaces) {
                const rooms = Object.keys(records[ns]);
                for (let singleRoom of rooms) {

                    if (singleRoom == room) {
                        joinedRoom = singleRoom;
                        break;
                    }
                }
                if (joinedRoom) {
                    let tempArray = records[ns][joinedRoom];

                    if (tempArray.length) {

                        const userToFind = records[ns][joinedRoom].find((singleUser) => {
                            return singleUser.user == user;
                        })
                        if (userToFind) {
                            return userToFind;
                        } else {
                            return false;
                        }
                        break;
                    }

                    break;
                }
            }
        }
    }

    // async createDB(namespacesObjects) { //use this function for the admin page
    //     let records = await this.getAll();

    //     namespacesObjects.forEach(async(ns) => {
    //         if (!records[ns["Namespace"]]) {

    //             records[ns["Namespace"]] = {};

    //             ns.Rooms.forEach((room) => {
    //                 records[ns["Namespace"]][room] = [];
    //             })

    //         }

    //     })
    //     await this.writeAll(records);
    // }

    async addNamespace(namespace) {
        let records = await this.getAll();

        if (records[namespace.NsTitle]) {
            return;
        } else {
            records[namespace.NsTitle] = {};
            namespace.Rooms.forEach((room) => {
                records[namespace.NsTitle][room] = [];
            })
        }


        await this.writeAll(records);

    }

    async getAllNamespaces() {
        //will return an array of namespaces
        let records = await this.getAll();
        let namespaces = [];
        if (records) {
            const namespacesNames = Object.keys(records);
            namespacesNames.forEach((ns) => {
                const namespaceDetail = {
                    NsTitle: ns,
                    NsUrl: ns.replace(/\s+/g, ''),
                    Rooms: Object.keys(records[ns])
                };

                namespaces.push(namespaceDetail);
            })
        } else {
            throw new Error("There isn't any namespaces in the database");
        }
        return namespaces;
    }

    async deleteNamespace(namespaceToDelete) {
        let records = await this.getAll();
        if (namespaceToDelete) {
            if (delete records[namespaceToDelete]) {
                await this.writeAll(records);
            } else {
                throw new Error("Failed to delete the namespace , check if the name is right of if the namespace exists or not already.");
            }

        } else {
            throw new Error("You have not provided a namespace to delete from the database , Please provide one.");
        }

    }



    async userChangedRoom(previousRoom, newRoom, userSocket) {
        const records = await this.getAll();

        if (records) {
            const namespaces = Object.keys(records);
            for (let ns of namespaces) {
                const rooms = Object.keys(records[ns]);
                for (let room of rooms) {
                    if (previousRoom == room) {
                        console.log("Searching for user if he exists in the new joined room...");
                        const userToMove = records[ns][room].find((singleUser) => {
                            return singleUser.user === userSocket.user;
                        });

                        if (userToMove) { // if the user has 2 or more tabs open

                            if (userToMove.id.length > 1) {
                                // put the same user on the next room
                                // and remove one id from it so if it can be removed by deleteSession

                                // get all the sockets ID aka tabs that the user opened

                                // remove the first id cus
                                function removeUserIDFromSession(user) {
                                    const tempb = user.id.filter((singleID) => {
                                        return singleID !== userSocket.id;
                                    })
                                    user.id = tempb;
                                }


                                // does a user with the same name exists? in the new room
                                const userExists = records[ns][newRoom].find((singleUser) => {
                                    return singleUser.user === userSocket.user
                                })
                                if (userExists) { // if he does exist add the tabs that exist to his socket
                                    console.log("user exists in the new joinedRoom");
                                    if (!userExists.id.includes(userSocket.id)) { // if the user in the next room doesn't have that id , add it to it
                                        userExists.id.push(userSocket.id);

                                        removeUserIDFromSession(userToMove);

                                    } else { // if the socket id exists already in the user then
                                    }

                                } else {


                                    if (userToMove.id.includes(userSocket.id)) {
                                        records[ns][newRoom].push({
                                            user: userToMove.user,
                                            id: [userSocket.id]
                                        });
                                        const tempb = userToMove.id.filter((singleID) => {
                                            return singleID !== userSocket.id;
                                        })
                                        userToMove.id = tempb;
                                        removeUserIDFromSession(userToMove);
                                    }


                                }


                            } else if (userToMove.id.length <= 1) {
                                console.log("Found User. starting removing him from the room DB");
                                //remove the user from that room 
                                records[ns][room] = records[ns][room].filter((singleUser) => {
                                    return singleUser.user !== userSocket.user
                                })


                                console.log("Successfully removed user from previous room");
                                // put the user in the new room
                                // check if there is a user with that same name there first
                                const userExists = records[ns][newRoom].find((singleUser) => {
                                    return singleUser.user === userSocket.user
                                })
                                if (userExists) {
                                    userExists.id.push(userToMove.id[0]);

                                } else {
                                    records[ns][newRoom].push(userToMove);
                                }

                            }


                            await this.writeAll(records);
                            console.log("User has been inserted to the new room");
                            break;
                        }
                    }
                }
            }
        }
    }
    async getAllUserSocketIDS(socket) {
        const records = await this.getAll();
        let userRecord = [];
        if (records) {
            const namespaces = Object.keys(records);
            for (let ns of namespaces) {
                const rooms = Object.keys(records[ns]);
                for (let room of rooms) {
                    const user = records[ns][room].find((singleUser) => {
                        return singleUser.user === socket.user;
                    });
                    if (user) {
                        userRecord.push(user.id);
                    }

                }
            }
        }
        return userRecord;
    }
}
module.exports = new sessionsDB("Sessions.json", "{}");