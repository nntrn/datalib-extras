var dl = require('datalib')


const getSummary = {
  maxValuesToInclude: 15,

  config: {
    maxValuesToInclude: 15,
    showPercent: true,
  },


  keys: function(x) {
    var keys = []
    for (var k in x) keys.push(k)
    return keys
  },

  getDistinct: function() {
    return { summaryType: 'distinct' }
  },

  getQuantitative: function(p, options) {
    const config = {
      fmt: function(n) { return n },
      ...options
    }
    const fmtFn = config.fmt 
    return {
      summaryType: 'quantitative',
      valid: fmtFn(p.valid),
      missing: fmtFn(p.missing),
      distinct: fmtFn(p.distinct),
      min: fmtFn(p.min),
      max: fmtFn(p.max),
      median: fmtFn(p.median),
      mean: fmtFn(p.mean),
      stdev: fmtFn(p.stdev),
      modeskew: fmtFn(p.modeskew)
    }
  },

  getCategorical: function(p, options) {
    var config = {
      maxValuesToInclude: this.maxValuesToInclude,
      showPercent: true,
      ...options
    }
    var u = p.unique

    var top = this.keys(u)
      .sort((a, b) => u[b] - u[a])
      .map((v) => {
        const item = {
          value: v || '(blank)',
          count: u[v]
        }
        if (config.showPercent) {
          Object.assign(item, { '%': +(u[v] / p.valid).toFixed(3).replace(/\.?0+$/, '') })
        }
        return item
      })
      .filter(a => a.value.toString().length !== '')
      .sort((a, b) => b.count - a.count)

    // lump items with only 1 count into 'others'
    if (top.length > config.maxValuesToInclude) {
      var others = top.slice(config.maxValuesToInclude)
      var findOne = top.map(e => e.count).indexOf(1)
      if (findOne > -1) {
        others = top.splice(findOne)
      }

      const otherCount = others.map(e => e.count).reduce((a, b) => a + b)

      top.push({
        value: 'other',
        count: otherCount,
        pct: +(otherCount / p.valid).toFixed(3).replace(/\.?0+$/, '')
      })
    }

    return {
      summaryType: 'categorical',
      valid: p.valid,
      distinct: p.distinct,
      topValues: top
    }
  }
}


function formatSummaryObj(s, options) {
  s = s ? (s.__summary__ ? s : dl.summary(s)) : this

  var arr = []

  s.forEach((fobj, idx) => {
    const flag = (s[idx].valid === s[idx].distinct && 'getDistinct')
    || (s[idx].type === 'number' && 'getQuantitative')
    || 'getCategorical'

    arr.push({
      name: s[idx].field,
      dataType: s[idx].type,
      ...getSummary[flag](s[idx], options)
    })
  })

  return arr
}


module.exports = formatSummaryObj
