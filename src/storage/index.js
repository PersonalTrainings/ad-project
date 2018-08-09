class Storage {
    constructor (type, name) {
        this.type = type
        this.name = name
    }

    set (value, expired) {
        const name = this.name
        const expiredSeconds = expired * 1000
        const expiredMilliseconds = +(new Date(+expiredSeconds + Date.now()))
        const storageObj = {
          value,
          expired: expiredMilliseconds
        }
        this.type.setItem(name, JSON.stringify(storageObj))

        return this
    }

    get () {
        const name = this.name
        const storage = this.type.getItem(name)

        if (!storage) {
          return null
        }

        const storageObj = JSON.parse(storage)

        if (storageObj.expired && (new Date(storageObj.expired) < Date.now())) {
          this.remove()
          return null
        }

        return storageObj.value
    }

    remove () {
        const name = this.name
        this.type.removeItem(name)
        return this
    }
}

const store = {
    storage: window.localStorage
}

const nameMap = {
    USER_TOKEN: '1'
}

export const UserToken = new Storage(store.storage, nameMap.USER_TOKEN)
