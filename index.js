/* global hexo */

const crypto = require('crypto')
const Cache = require('./lib/cache')
const Parser = require('./lib/parser')

const parserDefaultOptions = {
  tag: 'span',
  class: null,
  cache: '.cache.phrasify.json',
  alias: null
}

const options = Object.assign({}, parserDefaultOptions, hexo.config.phrasify)
const cache = new Cache(options.cache)
const parser = new Parser(options)

const phrasify = (arg, content) => {
  const hash = crypto.createHash('sha256')
  hash.update(content)

  const key = hash.digest('hex')
  const cacheData = cache.get(key)

  if (cacheData) {
    return Promise.resolve(cacheData)
  }

  return new Promise((resolve, reject) => {
    parser.parse(content)
      .then(data => {
        cache.set(key, data)
        cache.save().then(() => {
          resolve(data)
        })
      })
      .catch(reject)
  })
}

hexo.extend.tag.register('phrasify', phrasify, {
  ends: true,
  async: true
})

if (options.alias) {
  hexo.extend.tag.register(options.alias, phrasify, {
    ends: true,
    async: true
  })
}
