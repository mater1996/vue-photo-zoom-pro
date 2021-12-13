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
    img.addEventListener('load', () => resolve(img))
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

export function rotateCanvas (canvas, img, width, height, step) {
  const ctx = canvas.getContext('2d')
  const degree = (step * 90 * Math.PI) / 180
  const { width: imgWidth, height: imgHeight } = img

  switch (step) {
    case 0:
      canvas.width = imgWidth
      canvas.height = imgHeight
      ctx.drawImage(img, 0, 0, imgWidth, imgHeight)
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      break
    case 1:
      canvas.width = imgHeight
      canvas.height = imgWidth
      ctx.rotate(degree)
      ctx.drawImage(img, 0, -imgHeight, imgWidth, imgHeight)
      canvas.style.width = height + 'px'
      canvas.style.height = width + 'px'
      break
    case 2:
      canvas.width = imgWidth
      canvas.height = imgHeight
      ctx.rotate(degree)
      ctx.drawImage(img, 0, 0, -imgWidth, -imgHeight)
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      break
    case 3:
      canvas.width = imgHeight
      canvas.height = imgWidth
      ctx.rotate(degree)
      ctx.drawImage(img, -imgWidth, 0, imgWidth, imgHeight)
      canvas.style.width = height + 'px'
      canvas.style.height = width + 'px'
      break
  }
}
