const sessionRepo = require("../repositories/sessions");





module.exports = () => {
    return new Promise((resolve, reject) => {
        sessionRepo.getAllNamespaces().then((result) => {
            resolve(result);
        }).catch(() => {
            reject();
        })

    })

}