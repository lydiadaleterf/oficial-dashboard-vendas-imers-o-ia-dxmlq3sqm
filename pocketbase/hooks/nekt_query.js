routerAdd('POST', '/backend/v1/nekt/query', (e) => {
  var body = e.requestInfo().body || {}
  var sql = body.sql
  if (!sql || typeof sql !== 'string') {
    return e.badRequestError('sql is required')
  }

  var sqlHash = $security.sha256(sql)
  var CACHE_TTL_MINUTES = 5

  try {
    var cached = $app.findFirstRecordByFilter('nekt_cache', "sql_hash = '" + sqlHash + "'")
    if (cached) {
      var updatedStr = cached.getString('updated') || cached.getString('created')
      if (updatedStr) {
        var updatedTime = new Date(updatedStr)
        var now = new Date()
        var diffMs = now.getTime() - updatedTime.getTime()
        if (diffMs < CACHE_TTL_MINUTES * 60 * 1000) {
          return e.json(200, { data: cached.get('response_data'), cached: true })
        }
      }
    }
  } catch (_) {}

  var apiKey = $secrets.get('NEKT_API_KEY')
  if (!apiKey) {
    return e.json(503, {
      error: 'NEKT_API_KEY secret is not configured. Set it in the Skip Cloud secrets dashboard.',
    })
  }

  var postRes
  try {
    postRes = $http.send({
      url: 'https://api.nekt.ai/api/v1/sql-query/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({ sql: sql, mode: 'csv' }),
      timeout: 30,
    })
  } catch (err) {
    return e.json(500, { error: 'Failed to connect to Nekt API: ' + err.message })
  }

  if (postRes.statusCode !== 200 && postRes.statusCode !== 201) {
    var errBody = null
    try {
      errBody = postRes.json
    } catch (_) {}
    var errMsg = 'Nekt API returned status ' + postRes.statusCode
    if (errBody) {
      if (errBody.message) errMsg = errBody.message
      else if (errBody.error) errMsg = errBody.error
      else if (errBody.detail) errMsg = errBody.detail
    }
    return e.json(postRes.statusCode >= 500 ? 502 : postRes.statusCode, { error: errMsg })
  }

  var postJson = null
  try {
    postJson = postRes.json
  } catch (err) {
    return e.json(500, { error: 'Failed to parse Nekt API response JSON: ' + err.message })
  }

  if (!postJson) {
    return e.json(500, { error: 'Nekt API returned empty response' })
  }

  if (postJson.state && postJson.state !== 'SUCCEEDED') {
    return e.json(500, { error: 'Nekt query did not succeed. State: ' + postJson.state })
  }

  var presignedUrls = postJson.presigned_urls || postJson.presignedUrls || []
  if (!presignedUrls || presignedUrls.length === 0) {
    return e.json(500, { error: 'No presigned URLs returned from Nekt API' })
  }

  var csvRes
  try {
    csvRes = $http.send({
      url: presignedUrls[0],
      method: 'GET',
      timeout: 60,
    })
  } catch (err) {
    return e.json(500, { error: 'Failed to download CSV from presigned URL: ' + err.message })
  }

  if (csvRes.statusCode !== 200) {
    return e.json(500, { error: 'CSV download returned status ' + csvRes.statusCode })
  }

  // Decodifica bytes UTF-8 corretamente. String.fromCharCode(byte) trata cada
  // byte como um code point Latin-1, quebrando qualquer acento (ex.: "Imersão"
  // vira "ImersÃ£o") porque caracteres acentuados ocupam 2+ bytes em UTF-8.
  function utf8BytesToString(bytes) {
    var out = ''
    var i = 0
    var len = bytes.length
    while (i < len) {
      var b1 = bytes[i]
      if (b1 < 0x80) {
        out += String.fromCharCode(b1)
        i += 1
      } else if ((b1 & 0xe0) === 0xc0 && i + 1 < len) {
        var b2 = bytes[i + 1]
        out += String.fromCharCode(((b1 & 0x1f) << 6) | (b2 & 0x3f))
        i += 2
      } else if ((b1 & 0xf0) === 0xe0 && i + 2 < len) {
        var b2e = bytes[i + 1]
        var b3e = bytes[i + 2]
        out += String.fromCharCode(((b1 & 0x0f) << 12) | ((b2e & 0x3f) << 6) | (b3e & 0x3f))
        i += 3
      } else if ((b1 & 0xf8) === 0xf0 && i + 3 < len) {
        var b2f = bytes[i + 1]
        var b3f = bytes[i + 2]
        var b4f = bytes[i + 3]
        var cp =
          ((b1 & 0x07) << 18) | ((b2f & 0x3f) << 12) | ((b3f & 0x3f) << 6) | (b4f & 0x3f)
        cp -= 0x10000
        out += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 0x3ff))
        i += 4
      } else {
        // byte inválido isolado — pula para não travar o parser
        i += 1
      }
    }
    return out
  }

  var csvText = ''
  var csvBody = csvRes.body
  if (typeof csvBody === 'string') {
    csvText = csvBody
  } else if (csvBody && csvBody.length > 0) {
    csvText = utf8BytesToString(csvBody)
  }

  var parsedData
  try {
    var rows = []
    var row = []
    var field = ''
    var inQuotes = false
    var ci = 0
    while (ci < csvText.length) {
      var ch = csvText[ci]
      if (inQuotes) {
        if (ch === '"') {
          if (csvText[ci + 1] === '"') {
            field += '"'
            ci += 2
            continue
          }
          inQuotes = false
          ci++
          continue
        }
        field += ch
        ci++
        continue
      }
      if (ch === '"') {
        inQuotes = true
        ci++
        continue
      }
      if (ch === ',') {
        row.push(field)
        field = ''
        ci++
        continue
      }
      if (ch === '\n') {
        row.push(field)
        field = ''
        rows.push(row)
        row = []
        ci++
        continue
      }
      if (ch === '\r') {
        ci++
        continue
      }
      field += ch
      ci++
    }
    if (field !== '' || row.length > 0) {
      row.push(field)
      rows.push(row)
    }
    if (rows.length === 0) {
      parsedData = []
    } else {
      var headers = rows[0].map(function (h) {
        return h.trim()
      })
      parsedData = []
      for (var r = 1; r < rows.length; r++) {
        if (rows[r].length === 1 && rows[r][0] === '') continue
        var obj = {}
        for (var c = 0; c < headers.length; c++) {
          var raw = c < rows[r].length ? rows[r][c] : ''
          var trimmed = raw.trim()
          if (trimmed === '') {
            obj[headers[c]] = null
            continue
          }
          var lower = trimmed.toLowerCase()
          if (lower === 'true') {
            obj[headers[c]] = true
            continue
          }
          if (lower === 'false') {
            obj[headers[c]] = false
            continue
          }
          if (lower === 'null' || lower === 'none') {
            obj[headers[c]] = null
            continue
          }
          if (/^-?\d+\.?\d*$/.test(trimmed) || /^-?\d*\.\d+$/.test(trimmed)) {
            var num = Number(trimmed)
            if (!isNaN(num)) {
              obj[headers[c]] = num
              continue
            }
          }
          obj[headers[c]] = raw
        }
        parsedData.push(obj)
      }
    }
  } catch (err) {
    return e.json(500, { error: 'Failed to parse CSV: ' + err.message })
  }

  try {
    var cacheCol = $app.findCollectionByNameOrId('nekt_cache')
    var cacheRecord = null
    try {
      cacheRecord = $app.findFirstRecordByFilter('nekt_cache', "sql_hash = '" + sqlHash + "'")
    } catch (_) {}
    if (cacheRecord) {
      cacheRecord.set('response_data', parsedData)
      $app.save(cacheRecord)
    } else {
      cacheRecord = new Record(cacheCol)
      cacheRecord.set('sql_hash', sqlHash)
      cacheRecord.set('response_data', parsedData)
      $app.save(cacheRecord)
    }
  } catch (err) {
    console.log('Cache write failed: ' + err.message)
  }

  return e.json(200, { data: parsedData, cached: false })
})
