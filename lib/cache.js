const fs = require('fs')
const path = require('path')

class Cache {
  constructor (fileName) {
    this._data = {}
    this.filePath = path.join(process.cwd(), fileName)
    this.load()
  }

  load () {
    try {
      this._data = require(this.filePath)
    } catch (err) {
      this._data = {}
    }
  }

  get (key) {
    return key in this._data ? this._data[key] : false
  }

  set (key, data) {
    this._data[key] = data
  }

  save () {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        this.filePath,
        JSON.stringify(this._data),
        err => {
          if (err) {
            return reject(err)
          }
          return resolve()
        }
      )
    })
  }
}

module.exports = Cache
