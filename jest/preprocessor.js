const babelJest = require('babel-jest')
require('babel-register')
const fp = require('lodash/fp')


const blacklist = ['enzyme', 'lodash']

module.exports = {
    process: function(src, filename) {

        if (/\.css|\.scss|\.png|\.jpeg$/.test(filename)) {
            return ''
        }

        if (fp.every(fp.map(str => filename.indexOf(str) === -1), blacklist)) {
            return babelJest.process(src, filename)
        }

        return src
    }
}
