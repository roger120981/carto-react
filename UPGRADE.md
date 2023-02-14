# Upgrade to the new design system

# Breaking changes in Mui v5

Please, follow the Mui guides related to breaking changes in components and styles:

- [Styles](https://mui.com/material-ui/migration/v5-style-changes/)
- [Components](https://mui.com/material-ui/migration/v5-component-changes/)

# MUI theme

[carto-theme.js](https://github.com/CartoDB/carto-react/blob/master/packages/react-ui/src/theme/carto-theme.js) file splitted in sections:

- CSS baseline
- Color palette
- Typography
- Shadows
- Components overrides

Also added some files for shared constants (`themeConstants.js`) and useful functions (`themeUtils.js`).

Removed unused custom `createTheme` function in `carto-theme.js`.

## theme.spacing

We have a new custom spacing constant in carto-theme, `spacingValue`, which you should use instead of the common `theme.spacing()` function in cases where you need to do value calculations, because since Mui v5, theme.spacing is no longer a number, but a string in this format: `number + px`.

Note that if you're using `calc()` in your styles, you can keep using `theme.spacing()` as usual.

`theme.spacingValue * 2`

Needed changes:

1. Change `${theme.spacing(xx)}px` by `${theme.spacing(xx)}`. It means, without the `px` ending, since in Mui v5 it is appended to the end of the string by default.

Tip: An easy search to catch up this, would be `)}px`

2. Change `-theme.spacing(xx)` by `theme.spacing(-xx)`. It means, move the negative symbol inside the function.

Tip: An easy search to catch up this, would be `-theme.spacing(`

## Icons

We have this kind of rules in buttons to cover the common use cases:

`svg path { fill: currentColor }`

In case you don't need the icon to be filled, you can apply this class to the svg parent: `.doNotFillIcon`

`<CloseIcon className="doNotFillIcon" />`

## Typography

`responsiveFontSizes` simplified due we want to resize only a few variants through the theme.

Added a few custom variants to the typography set:

- overlineDelicate
- code1
- code2
- code3

Some variants have been replaced because they were so specific to some components, these are:

- charts (replaced by `theme.palette.overline + weight='strong'`)

For external use: `Open Sans` and `Montserrat` families have been replaced by `Inter` and `Overpass Mono`, you have an example of this in the [`preview-head.html`](https://github.com/CartoDB/carto-react/blob/master/packages/react-ui/storybook/.storybook/preview-head.html) file.

We have a `Typography` component that uses `Mui Typography` and extends it with some useful props:

- weight
- italic

This way we can be more flexible regarding text styles without adding too many variants to the Mui component.

In short, instead of Mui Typography, the component you should use to add text is this one:
`react-ui/src/components/atoms/Typography`

For external use: `import { Typography } from '@carto/react-ui';`.

## Colors

Some keys have been removed from [color palette](https://github.com/CartoDB/carto-react/tree/master/packages/react-ui/src/theme) due they are unused:

- activatedOpacity
- hoverOpacity
- disabledOpacity
- selectedOpacity
- focusOpacity
- other, all removed but divider, which is moved to first level

Some others have been moved or replaced because they aren't native MUI keys and are so specific to some components, these are:

- charts (replaced by `theme.palette.black[%]`)

`grey palette` is not used to design (and therefore not for style) components directly. We have a set of neutral colors to use in the custom `default` variant.

We also have a set of `shade` colors (with transparency):

- black
- white

Important: `primary.relatedLight` and `secondary.relatedLight` has to be replaced by `primary.background` and `secondary.background`.

## Spacing

Design is restringed to a few specific values for spacing, which are:

`0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 12, 15`.

## Shapes

Design is restringed to a few specific values for border radius, which are:

`0.5, 1, 1.5, 2`.

Use: `borderRadius: theme.spacing(x)`

## Shadows / Elevations

Design is restringed to a few specific values for shadows, which are:

`0, 1, 2, 4, 6, 8, 16, 24`.

# Components

## Button

We have a `Button` component that uses `Mui Button` and wraps its children in `Typography` to meet with the designed behavior (text overflow case).

So, instead of Mui Button, the component you should use to create buttons is this one:
`react-ui/src/components/atoms/Button`

For external use: `import { Button } from '@carto/react-ui';`.

## Tooltip

Now, by default is placed `top` and has an `arrow` indicator, so you don't need to specify these properties anymore.

We have a new component for building data structures within Tooltips, `TooltipData`.

## Password Input Field

We have a custom component to build the show / hide content logic on top of TextField Mui component.

Instead of `<TextField type='password' /> ` you can use:
`react-ui/src/components/atoms/PasswordField`

For external use: `import { PasswordField } from '@carto/react-ui';`.

## Select Field

We have a custom component to build the `placeholder` and `multiple selection` logic on top of TextField Mui component.

Instead of `<TextField select /> ` or `<Select />` you can use:
`react-ui/src/components/atoms/SelectField`

For external use: `import { SelectField } from '@carto/react-ui';`.

## InputFile / UploadField

This component is used to display and input `type='file'`.

We are replacing `InputFile` component by the new `UploadField`.

Instead of `<Inputfile /> ` you can use:
`react-ui/src/components/molecules/UploadField`

For external use: `import { UploadField } from '@carto/react-ui';`.

## AppBar

We have a custom component to build the basic structure and styles on top of AppBar Mui component.

This component normalize size and position of common elements like:

- logo
- Texts
- Avatar
- Burger menu icon

You can use `<AppBar /> ` from:
`react-ui/src/components/organisms/AppBar`

For external use: `import { AppBar } from '@carto/react-ui';`.

# Testing

Mui5 has changed the DOM tags, so this is causing some E2E test to fail.

## Aria attributes

Mui5 has improve the `accesibility` of many of the components, adding by default some attributes to the DOM, like aria-label.

This can cause some tests to fail if `aria-label` is not correctly created, because if this attribute is present, `Playwright` will check its content rather than the text of the node itself.

## Tabs

Some tests rely on tab clicking, but with the new design, the click is disabled on selected tab. So, if your test fails in an assert like this:

`await page.getByRole('tab', { name: 'Map' }).click()`

Before the click, yo have to check if the tab is selected.

We have an `isAriaAttributeValue` function in `@utils/ariaAssertions` to check for some aria tags not supported by default by Playwright.

This assert will pass:

```
  const MapPreviewTab = page.getByRole('tab', { name: 'Map' })

  if (await isAriaAttributeValue(MapPreviewTab, 'selected', 'false')) {
    await MapPreviewTab.click()
  }
```