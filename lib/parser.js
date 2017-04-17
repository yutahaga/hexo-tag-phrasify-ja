const axios = require('axios')
const escapeHTML = require('hexo-util').escapeHTML

const API_URL = 'https://labs.goo.ne.jp/api/morph'

const OPEN_BRACES = '[({（「【『［〈《〔｛«‹〘〚'

const POS_LIST = {
  '名詞': 1,
  '名詞接尾辞': 0,
  '冠名詞': 1,
  '英語接尾辞': 0,
  '動詞語幹': 1,
  '動詞活用語尾': 2,
  '動詞接尾辞': 2,
  '冠動詞': 0,
  '補助名詞': 0,
  '形容詞語幹': 1,
  '形容詞接尾辞': 2,
  '冠形容詞': 1,
  '連体詞': 3,
  '連用詞': 3,
  '接続詞': 3,
  '独立詞': 3,
  '接続接尾辞': 2,
  '判定詞': 2,
  '格助詞': 2,
  '引用助詞': 1,
  '連用助詞': 2,
  '終助詞': 2,
  '間投詞': 2,
  '括弧': 4,
  '句点': 2,
  '読点': 2,
  '空白': 3,
  'Symbol': 3,
  'Year': 1,
  'Month': 1,
  'Day': 1,
  'YearMonth': 1,
  'MonthDay': 1,
  'Hour': 1,
  'Minute': 1,
  'Second': 1,
  'HourMinute': 1,
  'MinuteSecond': 1,
  'PreHour': 1,
  'PostHour': 1,
  'Number': 1,
  '助数詞': 0,
  '助助数詞': 0,
  '冠数詞': 1,
  'Alphabet': 1,
  'Kana': 1,
  'Katakana': 1,
  'Kanji': 1,
  'Roman': 1,
  'Undef': 3
}

class Parser {
  constructor (options) {
    if (!('goo_app_id' in options) || !options.goo_app_id) {
      throw new Error('You must set goo_app_id in hexo config file.')
    }
    this.options = options
  }

  parse (content) {
    const options = {
      method: 'post',
      url: API_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        'app_id': this.options.goo_app_id,
        'sentence': content,
        'info_filter': 'form|pos'
      }
    }

    return axios(options)
      .then(response => {
        return this.htmlify(this.phrasify(response.data))
      })
  }

  phrasify (data) {
    const text = []

    data.word_list.forEach(sentence => {
      const phrases = []
      let index = 0
      let before = 3

      const createArray = () => {
        if (typeof phrases[index] !== 'object') {
          phrases[index] = []
        }
      }

      sentence.forEach(word => {
        const form = word[0]
        let pos = POS_LIST[ word[1] ] || 3

        if (pos === 4) {
          pos = OPEN_BRACES.indexOf(form) !== -1 ? 1 : 2
        }

        if (before === 0) {
          if (pos === 1 || pos === 3) {
            phrases[++index] = [form]
          } else {
            createArray()
            phrases[index].push(form)
          }
        } else if (before === 1) {
          createArray()
          phrases[index].push(form)
        } else if (before === 2) {
          if (pos === 1 || pos === 3) {
            phrases[++index] = [form]
          } else {
            createArray()
            phrases[index].push(form)
          }
        } else {
          if (pos === 1 || pos === 3) {
            phrases[++index] = [form]
          } else {
            createArray()
            phrases[index].push(form)
          }
        }
        before = pos
      })
      text.push(phrases)
    })

    return text
  }

  htmlify (text) {
    return text.map(sentence => {
      return sentence.map(phrase => {
        const classAttr = this.options.class ? ' class="' + this.options.class + '"' : ''
        return '<' + this.options.tag + classAttr + '>' + escapeHTML(phrase.join('')).replace(' ', '&nbsp;') + '</' + this.options.tag + '>'
      }).join('')
    }).join('')
  }
}

module.exports = Parser
