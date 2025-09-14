// Debug script for analyzing Gemini's math rendering
// Run this in the browser console on gemini.google.com to understand the DOM structure

class GeminiMathDebugger {
  constructor() {
    this.mathElements = [];
    this.init();
  }

  init() {
    console.log('🔍 Gemini Math Debugger initialized');
    this.scanForMath();
    this.setupMutationObserver();
  }

  scanForMath() {
    console.log('📊 Scanning for mathematical content...');
    
    // Clear previous results
    this.mathElements = [];
    
    // Look for various types of math elements
    const selectors = [
      // Standard math rendering
      '.MathJax', 'mjx-container', '.katex', 'math',
      
      // Potential Gemini-specific selectors
      '[class*="math"]', '[class*="equation"]', '[class*="formula"]',
      
      // Response containers
      '[data-test-id*="response"]', '[class*="response"]', '[class*="message"]'
    ];

    selectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (this.containsMathContent(el)) {
            this.mathElements.push({
              element: el,
              selector: selector,
              text: el.textContent?.substring(0, 100),
              html: el.outerHTML?.substring(0, 200)
            });
          }
        });
      } catch (e) {
        console.warn(`Selector failed: ${selector}`, e);
      }
    });

    console.log(`📈 Found ${this.mathElements.length} potential math elements`);
    this.logMathElements();
  }

  containsMathContent(element) {
    const text = element.textContent || '';
    
    // Check for mathematical Unicode
    const mathUnicode = /[α-ωΑ-Ω∫∑∏√∞∂∇±∓×÷≤≥≠≈≡∝∈∉⊂⊃⊆⊇∪∩∅→←↔⇒⇐⇔∀∃∄∧∨¬⊕⊗⊙]/;
    
    // Check for LaTeX patterns
    const latexPatterns = [
      /\\\w+/, // LaTeX commands
      /\$.*\$/, // Dollar delimiters
      /\\[(\[]/, // LaTeX delimiters
      /\^[{0-9]/, // Superscripts
      /_[{0-9]/, // Subscripts
      /\\frac/, // Fractions
      /\\int/, // Integrals
      /\\sum/, // Summations
    ];

    return mathUnicode.test(text) || latexPatterns.some(pattern => pattern.test(text));
  }

  logMathElements() {
    if (this.mathElements.length === 0) {
      console.log('❌ No mathematical elements found');
      return;
    }

    console.group('🧮 Mathematical Elements Found:');
    this.mathElements.forEach((item, index) => {
      console.group(`Element ${index + 1}:`);
      console.log('Selector:', item.selector);
      console.log('Tag:', item.element.tagName);
      console.log('Classes:', item.element.className);
      console.log('Text preview:', item.text);
      console.log('Element:', item.element);
      
      // Try to extract LaTeX using various methods
      this.analyzeElement(item.element);
      
      console.groupEnd();
    });
    console.groupEnd();
  }

  analyzeElement(element) {
    console.group('🔬 LaTeX Extraction Analysis:');
    
    // Method 1: Script tags
    const scripts = element.querySelectorAll('script[type*="math"]');
    if (scripts.length > 0) {
      console.log('📜 Script tags found:', scripts.length);
      scripts.forEach((script, i) => {
        console.log(`Script ${i + 1}:`, script.textContent);
      });
    }

    // Method 2: Data attributes
    const dataAttrs = [];
    for (const attr of element.attributes) {
      if (attr.name.includes('math') || attr.name.includes('latex') || attr.name.includes('tex')) {
        dataAttrs.push(`${attr.name}: ${attr.value}`);
      }
    }
    if (dataAttrs.length > 0) {
      console.log('📋 Data attributes:', dataAttrs);
    }

    // Method 3: MathML content
    const mathml = element.querySelector('math') || (element.tagName === 'MATH' ? element : null);
    if (mathml) {
      console.log('🔢 MathML found:', mathml.outerHTML.substring(0, 200));
    }

    // Method 4: Annotation elements (KaTeX)
    const annotations = element.querySelectorAll('annotation');
    if (annotations.length > 0) {
      console.log('📝 Annotations found:');
      annotations.forEach((ann, i) => {
        console.log(`Annotation ${i + 1} (${ann.getAttribute('encoding')}):`, ann.textContent);
      });
    }

    // Method 5: Check for MathJax data
    if (typeof window.MathJax !== 'undefined') {
      console.log('🧮 MathJax version:', window.MathJax.version || 'Unknown');
      
      // Try to find associated data
      try {
        if (window.MathJax.Hub && window.MathJax.Hub.getJaxFor) {
          const jax = window.MathJax.Hub.getJaxFor(element);
          if (jax) {
            console.log('📊 MathJax JAX data:', jax);
          }
        }
      } catch (e) {
        console.log('⚠️ Could not access MathJax data:', e.message);
      }
    }

    console.groupEnd();
  }

  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      let hasNewMath = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE && this.containsMathContent(node)) {
              hasNewMath = true;
            }
          });
        }
      });

      if (hasNewMath) {
        console.log('🔄 New mathematical content detected');
        setTimeout(() => this.scanForMath(), 500);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Test LaTeX extraction on all found elements
  testExtractionMethods() {
    console.group('🧪 Testing LaTeX Extraction Methods:');
    
    this.mathElements.forEach((item, index) => {
      console.group(`Testing Element ${index + 1}:`);
      
      const element = item.element;
      
      // Test each extraction method
      console.log('Original text:', element.textContent?.substring(0, 100));
      
      // Add your extraction methods here for testing
      console.log('Element for manual inspection:', element);
      
      console.groupEnd();
    });
    
    console.groupEnd();
  }
}

// Auto-initialize when script is loaded
console.log('🚀 Loading Gemini Math Debugger...');
const debugger = new GeminiMathDebugger();

// Make it available globally for manual testing
window.geminiMathDebugger = debugger;

console.log('✅ Gemini Math Debugger ready!');
console.log('💡 Use window.geminiMathDebugger.testExtractionMethods() to test extraction');
console.log('💡 Use window.geminiMathDebugger.scanForMath() to rescan for math elements');
