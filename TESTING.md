# Testing Guide - Gemini LaTeX Copier

## Quick Test Setup

1. **Install Extension**: Follow the installation guide in `INSTALL.md`
2. **Open Test Page**: Open `test.html` in your browser to test basic functionality
3. **Test on Gemini**: Go to gemini.google.com for real-world testing

## Test Cases for Known Issues

### Issue 1: Incorrect LaTeX Format

**Problem**: Extension outputs malformed text like `d1​=σT−t​ln(KSt​​)+(r−q+2σ2​)(T−t)​`
**Expected**: Clean LaTeX like `d_1 = \frac{\ln(\frac{S_t}{K}) + (r - q + \frac{\sigma^2}{2})(T - t)}{\sigma\sqrt{T - t}}`

**Test Steps**:
1. Go to gemini.google.com
2. Ask: "Show me the Black-Scholes d1 formula"
3. Wait for response to render completely
4. Click on the formula
5. Paste result and verify it's proper LaTeX

### Issue 2: Incomplete Formula Recognition

**Problem**: Missing denominators, subscripts, and superscripts
**Expected**: Complete mathematical expressions with all components

**Test Steps**:
1. Ask Gemini: "Show me the quadratic formula with all steps"
2. Ask Gemini: "Show me integration by parts formula"
3. Ask Gemini: "Show me the Taylor series expansion"
4. Click on each formula and verify completeness

## Debugging Steps

### Step 1: Check Console Output
1. Open browser console (F12)
2. Look for messages from the extension
3. Check for any error messages

### Step 2: Use Debug Script
1. Go to gemini.google.com
2. Open console and paste content from `debug-gemini.js`
3. Ask Gemini to show mathematical formulas
4. Run: `window.geminiMathDebugger.scanForMath()`
5. Analyze the output to understand DOM structure

### Step 3: Manual DOM Inspection
1. Right-click on a mathematical formula in Gemini
2. Select "Inspect Element"
3. Look for:
   - Script tags with `type="math/tex"`
   - Elements with `data-latex` or similar attributes
   - MathML `<math>` elements
   - Annotation elements with LaTeX content

## Expected LaTeX Output Examples

| Input (Gemini Display) | Expected LaTeX Output |
|----------------------|----------------------|
| x² + y² = r² | `x^2 + y^2 = r^2` |
| ∫₀^∞ e^(-x²) dx | `\int_0^\infty e^{-x^2} dx` |
| α + β = γ | `\alpha + \beta = \gamma` |
| d₁ = (formula) | `d_1 = \frac{...}{...}` |
| √(x² + y²) | `\sqrt{x^2 + y^2}` |

## Common Issues and Solutions

### Math Not Detected
**Symptoms**: No hover effect, no click response
**Solutions**:
- Wait longer for Gemini to finish rendering
- Check if math is actually rendered (not just text)
- Use debug script to see what elements are found
- Try asking Gemini to "show in LaTeX format"

### Wrong LaTeX Output
**Symptoms**: Copied text has Unicode characters or missing parts
**Solutions**:
- Check console for extraction method used
- Verify the DOM structure matches expected patterns
- Try different types of mathematical expressions
- Use the debug script to analyze element structure

### Copy Not Working
**Symptoms**: No tooltip, no clipboard content
**Solutions**:
- Check clipboard permissions in chrome://extensions/
- Try the test page first
- Check browser console for errors
- Verify you're clicking directly on the math element

## Manual Testing Checklist

### Basic Functionality
- [ ] Extension loads without errors
- [ ] Popup shows correct status on Gemini
- [ ] Math elements show hover effects
- [ ] Click triggers copy action
- [ ] Tooltip appears with feedback
- [ ] Clipboard contains LaTeX code

### LaTeX Quality
- [ ] No Unicode mathematical symbols in output
- [ ] Fractions use `\frac{num}{den}` format
- [ ] Superscripts use `^{...}` format
- [ ] Subscripts use `_{...}` format
- [ ] Greek letters use `\alpha`, `\beta`, etc.
- [ ] Functions use `\sin`, `\cos`, `\ln`, etc.
- [ ] Operators use `\int`, `\sum`, `\sqrt`, etc.

### Edge Cases
- [ ] Complex nested fractions
- [ ] Mixed subscripts and superscripts
- [ ] Long mathematical expressions
- [ ] Matrices and arrays
- [ ] Piecewise functions
- [ ] Limit expressions
- [ ] Integration formulas

## Performance Testing

### Response Time
- Extension should detect new math within 1-2 seconds
- Click response should be immediate
- Tooltip should appear within 100ms

### Memory Usage
- Extension should not cause memory leaks
- Observer should not impact page performance
- Should handle pages with many formulas

## Reporting Issues

When reporting issues, please include:

1. **Browser version**: Chrome version number
2. **Extension version**: Check in chrome://extensions/
3. **Gemini URL**: Full URL where issue occurred
4. **Mathematical expression**: The formula you tried to copy
5. **Expected output**: What LaTeX you expected
6. **Actual output**: What was actually copied
7. **Console output**: Any error messages in browser console
8. **DOM structure**: Right-click → Inspect on the problematic formula

## Advanced Debugging

### Custom Test Expressions

Ask Gemini to show these specific formulas for testing:

```
1. "Show me the Black-Scholes option pricing formula"
2. "Display the quadratic formula with all variables labeled"
3. "Show me the integral of x² from 0 to infinity"
4. "Display Einstein's mass-energy equivalence"
5. "Show me the Taylor series for e^x"
6. "Display the Pythagorean theorem"
7. "Show me the derivative of sin(x)"
8. "Display the binomial theorem"
```

### Console Commands for Debugging

```javascript
// Check if extension is loaded
console.log('Extension loaded:', !!window.geminiLatexCopier);

// Manually scan for math
window.geminiMathDebugger?.scanForMath();

// Test extraction on specific element
const mathEl = document.querySelector('.MathJax'); // or other selector
if (mathEl) {
  console.log('Testing extraction on:', mathEl);
  // Manual extraction test would go here
}
```
