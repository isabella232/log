
var chalk = require('chalk')
  , prettyjson = require('prettyjson')

// req, res | http, raw | body, json
var debug = {}
if (process.env.DEBUG) {
  process.env.DEBUG.split(',').forEach(function (key) {
    debug[key] = true
  })
}

var opt = {
  keysColor: 'blue',
  stringColor: 'grey'
}


function log (req) {
  req.on('options', function (options) {
    if (debug.raw) {
      console.log(chalk.gray.inverse('options'))
      console.log(prettyjson.render(options, opt, 4))
    }
  })

  req.on('request', function (req, options) {
    if (debug.http) {
      console.log(chalk.gray.inverse('options'))
      console.log(prettyjson.render(options, opt, 4))
    }

    if (debug.req) {
      var mt = method(req.method)
      console.log(
        chalk.cyan.inverse('req'),
        mt(req.method),
        chalk.yellow(uri(req))
      )

      var headers = {}
      for (var key in req._headerNames) {
        var name = req._headerNames[key]
        headers[name] = req._headers[key]
      }
      console.log(prettyjson.render(headers, opt, 4))
    }

    if (debug.body) {
      if (options.body) {
        console.log(chalk.gray.inverse('body'), options.body)
      }
    }
  })

  req.on('response', function (res) {
    var code = res.statusCode

    var st = status(res.statusCode)
    if (debug.res) {
      console.log(
        chalk.yellow.inverse('res'),
        st(res.statusCode + ' ' + res.statusMessage))
      console.log(prettyjson.render(res.headers, opt, 4))
    }
  })

  req.on('body', function (body) {
    if (debug.body) {
      if (body) {
        console.log(chalk.gray.inverse('body'), body)
      }
    }
  })

  req.on('json', function (body) {
    if (debug.json) {
      if (body) {
        console.log(chalk.gray.inverse('json'), body)
      }
    }
  })
}

function method (verb) {
  if (/GET/.test(verb)) {
    return chalk.green
  }
  else if (/POST/.test(verb)) {
    return chalk.cyan
  }
  else if (/PUT/.test(verb)) {
    return chalk.cyan
  }
  else if (/DELETE/.test(verb)) {
    return chalk.red
  }
  else if (/HEAD|OPTIONS|CONNECT/.test(verb)) {
    return chalk.yellow
  }
  else if (/TRACE/.test(verb)) {
    return chalk.gray
  }
}

function uri (req) {
  return req.agent.protocol + '//' + req._headers.host +
    (req.path === '/' ? '' : req.path)

  // return url.format({
  //   protocol: req.agent.protocol,
  //   host: req._headers.host,
  //   pathname: (req.path === '/' ? '' : req.path)
  // })
}

function status (code) {
  if (code >= 100 && code <= 199) {
    return chalk.white
  }
  else if (code >= 200 && code <= 299) {
    return chalk.green
  }
  else if (code >= 300 && code <= 399) {
    return chalk.yellow
  }
  else if (code >= 400 && code <= 499) {
    return chalk.red
  }
  else if (code >= 500 && code <= 599) {
    return chalk.red.bold
  }
}

module.exports = log
