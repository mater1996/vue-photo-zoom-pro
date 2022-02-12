# 属性

## url

图片url。

- Type: `string`
- Default: `''`

## high-url

更清晰的图片url。

- Type: `string`
- Default: `''`

## scale

放大倍数。

- Type: `number`
- Default: `2`

## disabled

禁止所有的事件。

- Type: `boolean`
- Default: `false`

## width

选择器宽度。

- Type: `number`
- Default: `168`

## height

选择器高度。

- Type: `number`
- Default: `-1`

## type

放大镜类型。

- Type: `'circle' | 'square'`
- Default: `'square'`

## selector

是否显示选择器, release: 选择器是否限制在预览区域内。

- Type: `boolean / { release: boolean }`
- Default: `true`

## out-zoomer

放大区域展示到图片外。

- Type: `boolean / { sticky: boolean }`
- Default: `false`

## mask

遮罩。

- Type: `boolean / { sticky: boolean }`
- Default: `false`

## mask-color

遮罩颜色。

- Type: `color string`
- Default: `rgba(0,0,0,0.4)`

## disabled-reactive

禁用响应式。

- Type: `boolean`
- Default: `false`

## disabled-event

禁用内部的事件监听，通过这样你可以手动触发事件。

- Type: `boolean`
- Default: `false`