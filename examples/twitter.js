const fs = require('fs')
const dl = require('../')

const data = require('./data/twitter')

const flatData = data.users.map((e) => dl.extras.flatten(e))

const dataSummary = dl.extras.summary(flatData, {
  fmt: function(x) {
    return Math.round((x + Number.EPSILON) * 100) / 100
  },
})

fs.writeFileSync(`${__dirname}/output/twitter-flatten.json`, JSON.stringify(flatData, null, 2))
fs.writeFileSync(`${__dirname}/output/twitter-summary.json`, JSON.stringify(dataSummary, null, 2))
