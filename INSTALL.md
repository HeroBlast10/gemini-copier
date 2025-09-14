# Installation Guide - Gemini LaTeX Copier

## Quick Start

### Step 1: Generate Icons
The extension requires icon files that aren't included in the repository. You need to create them:

1. Open `create_icons.html` in your web browser
2. Click "Generate Icons" 
3. Click "Download Icons"
4. Save the three downloaded files in the `icons/` folder:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

### Step 2: Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle switch in top right)
3. Click "Load unpacked"
4. Select the folder containing this extension
5. The extension should now appear in your extensions list

### Step 3: Test the Extension

1. Navigate to [gemini.google.com](https://gemini.google.com)
2. Click the extension icon - it should show "Extension is active on Gemini"
3. Ask Gemini to generate some mathematical formulas
4. Click on any formula to copy its LaTeX code

## Detailed Installation Steps

### Prerequisites
- Google Chrome 88+ or Chromium-based browser
- Developer mode access (for unpacked extensions)

### File Structure Check
Before installation, ensure your directory contains:
```
gemini-latex-copier/
├── manifest.json
├── content.js
├── styles.css
├── popup.html
├── popup.js
├── icons/
│   ├── icon16.png    ← You need to create these
│   ├── icon48.png    ← You need to create these
│   └── icon128.png   ← You need to create these
└── README.md
```

### Creating Icons (Detailed)

#### Option 1: Using the HTML Generator
1. Double-click `create_icons.html` to open in browser
2. Icons will be automatically generated and displayed
3. Click "Download Icons" to save all three sizes
4. Move the downloaded files to the `icons/` directory

#### Option 2: Using Online Tools
1. Use the provided `icons/icon.svg` file
2. Go to an online converter like [CloudConvert](https://cloudconvert.com/svg-to-png)
3. Convert to PNG at sizes: 16x16, 48x48, 128x128
4. Save as `icon16.png`, `icon48.png`, `icon128.png` in the `icons/` folder

#### Option 3: Using Command Line Tools
If you have ImageMagick installed:
```bash
cd icons/
magick icon.svg -resize 16x16 icon16.png
magick icon.svg -resize 48x48 icon48.png
magick icon.svg -resize 128x128 icon128.png
```

### Loading the Extension

1. **Open Extensions Page**:
   - Type `chrome://extensions/` in address bar, or
   - Menu → More Tools → Extensions

2. **Enable Developer Mode**:
   - Toggle the "Developer mode" switch in top right corner

3. **Load Extension**:
   - Click "Load unpacked" button
   - Navigate to and select the extension folder
   - Click "Select Folder"

4. **Verify Installation**:
   - Extension should appear in the list
   - Extension icon should appear in toolbar
   - No error messages should be displayed

### Testing Installation

1. **Basic Test**:
   - Go to [gemini.google.com](https://gemini.google.com)
   - Click extension icon
   - Should show "Extension is active on Gemini"

2. **Functionality Test**:
   - Ask Gemini: "Show me the quadratic formula in LaTeX format"
   - Wait for the response to fully render
   - Click on the generated formula
   - Should see "LaTeX copied!" tooltip
   - Paste clipboard content - should be clean LaTeX

3. **Advanced Test**:
   - Open `test.html` in your browser
   - Try clicking various math expressions
   - Verify LaTeX is copied correctly

4. **Debug Test** (if formulas aren't detected):
   - Go to gemini.google.com
   - Open browser console (F12)
   - Copy and paste the content of `debug-gemini.js`
   - Ask Gemini to show mathematical formulas
   - Run `window.geminiMathDebugger.scanForMath()` in console
   - Check the console output for detected math elements

## Troubleshooting

### Extension Won't Load
- **Check file structure**: Ensure all required files are present
- **Check icons**: Make sure PNG icon files exist in `icons/` folder
- **Check manifest**: Verify `manifest.json` is valid JSON
- **Check permissions**: Ensure you have developer mode enabled

### Extension Loads But Doesn't Work
- **Refresh Gemini**: Reload the gemini.google.com page
- **Check console**: Open DevTools (F12) and look for errors
- **Check permissions**: Extension needs clipboard and activeTab permissions
- **Try test page**: Use `test.html` to isolate issues

### Icons Not Displaying
- **Generate icons**: Use `create_icons.html` to create PNG files
- **Check file names**: Must be exactly `icon16.png`, `icon48.png`, `icon128.png`
- **Check file location**: Icons must be in `icons/` subdirectory
- **Reload extension**: Remove and re-add the extension

### Math Not Detected
- **Wait for rendering**: Give Gemini time to render math content
- **Try different expressions**: Some formats may not be supported yet
- **Check Gemini output**: Ensure Gemini is actually rendering math (not just text)

### Copy Not Working
- **Check clipboard permissions**: Extension needs clipboardWrite permission
- **Try manual copy**: Right-click → Copy as fallback
- **Check browser version**: Requires Chrome 88+ for Clipboard API

## Getting Help

If you encounter issues:

1. Check the browser console (F12 → Console) for error messages
2. Try the test page (`test.html`) to isolate the problem
3. Verify you're using a supported browser version
4. Make sure you're on the correct website (gemini.google.com)

## Uninstalling

To remove the extension:
1. Go to `chrome://extensions/`
2. Find "Gemini LaTeX Copier"
3. Click "Remove"
4. Confirm removal

The extension files will remain on your computer and can be reinstalled later.
