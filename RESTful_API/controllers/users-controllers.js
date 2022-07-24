const fs = require('fs');
const fileData = './users.json';

const usersControllers = {
    getUsers: (req, res) => {
        fs.readFile(fileData, (err, data) => {
            if (err)
                throw err;
            res.end(data);
        });
    },

    getAUser: (req, res) => {
        fs.readFile(fileData, (err, data) => {
            if (err) throw err;
            const userId = req.params['id'];
            let listUsers = JSON.parse(data);
            let userFilted = listUsers[userId];
            res.end(JSON.stringify(userFilted));
        });
    },

    addUser: (req, res) => {
        fs.readFile(fileData, (err, data) => {
            if (err) throw err;
            let listData = JSON.parse(data);
            const newId = Object.keys(listData).length + 1;
            console.log(newId);
            listData[newId] = req.body;
    
            fs.writeFile(fileData, JSON.stringify(listData), (err) => {
                if (err) throw err;
                res.status(200).send('New User Added!');
            });
        });
    },

    updateUser: (req, res) => {
        fs.readFile(fileData, (err, data) => {
            if (err) throw err;
            let listData = JSON.parse(data);
            const userId = req.params['id'];
            listData[userId] = req.body;
    
            fs.writeFile(fileData, JSON.stringify(listData), (err) => {
                if (err) throw err;
                res.status(200).send('Updated User Successfully!');
            });
        });
    },

    deleteUser: (req, res) => {
        fs.readFile(fileData, (err, data) => {
            if (err) throw err;
            let listData = JSON.parse(data);
            const userId = req.params['id'];
            delete listData[userId];
    
            fs.writeFile(fileData, JSON.stringify(listData), (err) => {
                if (err) throw err;
                res.status(200).send('Deleted User Successfully!');
            });
        });
    }
}

module.exports = usersControllers;