# Props

## url

Picture url

- Type: `string`
- Default: `''`

## high-url

Clearer picture url

- Type: `string`
- Default: `''`

## scale

The magnification.

- Type: `number`
- Default: `2`

## disabled

Disabled all event.

- Type: `boolean`
- Default: `false`

## width

The width of the selector.

- Type: `number`
- Default: `168`

## height

The height of the selector.

- Type: `number`
- Default: `-1`

## type

Magnifier type.

- Type: `'circle' | 'square'`
- Default: `'square'`

## selector

Show or remove selector, release: Whether the selector is restricted to the preview area

- Type: `boolean / { release: boolean }`
- Default: `true`

## out-zoomer

Zoom region will be displayed on the outside

- Type: `boolean / { sticky: boolean }`
- Default: `false`

## mask

Show or remove mask.

- Type: `boolean / { sticky: boolean }`
- Default: `false`

## mask-color

Mask color

- Type: `color string`
- Default: `rgba(0,0,0,0.4)`

## enter-event

custom enter event

- Type: `object/UIEvent`
- Default: `null`


## move-event

custom move event

- Type: `object/UIEvent`
- Default: `null`

## leave-event

custom leave event

- Type: `object/UIEvent`
- Default: `null`

## disabled-reactive

Disable listening for preview area changes.

- Type: `boolean`
- Default: `false`