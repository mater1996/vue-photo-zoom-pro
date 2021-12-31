export const getBoundingClientRect = (element) => {
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

export function clamp (num, min, max) {
  const MIN = min
  const MAX = max
  return Math.min(Math.max(num, MIN), MAX)
}

export const getBoundValue = (value, bound) => {
  return {
    x: clamp(value.x, bound.left, bound.right),
    y: clamp(value.y, bound.top, bound.bottom)
  }
}

export const generateBound = (width, height, boundWidth, boundHeight) => {
  return {
    left: boundWidth,
    top: boundHeight,
    right: width - boundWidth,
    bottom: height - boundHeight
  }
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
export const loadImg = (url, callback) => {
  const img = document.createElement('img')
  img.addEventListener('load', () => callback(null, img))
  img.addEventListener('error', callback)
  img.src = url
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
