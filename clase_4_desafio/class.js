const fs = require('fs')

class Contenedor {
    constructor(fileName) {
        this.fileName = fileName
    }

    async save(newData) {
        try {
            const arr = await this.getAll()
            let lastItem = arr[arr.length - 1]
            newData.id = lastItem.id +1
            arr.push(newData)
            await fs.promises.writeFile(this.fileName, JSON.stringify(arr))
            console.log(`Item Added ✔. ID assigned: ${newData.id}`)
            return  newData.id
        }
        catch(err) {
            console.log(err)
        }
    }

    async getAll() {

        try {
            const data = await fs.promises.readFile(this.fileName,'utf-8')
            return JSON.parse(data)
        }
        catch(err) {
            return []
        }
    }

    async getById(id) {
        
        try {
            const arr = await this.getAll()
            let match = arr.filter((item) => item.id === id)
            if (match.length) {
                console.log(match)
                return match
            }
            else {
                console.log(`Item Not Found ❌`)
                return null
            }
        }
        catch(err) {
            console.log(err)
        }
    }

    async deleteById(idToDelete) {
        try {
            const arr = await this.getAll()
            let match = arr.find(item => item.id === idToDelete)
            if (match == undefined) {
                return console.log(`Item Not Found ‼, Check ID`)
            }
            else {
                let toDelete = arr.indexOf(match)
                arr.splice(toDelete, 1)
                await fs.promises.writeFile(this.fileName, JSON.stringify(arr))
                return console.log(`Item Found and Deleted ❎`)
            }

        }
        catch(err) {
            console.log(err)
        }
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.fileName, JSON.stringify([]))
            return console.log(`List Cleared ✔`)

        }
        catch(err) {
            console.log(err)
        }
    }
}

module.exports = Contenedor