import deepEqual from 'deep-equal'

// Quasar's ready() is broken until https://github.com/quasarframework/quasar/pull/2199
export function ready (fn) {
  if (typeof fn !== 'function') {
    return
  }

  if (document.readyState !== 'loading') {
    return fn()
  }

  document.addEventListener('DOMContentLoaded', fn, false)
}

export function camelizeKeys (val) {
  if (isObject(val)) {
    if (Array.isArray(val)) {
      return val.map(camelizeKeys)
    }
    else {
      let newVal = {}
      for (const key of Object.keys(val)) {
        newVal[camelize(key)] = camelizeKeys(val[key])
      }
      return newVal
    }
  }
  else {
    return val
  }
}

export function underscorizeKeys (val) {
  if (isObject(val)) {
    if (Array.isArray(val)) {
      return val.map(underscorizeKeys)
    }
    else {
      let newVal = {}
      for (const key of Object.keys(val)) {
        newVal[underscorize(key)] = underscorizeKeys(val[key])
      }
      return newVal
    }
  }
  else {
    return val
  }
}

export function isObject (x) {
  return typeof x === 'object' &&
    x !== null &&
    !(x instanceof RegExp) &&
    !(x instanceof Error) &&
    !(x instanceof Date)
}

// Just enough to support the keys we get back from the Django API
export function camelize (val) {
  return val.replace(/_(.)/g, (_, s) => s.toUpperCase())
}

export function underscorize (val) {
  return val.replace(/[A-Z]/g, s => `_${s.toLowerCase()}`)
}

export function objectDiff (a, b) {
  const diff = {}
  for (let key of Object.keys({ ...a, ...b })) {
    if (!deepEqual(a[key], b[key])) {
      diff[key] = b[key]
    }
  }
  return diff
}

// Escape html that occurs in text
// Copied from vue.js: https://github.com/vuejs/vue/blob/833175e9d6e8f47367e49e1752cd149a677cdae8/src/platforms/web/server/util.js#L43
const ESC = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '&': '&amp;',
}

export function escape (s) {
  return s.replace(/[<>"&]/g, escapeChar)
}

function escapeChar (a) {
  return ESC[a] || a
}
