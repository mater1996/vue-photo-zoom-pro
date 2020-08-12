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
