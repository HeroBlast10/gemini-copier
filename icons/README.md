# Extension Icons

This directory contains the icon files for the Gemini LaTeX Copier extension.

## Required Icon Sizes

The extension needs icons in the following sizes:
- 16x16 pixels (icon16.png)
- 48x48 pixels (icon48.png) 
- 128x128 pixels (icon128.png)

## Converting SVG to PNG

You can convert the provided `icon.svg` to the required PNG sizes using:

### Online Tools
- [CloudConvert](https://cloudconvert.com/svg-to-png)
- [Convertio](https://convertio.co/svg-png/)

### Command Line (if you have ImageMagick installed)
```bash
magick icon.svg -resize 16x16 icon16.png
magick icon.svg -resize 48x48 icon48.png
magick icon.svg -resize 128x128 icon128.png
```

### Using Inkscape
```bash
inkscape icon.svg --export-png=icon16.png --export-width=16 --export-height=16
inkscape icon.svg --export-png=icon48.png --export-width=48 --export-height=48
inkscape icon.svg --export-png=icon128.png --export-width=128 --export-height=128
```

## Icon Design

The icon features:
- Blue circular background representing the Google brand
- Mathematical symbols (integral, x², dx) showing the math focus
- Equals sign and result showing formula processing
- Small clipboard icon indicating the copy functionality
