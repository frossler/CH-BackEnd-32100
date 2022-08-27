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
            // console.log(lastItem)
            // console.log(newData)
            arr.push(newData)
            // console.log(arr)
            // WriteFile recibe 2 param 1: el path 2: el contenido convertido
            await fs.promises.writeFile(this.fileName, JSON.stringify(arr))
            return console.log(`Item Added ✔. ID assigned: ${newData.id}`) 
        }
        catch(err) {
            console.log(err)
        }
    }

    // async testFoo() {
    //     try {
    //         const arr = await this.getAll()
    //         let ultimoItem = arr[arr.length-1]
    //         return ultimoItem
    //     }
    //     catch(err) {
    //         console.log(err)
    //     }
    // }

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
            // console.log(arr)
            const match = arr.filter((item) => item.id === id)
            // console.log(match)
            if (match.length) {
                return console.log(match)
            }
            else {
                return console.log('ID Not Found ❌')
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
            let toDelete = arr.indexOf(match)
            arr.splice(toDelete, 1)
            // console.log(arr)
            await fs.promises.writeFile(this.fileName, JSON.stringify(arr))
            return console.log(`Item Found and Deleted ❎`)
            // WriteFile recibe 2 param 1: el path 2: el contenido convertido
            // await fs.promises.writeFile(this.fileName, JSON.stringify(arr))
        }
        catch(err) {
            console.log(err)
        }
    }

    async deleteAll() {
        try {
            const arr = await this.getAll()
            let end = arr.length
            arr.splice(0, end)
            await fs.promises.writeFile(this.fileName, JSON.stringify(arr))
            return console.log(`List Cleared ✔`)

        }
        catch(err) {
            console.log(err)
        }
    }
}

const container = new Contenedor('./items/items.json')

// container.getAll().then(res => console.log(res))

// getLastArrItem(arr1); 
// container.testFoo().then(res => console.log(res))


// newData =     {
//     "id": "",
//     "title": "Poción",
//     "price": 50,
//     "thumbnail": "https://icons.iconarchive.com/icons/chanut/role-playing/64/Potion-icon.png" 
// }

// container.save(newData).then(res => res)
// container.deleteById(5).then(res => res)
container.deleteAll().then(res => res)