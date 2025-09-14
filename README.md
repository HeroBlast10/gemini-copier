# Universal Math Formula Copier

A powerful cross-browser extension that enables copying mathematical formulas from AI platforms (Gemini, ChatGPT, Claude, DeepSeek, etc.) in LaTeX format with a simple double-click.

## 🌐 Browser Support

- **Chrome** (Manifest V3) - Chrome Web Store
- **Firefox** (Manifest V2) - Firefox Add-ons
- **Edge** (Manifest V3) - Edge Add-ons
- **Safari** (WebExtensions) - Safari Extensions

## Features

- 🌐 **Universal Compatibility**: Works on all websites - Gemini, ChatGPT, Claude, DeepSeek, Kimi, and more
- 🎯 **Double-click copying**: Double-click any mathematical formula to copy its LaTeX code
- 📋 **Clean LaTeX output**: Automatically removes delimiters and formatting
- 🔍 **Smart detection**: Identifies math content rendered by MathJax, KaTeX, and other libraries
- 🕸️ **Shadow DOM Support**: Advanced detection that works with modern web components
- 🎨 **Platform-Specific Optimization**: Tailored extraction logic for each AI platform
- ✨ **Visual feedback**: Hover effects and copy confirmation tooltips
- 🚀 **Non-intrusive**: Seamlessly integrates with any website's interface
- 🔄 **Real-time detection**: Automatically processes new math content as it appears

## Installation

### Method 1: Load as Unpacked Extension (Development)

1. **Generate Icons** (Required):
   - Open `create_icons.html` in your browser
   - Click "Generate Icons" then "Download Icons"
   - Save the downloaded PNG files in the `icons/` directory as:
     - `icon16.png`
     - `icon48.png` 
     - `icon128.png`

2. **Load Extension**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the extension directory

3. **Verify Installation**:
   - The extension icon should appear in your toolbar
   - Navigate to [gemini.google.com](https://gemini.google.com)
   - The popup should show "Extension is active on Gemini"

### Method 2: Chrome Web Store (Future)
*This extension is not yet published to the Chrome Web Store*

## Usage

1. **Visit Any AI Platform**: Navigate to Gemini, ChatGPT, Claude, DeepSeek, or any website with mathematical content

2. **Generate Math**: Ask for mathematical formulas, equations, or expressions

3. **Double-Click to Copy**: Double-click on any rendered formula to copy its LaTeX code to your clipboard

4. **Paste Anywhere**: Use the copied LaTeX in your documents, LaTeX editors, or other applications

### Supported Platforms

- **Google Gemini** (gemini.google.com)
- **ChatGPT** (chat.openai.com, chatgpt.com)
- **Claude** (claude.ai)
- **DeepSeek** (chat.deepseek.com)
- **Kimi** (kimi.ai)
- **Any website** with MathJax, KaTeX, or mathematical content

## Supported Math Formats

The extension can detect and copy from:

- **MathJax** rendered equations
- **KaTeX** formatted math
- **LaTeX delimiters**: `$$...$$`, `$...$`, `\[...\]`, `\(...\)`
- **Generic math elements** with common CSS classes
- **Text-based formulas** with LaTeX syntax

## Examples

When you double-click on formulas on any supported platform, you'll get clean LaTeX like:

```latex
\int x^2 dx = \frac{x^3}{3} + C
```

```latex
E = mc^2
```

```latex
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
```

### Fixed Issues Examples

**Taylor Series** (was: `ex=1+x+2!x_{2}+3!x_{3}+⋯=n=0\sum\inftyn!xn`):
```latex
e^x = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \cdots = \sum_{n=0}^{\infty} \frac{x^n}{n!}
```

**Theta Formula** (was: `θ(rad)=rs`):
```latex
\theta(\text{rad}) = \frac{s}{r}
```

**Black-Scholes d1** (was: `d1​=σT−t​ln(KSt​​)+(r−q+2σ2​)(T−t)​`):
```latex
d_1 = \frac{\ln\left(\frac{S_t}{K}\right) + \left(r - q + \frac{\sigma^2}{2}\right)(T - t)}{\sigma\sqrt{T - t}}
```

## Technical Details

### LaTeX Extraction Strategy (Based on DeepSeekFormulaCopy)

The extension uses a **source-first approach** to find original LaTeX code rather than reconstructing from rendered text:

1. **Direct Data Attributes** - `data-latex`, `data-math`, etc.
2. **KaTeX Annotation Elements** - `<annotation>` tags (most reliable)
3. **Image Alt Text** - LaTeX in image alt attributes
4. **Platform-Specific Sources** - Each platform's LaTeX storage method
5. **MathJax Scripts** - Script tags with LaTeX content
6. **Nested Element Search** - Recursive search in child elements

### Core Philosophy
- **Find, don't reconstruct**: Locate original LaTeX sources instead of reverse-engineering rendered text
- **Universal compatibility**: Works with any math rendering library (KaTeX, MathJax, etc.)
- **High reliability**: Avoids errors from text reconstruction
- **Simple logic**: Clean, maintainable code focused on source detection

### Architecture
- **Manifest V3** Chrome extension
- **Universal Content Script** injection for all websites
- **Mutation Observer** for dynamic content detection
- **Shadow DOM Support** for modern web components
- **Clipboard API** with fallback support

### Permissions
- `clipboardWrite`: Copy LaTeX to clipboard
- `activeTab`: Access current tab information
- `<all_urls>`: Universal compatibility with all websites

### Browser Compatibility
- Chrome 88+ (Manifest V3 support)
- Chromium-based browsers (Edge, Brave, etc.)

## Development

### File Structure
```
gemini-latex-copier/
├── manifest.json          # Extension configuration
├── content.js             # Main functionality
├── styles.css             # Visual styling
├── popup.html             # Extension popup
├── popup.js               # Popup functionality
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   └── icon.svg
├── create_icons.html       # Icon generation tool
└── README.md              # This file
```

### Key Components

1. **Formula Detection**: Uses multiple strategies to identify math content
2. **LaTeX Extraction**: Extracts clean LaTeX from various rendering formats
3. **Clipboard Integration**: Modern API with legacy fallback
4. **Visual Feedback**: Hover effects and copy confirmations

### Testing

Test the extension with various mathematical expressions:

- Simple equations: `x = 5`
- Complex integrals: `∫₀^∞ e^(-x²) dx`
- Matrix notation: `[1 2; 3 4]`
- Greek letters: `α, β, γ, Δ, Σ`
- Fractions: `\frac{a}{b}`
- Subscripts/superscripts: `x₁², y^{n+1}`

## Troubleshooting

### Extension Not Working
- Ensure you're on `gemini.google.com`
- Check that the extension is enabled in `chrome://extensions/`
- Refresh the Gemini page after installing

### Math Not Detected
- Try different math expressions
- Check browser console for errors (F12 → Console)
- Ensure Gemini is rendering math (not just text)

### Copy Not Working
- Check clipboard permissions
- Try the fallback copy method
- Ensure you're clicking directly on the formula

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with various math expressions
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Changelog

### v1.0.0
- Initial release
- Basic math detection and copying
- Support for MathJax and KaTeX
- Visual feedback system
- Chrome Manifest V3 compatibility

## 🔧 Troubleshooting

### If the extension is not working:

1. **Check Extension Status**
   - Open browser console (F12)
   - Paste the content of `debug-extension.js`
   - Run `debugExtension()` to check status

2. **Manual Detection**
   - In console, run `manualMathDetection()`
   - Check if elements are being processed

3. **Find Math Elements**
   - Run `findPotentialMathElements()` to see what's detected
   - Use `addTestClickHandler(element)` to test specific elements

4. **Common Issues**
   - **No elements detected**: Try refreshing the page
   - **No visual feedback**: Check if CSS is loaded properly
   - **Double-click not working**: Check console for errors
   - **LaTeX not copying**: Verify clipboard permissions

### Debug Commands

```javascript
// Check if extension is loaded
debugExtension()

// Manually trigger math detection
manualMathDetection()

// Find potential math elements
const elements = findPotentialMathElements()

// Test extraction on specific element
testExtractionOnElement(elements[0].element)

// Add test handler to element
addTestClickHandler(elements[0].element)
```

## 🔨 Development & Building

### Prerequisites

- Node.js 14+ (for build scripts)
- Git

### Building for Multiple Browsers

1. **Clone the repository**:
   ```bash
   git clone https://github.com/HeroBlast10/gemini-copier.git
   cd gemini-copier
   ```

2. **Build all browser packages**:
   ```bash
   npm run build
   ```

3. **Create ZIP files for store submission**:
   ```bash
   npm run zip
   ```

This generates:
- `dist/chrome/` - Chrome Web Store package (Manifest V3)
- `dist/firefox/` - Firefox Add-ons package (Manifest V2)
- `dist/edge/` - Edge Add-ons package (Manifest V3)
- `dist/safari/` - Safari Extensions package (WebExtensions)

### Manual Building

If you prefer manual building:

```bash
# Build specific browser
node build.js

# Or copy files manually for development
cp manifest.json dist/chrome/
cp manifest-v2.json dist/firefox/manifest.json
# ... copy other files
```

## 📦 Publishing

### Chrome Web Store
1. Upload `dist/chrome.zip` to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Fill in store listing details
3. Submit for review

### Firefox Add-ons
1. Upload `dist/firefox.zip` to [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)
2. Complete listing information
3. Submit for review

### Edge Add-ons
1. Upload `dist/edge.zip` to [Edge Add-ons Developer Dashboard](https://partner.microsoft.com/dashboard/microsoftedge/)
2. Complete store listing
3. Submit for review

### Safari Extensions
1. Use `dist/safari/` with Xcode to create Safari App Extension
2. Submit through App Store Connect
3. Follow Apple's review process

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across browsers
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Based on [DeepSeekFormulaCopy](https://github.com/DeepSeek-ai/DeepSeekFormulaCopy) architecture
- Inspired by the need for universal math formula copying across AI platforms
