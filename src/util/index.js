/**
 * @author : Mater
 * @Email : bxh8640@gmail.com
 * @Date : 2020-08-12 09:15:07
 * @LastEditTime : 2020-08-12 09:15:37
 * @Description :
 */
export const getBoundingClientRect = element => {
  const rect = element.getBoundingClientRect()

  // whether the IE version is lower than 11
  const isIE = navigator.userAgent.indexOf('MSIE') !== -1

  // fix ie document bounding top always 0 bug
  const rectTop =
    isIE && element.tagName === 'HTML' ? -element.scrollTop : rect.top

  return {
    left: rect.left,
    top: rectTop,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.right - rect.left,
    height: rect.bottom - rectTop
  }
}

export const getBoundValue = (value, min, max) => {
  return value > min ? Math.min(value, max) : min
}

export const getScrollInfo = () => {
  const { documentElement, body } = document
  const scrollTop =
    documentElement.scrollTop || window.pageYOffset || body.scrollTop
  const scrollLeft =
    documentElement.scrollLeft || window.pageXOffset || body.scrollLeft
  return {
    scrollTop,
    scrollLeft
  }
}

/**
 * load img
 * @param {String} img url
 * @return {Promise}
 */
export const loadImg = url => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img')
    img.addEventListener('load', resolve)
    img.addEventListener('error', reject)
    img.src = url
  })
}

const beforeReactivateMoveFns = []
let rect = {}

const isResize = newRect => {
  return (
    rect.width !== newRect.width ||
    rect.height !== newRect.height ||
    rect.left !== newRect.left ||
    rect.top !== newRect.top
  )
}

export const addResizeListener = (dom, cb) => {
  beforeReactivateMoveFns.push(() => {
    const newRect = getBoundingClientRect(dom)
    if (isResize(newRect)) {
      rect = newRect
      cb && cb(rect)
    }
  })
  return {
    valid () {
      beforeReactivateMoveFns.forEach(fn => fn())
    }
  }
}
