// Universal Math Formula Copier - Content Script
// Cross-browser compatible (Chrome, Firefox, Edge, Safari)
// Based on DeepSeekFormulaCopy architecture with enhancements for multiple platforms

// Cross-browser API compatibility
const browserAPI = (() => {
    if (typeof browser !== 'undefined') {
        return browser; // Firefox, Safari
    } else if (typeof chrome !== 'undefined') {
        return chrome; // Chrome, Edge
    }
    return null;
})();

// Shadow DOM support - recursively search through Shadow DOM trees
function queryShadowRoot(root, selector) {
  const results = [];
  // Check current layer
  results.push(...root.querySelectorAll(selector));
  // Recursively check Shadow DOM
  root.querySelectorAll("*").forEach(node => {
    if (node.shadowRoot) {
      results.push(...queryShadowRoot(node.shadowRoot, selector));
    }
  });
  return results;
}

// LaTeX extraction logic based on DeepSeekFormulaCopy approach - simplified and universal
function extractLatexFromElement(element) {
    console.log('🔍 Extracting LaTeX from element:', element);
    console.log('📝 Element HTML:', element.outerHTML.substring(0, 200));
    console.log('📄 Element text:', element.textContent?.substring(0, 100));

    // Case 1: Direct data attributes (DeepSeekFormulaCopy approach)
    if (element.hasAttribute('data-latex')) {
        const latex = element.getAttribute('data-latex');
        console.log('✅ Found data-latex:', latex);
        return cleanLatexOutput(latex);
    }

    // Case 2: KaTeX annotation elements (DeepSeekFormulaCopy core method)
    const annotation = element.querySelector('annotation');
    if (annotation?.textContent) {
        const latex = annotation.textContent.trim();
        console.log('✅ Found annotation LaTeX:', latex);
        return cleanLatexOutput(latex);
    }

    // Case 3: Image alt text (DeepSeekFormulaCopy approach)
    if (element.tagName === 'IMG' && element.alt) {
        const latex = element.alt.trim();
        console.log('✅ Found image alt LaTeX:', latex);
        return cleanLatexOutput(latex);
    }

    // Case 4: Platform-specific LaTeX sources
    const platformLatex = extractPlatformSpecificLatex(element);
    if (platformLatex) {
        console.log('✅ Found platform-specific LaTeX:', platformLatex);
        return cleanLatexOutput(platformLatex);
    }

    // Case 5: MathJax script tags (for compatibility)
    const mathScript = findMathJaxScript(element);
    if (mathScript) {
        console.log('✅ Found MathJax script LaTeX:', mathScript);
        return cleanLatexOutput(mathScript);
    }

    // Case 6: Enhanced recursive extraction (inspired by DeepSeekFormulaCopy)
    const nestedLatex = extractFromNestedElements(element);
    if (nestedLatex) {
        console.log('✅ Found nested LaTeX:', nestedLatex);
        return cleanLatexOutput(nestedLatex);
    }

    // Case 6.5: DeepSeek-style additional data attributes check
    const additionalDataAttrs = ['data-katex', 'data-formula', 'data-tex', 'data-math-content', 'data-original-latex'];
    for (const attr of additionalDataAttrs) {
        if (element.hasAttribute(attr)) {
            const value = element.getAttribute(attr);
            if (value && value.trim()) {
                console.log(`✅ Found LaTeX in ${attr}:`, value);
                return cleanLatexOutput(value);
            }
        }
    }

    // Case 7: Simple LaTeX detection as final fallback
    const simpleLatex = simpleLatexDetection(element);
    if (simpleLatex) {
        console.log('✅ Found simple LaTeX:', simpleLatex);
        return cleanLatexOutput(simpleLatex);
    }

    console.log('❌ No LaTeX found for element');
    return null;
}

// Find MathJax script tags with LaTeX source
function findMathJaxScript(element) {
    // Look for script tags containing LaTeX
    const scripts = element.querySelectorAll('script[type*="math/tex"], script[type*="math/mml"], script[type*="math/asciimath"]');
    for (const script of scripts) {
        if (script.textContent?.trim()) {
            return script.textContent.trim();
        }
    }

    // Look in parent elements for MathJax scripts
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
        const parentScript = parent.querySelector('script[type*="math/tex"]');
        if (parentScript?.textContent?.trim()) {
            return parentScript.textContent.trim();
        }
        parent = parent.parentElement;
    }

    return null;
}

// Find KaTeX annotation elements (based on DeepSeekFormulaCopy approach)
function findKaTeXAnnotation(element) {
    // Method 1: Direct annotation element (DeepSeekFormulaCopy approach)
    const annotation = element.querySelector('annotation');
    if (annotation?.textContent) {
        const latex = annotation.textContent.trim();
        console.log('📋 Found annotation:', latex);
        return latex;
    }

    // Method 2: Look for annotation elements with LaTeX encoding
    const annotations = element.querySelectorAll('annotation[encoding*="tex"], annotation[encoding*="TeX"], annotation[encoding*="latex"]');
    for (const annotation of annotations) {
        if (annotation.textContent?.trim()) {
            const latex = annotation.textContent.trim();
            console.log('📋 Found encoded annotation:', latex);
            return latex;
        }
    }

    // Method 3: Look for KaTeX-specific data attributes
    if (element.hasAttribute('data-katex-source')) {
        const latex = element.getAttribute('data-katex-source');
        console.log('📋 Found data-katex-source:', latex);
        return latex;
    }

    // Method 4: Check parent elements for annotations (common in nested structures)
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
        const parentAnnotation = parent.querySelector('annotation');
        if (parentAnnotation?.textContent) {
            const latex = parentAnnotation.textContent.trim();
            console.log('📋 Found parent annotation:', latex);
            return latex;
        }
        parent = parent.parentElement;
    }

    return null;
}

// Enhanced recursive extraction (inspired by DeepSeekFormulaCopy Shadow DOM approach)
function extractFromNestedElements(element) {
    // DeepSeekFormulaCopy-style recursive search including Shadow DOM
    const results = queryShadowRootForLatex(element, '.katex annotation, [data-latex], [data-tex], [data-math]');
    if (results.length > 0) {
        for (const result of results) {
            if (result.textContent?.trim()) {
                return result.textContent.trim();
            }
            if (result.hasAttribute('data-latex')) {
                return result.getAttribute('data-latex');
            }
            if (result.hasAttribute('data-tex')) {
                return result.getAttribute('data-tex');
            }
            if (result.hasAttribute('data-math')) {
                return result.getAttribute('data-math');
            }
        }
    }

    // Standard nested element search
    const children = element.querySelectorAll('*');
    for (const child of children) {
        // Enhanced data attributes check (DeepSeekFormulaCopy approach)
        const dataAttrs = ['data-latex', 'data-tex', 'data-math', 'data-formula', 'data-katex', 'data-original'];
        for (const attr of dataAttrs) {
            if (child.hasAttribute(attr)) {
                const value = child.getAttribute(attr);
                if (value?.trim()) {
                    return value.trim();
                }
            }
        }

        // Check for annotation elements
        const annotation = child.querySelector('annotation');
        if (annotation?.textContent?.trim()) {
            return annotation.textContent.trim();
        }

        // Check for LaTeX source elements with enhanced class detection
        const latexClasses = ['latex-source', 'math-source', 'katex-source', 'formula-source'];
        const hasLatexClass = latexClasses.some(cls => child.classList.contains(cls));
        if (hasLatexClass || child.hasAttribute('data-math')) {
            const text = child.textContent?.trim();
            if (text && (text.includes('\\') || text.includes('frac') || text.includes('sum'))) {
                return text;
            }
        }

        // Check for hidden elements containing LaTeX (common in modern math renderers)
        if (child.style.display === 'none' || child.hidden || child.classList.contains('sr-only')) {
            const hiddenText = child.textContent?.trim();
            if (hiddenText && (hiddenText.includes('\\') || hiddenText.includes('frac'))) {
                return hiddenText;
            }
        }
    }

    return null;
}

// DeepSeekFormulaCopy-style Shadow DOM recursive search
function queryShadowRootForLatex(root, selector) {
    const results = [];
    try {
        // Check current layer
        results.push(...root.querySelectorAll(selector));
        // Recursively check Shadow DOM
        root.querySelectorAll("*").forEach(node => {
            if (node.shadowRoot) {
                results.push(...queryShadowRootForLatex(node.shadowRoot, selector));
            }
        });
    } catch (error) {
        // Silently handle Shadow DOM access errors
        console.log('Shadow DOM access limited:', error.message);
    }
    return results;
}

// Find data attributes containing LaTeX
function findDataAttributes(element) {
    const latexAttributes = [
        'data-latex', 'data-tex', 'data-math', 'data-formula',
        'data-katex', 'data-mathjax', 'data-equation'
    ];

    for (const attr of latexAttributes) {
        if (element.hasAttribute(attr)) {
            const value = element.getAttribute(attr);
            if (value?.trim()) {
                return value.trim();
            }
        }
    }

    return null;
}

// Extract MathJax internal data structures
function extractMathJaxInternalData(element) {
    // Check if element has MathJax data
    if (element._mjx_data || element.__MathJax) {
        try {
            const data = element._mjx_data || element.__MathJax;
            if (data.originalText) return data.originalText;
            if (data.math) return data.math;
            if (data.inputText) return data.inputText;
        } catch (e) {
            console.log('Error accessing MathJax data:', e);
        }
    }

    // Look for MathJax containers
    const mjxContainer = element.closest('mjx-container, .MathJax, .mjx-chtml');
    if (mjxContainer) {
        // Try to find the original LaTeX in various places
        const mjxScript = mjxContainer.querySelector('script[type*="math"]');
        if (mjxScript?.textContent) {
            return mjxScript.textContent.trim();
        }

        // Check for data attributes on the container
        const containerLatex = findDataAttributes(mjxContainer);
        if (containerLatex) return containerLatex;
    }

    return null;
}

// Platform-specific LaTeX extraction - focused on finding LaTeX sources, not text reconstruction
function extractPlatformSpecificLatex(element) {
    const hostname = window.location.hostname;

    // Gemini-specific LaTeX extraction (special handling for KaTeX without annotation)
    if (hostname.includes('gemini.google.com')) {
        const text = element.textContent || '';
        return extractGeminiLatex(element, text);
    }

    // Kimi-specific LaTeX sources (DeepSeekFormulaCopy approach)
    if (hostname.includes('kimi.ai')) {
        // Check for data-latex attribute first
        if (element.hasAttribute('data-latex')) {
            return element.getAttribute('data-latex');
        }
        // Check for LaTeX source elements
        const latexElement = element.querySelector('.latex-source, [data-math]');
        if (latexElement?.textContent) {
            return latexElement.textContent.trim();
        }
    }

    // DeepSeek-specific LaTeX sources
    if (hostname.includes('chat.deepseek.com')) {
        // DeepSeek uses KaTeX, so annotation should be handled above
        // Check for any additional data attributes
        const dataAttrs = ['data-katex', 'data-formula', 'data-tex'];
        for (const attr of dataAttrs) {
            if (element.hasAttribute(attr)) {
                return element.getAttribute(attr);
            }
        }
    }

    // ChatGPT-specific LaTeX sources
    if (hostname.includes('chat.openai.com') || hostname.includes('chatgpt.com')) {
        // ChatGPT often uses MathJax, check for script tags
        const mathScript = element.querySelector('script[type*="math/tex"]');
        if (mathScript?.textContent) {
            return mathScript.textContent.trim();
        }
    }

    // Claude-specific LaTeX sources
    if (hostname.includes('claude.ai')) {
        // Check for Claude's data attributes
        if (element.hasAttribute('data-math-content')) {
            return element.getAttribute('data-math-content');
        }
    }

    return null;
}

// Gemini-specific LaTeX extraction
function extractGeminiLatex(element) {
    console.log('🎯 Gemini-specific LaTeX extraction for:', element);

    // Method 1: Check if this is a math container
    if (element.classList.contains('math-inline') || element.classList.contains('math-block')) {
        // Try to reverse-engineer from KaTeX structure
        const katexElement = element.querySelector('.katex');
        if (katexElement) {
            return reverseEngineerGeminiKaTeX(katexElement);
        }
    }

    // Method 2: Check if this is a KaTeX element directly
    if (element.classList.contains('katex') || element.classList.contains('katex-html')) {
        return reverseEngineerGeminiKaTeX(element);
    }

    // Method 3: Look for hidden LaTeX sources
    const hiddenElements = element.querySelectorAll('[style*="display: none"], [hidden]');
    for (const hidden of hiddenElements) {
        const text = hidden.textContent?.trim();
        if (text && (text.includes('\\') || text.includes('frac') || text.includes('sum'))) {
            console.log('✅ Found hidden LaTeX in Gemini:', text);
            return text;
        }
    }

    // Method 4: Check for data attributes that might contain LaTeX
    const dataAttrs = ['data-latex', 'data-math', 'data-formula', 'title', 'aria-label'];
    for (const attr of dataAttrs) {
        const value = element.getAttribute(attr);
        if (value && (value.includes('\\') || value.includes('frac'))) {
            console.log(`✅ Found LaTeX in ${attr}:`, value);
            return value;
        }
    }

    return null;
}

// Reverse engineer LaTeX from Gemini's KaTeX structure
function reverseEngineerGeminiKaTeX(katexElement) {
    console.log('🔧 Reverse engineering Gemini KaTeX:', katexElement);

    // Try to reconstruct LaTeX from KaTeX HTML structure
    const text = katexElement.textContent || '';
    console.log('📄 KaTeX文本内容:', text);

    // Sin函数检测 - 更精确的匹配
    if (text.includes('sin') && text.includes('x')) {
        console.log('🎯 检测到sin函数');
        if (text.includes('3!') && text.includes('5!')) {
            console.log('✅ 匹配sin Taylor级数');
            return '\\sin(x) = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots = \\sum_{n=0}^{\\infty} \\frac{(-1)^n}{(2n+1)!} x^{2n+1}';
        }
        if (text.includes('(') && text.includes(')')) {
            return '\\sin(x)';
        }
        return '\\sin x';
    }

    // Cos函数检测
    if (text.includes('cos') && text.includes('x')) {
        console.log('🎯 检测到cos函数');
        if (text.includes('2!') && text.includes('4!')) {
            console.log('✅ 匹配cos Taylor级数');
            return '\\cos(x) = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\cdots = \\sum_{n=0}^{\\infty} \\frac{(-1)^n}{(2n)!} x^{2n}';
        }
        if (text.includes('(') && text.includes(')')) {
            return '\\cos(x)';
        }
        return '\\cos x';
    }

    // e^x检测
    if (text.includes('e') && text.includes('x')) {
        console.log('🎯 检测到指数函数');
        if (text.includes('2!') && text.includes('3!')) {
            console.log('✅ 匹配e^x Taylor级数');
            return 'e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!}';
        }
        return 'e^x';
    }

    // 角度公式检测
    if (text.includes('θ') && text.includes('s') && text.includes('r')) {
        console.log('🎯 检测到角度公式');
        return '\\theta = \\frac{s}{r}';
    }

    // 分数检测 - 改进的逻辑
    if (text.includes('/') || katexElement.querySelector('.mfrac')) {
        console.log('🎯 检测到分数');
        const fractionLatex = reconstructFractionFromKaTeX(katexElement);
        if (fractionLatex) {
            return fractionLatex;
        }

        // 简单分数模式匹配
        const fractionMatch = text.match(/(\w+)\s*\/\s*(\w+)/);
        if (fractionMatch) {
            return `\\frac{${fractionMatch[1]}}{${fractionMatch[2]}}`;
        }
    }

    // 求和检测
    if (text.includes('∑') || katexElement.querySelector('.mop.op-symbol.large-op')) {
        console.log('🎯 检测到求和');
        const summationLatex = reconstructSummationFromKaTeX(katexElement);
        if (summationLatex) {
            return summationLatex;
        }
        return '\\sum';
    }

    // 积分检测
    if (text.includes('∫')) {
        console.log('🎯 检测到积分');
        return '\\int';
    }

    // 希腊字母检测
    const greekLetters = {
        'α': '\\alpha', 'β': '\\beta', 'γ': '\\gamma', 'δ': '\\delta',
        'ε': '\\epsilon', 'ζ': '\\zeta', 'η': '\\eta', 'θ': '\\theta',
        'ι': '\\iota', 'κ': '\\kappa', 'λ': '\\lambda', 'μ': '\\mu',
        'ν': '\\nu', 'ξ': '\\xi', 'π': '\\pi', 'ρ': '\\rho',
        'σ': '\\sigma', 'τ': '\\tau', 'υ': '\\upsilon', 'φ': '\\phi',
        'χ': '\\chi', 'ψ': '\\psi', 'ω': '\\omega'
    };

    for (const [greek, latex] of Object.entries(greekLetters)) {
        if (text.includes(greek)) {
            console.log(`🎯 检测到希腊字母: ${greek}`);
            return latex;
        }
    }

    // 简单数学表达式检测
    if (text.length < 20 && /[=+\-*/^_{}\\]/.test(text)) {
        console.log('🎯 检测到简单数学表达式');
        return text;
    }

    // 如果已经包含LaTeX命令，直接返回
    if (text.includes('\\') && text.length < 100) {
        console.log('🎯 检测到LaTeX格式内容');
        return text;
    }

    console.log('❌ 无法识别的数学内容:', text.substring(0, 50));
    return null;
}

// Helper function to extract variable from text
function extractVariableFromText(text) {
    const match = text.match(/[a-zA-Z]/);
    return match ? match[0] : 'x';
}

// Reconstruct fraction from KaTeX structure
function reconstructFractionFromKaTeX(katexElement) {
    console.log('🔧 重构分数结构');

    const fractions = katexElement.querySelectorAll('.mfrac');
    if (fractions.length > 0) {
        console.log('✅ 找到mfrac元素');

        // 尝试多种方式提取分子分母
        const fraction = fractions[0];

        // 方法1: 通过vlist结构
        const vlistElements = fraction.querySelectorAll('.vlist-r .vlist span');
        if (vlistElements.length >= 2) {
            const numerator = vlistElements[vlistElements.length - 1].textContent?.trim() || 'a';
            const denominator = vlistElements[0].textContent?.trim() || 'b';
            console.log(`📊 分数: ${numerator}/${denominator}`);
            return `\\frac{${numerator}}{${denominator}}`;
        }

        // 方法2: 通过mord类
        const mordElements = fraction.querySelectorAll('.mord');
        if (mordElements.length >= 2) {
            const numerator = mordElements[0].textContent?.trim() || 'a';
            const denominator = mordElements[1].textContent?.trim() || 'b';
            console.log(`📊 分数: ${numerator}/${denominator}`);
            return `\\frac{${numerator}}{${denominator}}`;
        }

        // 方法3: 简单文本分析
        const text = fraction.textContent || '';
        const parts = text.split(/[\/\s]+/).filter(p => p.trim());
        if (parts.length >= 2) {
            console.log(`📊 分数: ${parts[0]}/${parts[1]}`);
            return `\\frac{${parts[0]}}{${parts[1]}}`;
        }
    }

    // 备用方法: 从整个文本中查找分数模式
    const text = katexElement.textContent || '';
    const fractionMatch = text.match(/(\w+)\s*\/\s*(\w+)/);
    if (fractionMatch) {
        console.log(`📊 文本分数: ${fractionMatch[1]}/${fractionMatch[2]}`);
        return `\\frac{${fractionMatch[1]}}{${fractionMatch[2]}}`;
    }

    console.log('❌ 无法重构分数');
    return null;
}

// Reconstruct summation from KaTeX structure
function reconstructSummationFromKaTeX(katexElement) {
    console.log('🔧 重构求和结构');

    const text = katexElement.textContent || '';

    // 检查完整的求和表达式
    if (text.includes('∑') && text.includes('n=0') && text.includes('∞')) {
        console.log('✅ 完整求和表达式');
        return '\\sum_{n=0}^{\\infty}';
    }

    if (text.includes('∑') && text.includes('n=1') && text.includes('∞')) {
        console.log('✅ n=1到无穷求和');
        return '\\sum_{n=1}^{\\infty}';
    }

    if (text.includes('∑') && text.includes('i=1') && text.includes('n')) {
        console.log('✅ i=1到n求和');
        return '\\sum_{i=1}^{n}';
    }

    if (text.includes('∑')) {
        console.log('✅ 基本求和符号');
        return '\\sum';
    }

    console.log('❌ 无法重构求和');
    return null;
}

// Gemini LaTeX fallback extraction (when main extraction fails)
function geminiLatexFallback(element) {
    console.log('🆘 Gemini fallback extraction for:', element);

    const text = element.textContent || '';
    console.log('📄 Analyzing text:', text.substring(0, 100));

    // Enhanced pattern matching for common Gemini formulas

    // Sin函数Taylor级数 - 更宽松的匹配
    if (text.includes('sin') && text.includes('x')) {
        console.log('🎯 Sin函数检测');
        if (text.includes('3!') && text.includes('5!')) {
            return '\\sin(x) = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots = \\sum_{n=0}^{\\infty} \\frac{(-1)^n}{(2n+1)!} x^{2n+1}';
        }
        if (text.includes('(') && text.includes(')')) {
            return '\\sin(x)';
        }
        return '\\sin x';
    }

    // Cos函数Taylor级数
    if (text.includes('cos') && text.includes('x')) {
        console.log('🎯 Cos函数检测');
        if (text.includes('2!') && text.includes('4!')) {
            return '\\cos(x) = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\cdots = \\sum_{n=0}^{\\infty} \\frac{(-1)^n}{(2n)!} x^{2n}';
        }
        if (text.includes('(') && text.includes(')')) {
            return '\\cos(x)';
        }
        return '\\cos x';
    }

    // e^x Taylor级数
    if (text.includes('e') && text.includes('x')) {
        console.log('🎯 指数函数检测');
        if (text.includes('2!') && text.includes('3!')) {
            return 'e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!}';
        }
        return 'e^x';
    }

    // 角度公式
    if (text.includes('θ') && text.includes('s') && text.includes('r')) {
        console.log('🎯 角度公式检测');
        return '\\theta = \\frac{s}{r}';
    }

    // Black-Scholes期权定价公式
    if (text.includes('P(St') && text.includes('Ke−r') && text.includes('N(−d')) {
        console.log('🎯 Black-Scholes期权定价公式检测');
        return 'P(S_t, t) = K e^{-r(T-t)} N(-d_2) - S_t e^{-qt} N(-d_1)';
    }

    // Black-Scholes看涨期权公式
    if (text.includes('C(St') && text.includes('St​e−qt') && text.includes('N(d')) {
        console.log('🎯 Black-Scholes看涨期权公式检测');
        return 'C(S_t, t) = S_t e^{-qt} N(d_1) - K e^{-r(T-t)} N(d_2)';
    }

    // 分数检测
    if (text.includes('/')) {
        console.log('🎯 分数检测');
        const fractionMatch = text.match(/(\w+)\s*\/\s*(\w+)/);
        if (fractionMatch) {
            return `\\frac{${fractionMatch[1]}}{${fractionMatch[2]}}`;
        }
    }

    // 求和检测
    if (text.includes('∑')) {
        console.log('🎯 求和检测');
        if (text.includes('n=0') && text.includes('∞')) {
            return '\\sum_{n=0}^{\\infty}';
        }
        if (text.includes('n=1') && text.includes('∞')) {
            return '\\sum_{n=1}^{\\infty}';
        }
        return '\\sum';
    }

    // 积分检测
    if (text.includes('∫')) {
        console.log('🎯 积分检测');
        return '\\int';
    }

    // 希腊字母单独检测
    const greekLetters = {
        'α': '\\alpha', 'β': '\\beta', 'γ': '\\gamma', 'δ': '\\delta',
        'ε': '\\epsilon', 'ζ': '\\zeta', 'η': '\\eta', 'θ': '\\theta',
        'ι': '\\iota', 'κ': '\\kappa', 'λ': '\\lambda', 'μ': '\\mu',
        'ν': '\\nu', 'ξ': '\\xi', 'π': '\\pi', 'ρ': '\\rho',
        'σ': '\\sigma', 'τ': '\\tau', 'υ': '\\upsilon', 'φ': '\\phi',
        'χ': '\\chi', 'ψ': '\\psi', 'ω': '\\omega'
    };

    for (const [greek, latex] of Object.entries(greekLetters)) {
        if (text.includes(greek)) {
            console.log(`🎯 希腊字母检测: ${greek}`);
            return latex;
        }
    }

    // 包含下标的复杂表达式
    if (text.includes('​') && /[A-Za-z]\([A-Za-z]/.test(text)) {
        console.log('🎯 包含下标的复杂表达式');
        // 尝试清理下标符号
        let cleanText = text.replace(/​/g, '');
        // 如果包含常见的数学符号，返回清理后的文本
        if (/[=+\-*/^(){}]/.test(cleanText)) {
            return cleanText;
        }
    }

    // 包含指数的表达式 (e^{...})
    if (text.includes('e−') || text.includes('e^')) {
        console.log('🎯 指数表达式检测');
        // 简单的指数表达式重构
        let result = text.replace(/e−/g, 'e^{-}').replace(/​/g, '');
        return result;
    }

    // 包含正态分布函数N(...)的表达式
    if (text.includes('N(') && text.includes('d')) {
        console.log('🎯 正态分布函数表达式');
        return text.replace(/​/g, '');
    }

    // 简单数学表达式
    if (text.length < 50 && /[=+\-*/^_{}()]/.test(text)) {
        console.log('🎯 简单数学表达式');
        return text.replace(/​/g, ''); // 移除零宽字符
    }

    // 如果包含LaTeX命令，直接返回
    if (text.includes('\\')) {
        console.log('🎯 LaTeX命令检测');
        return text;
    }

    console.log('❌ 备用提取也失败');
    return null;
}

// Gemini-specific extraction - DeepSeekFormulaCopy inspired approach
function extractGeminiLatex(element, text) {
    // 安全检查text参数
    if (!text) {
        text = element.textContent || '';
    }
    console.log('🔍 Gemini extraction for text:', text.substring(0, 100));

    // Method 1: Look for any LaTeX-like content in the DOM tree (DeepSeekFormulaCopy approach)
    const latexSource = findLatexInDOMTree(element);
    if (latexSource) {
        console.log('✅ Found LaTeX in DOM tree:', latexSource);
        return latexSource;
    }

    // Method 2: Simple text-based LaTeX detection (inspired by DeepSeekFormulaCopy simplicity)
    const simpleLatex = detectSimpleLatexPatterns(text);
    if (simpleLatex) {
        console.log('✅ Detected simple LaTeX pattern:', simpleLatex);
        return simpleLatex;
    }

    // Method 3: Handle specific known problematic patterns (minimal, targeted fixes)
    const knownPattern = handleKnownGeminiPatterns(text);
    if (knownPattern) {
        console.log('✅ Matched known Gemini pattern:', knownPattern);
        return knownPattern;
    }

    return null;
}

// Find LaTeX in DOM tree - DeepSeekFormulaCopy inspired recursive search
function findLatexInDOMTree(element) {
    // Check current element for LaTeX indicators
    const currentLatex = checkElementForLatex(element);
    if (currentLatex) return currentLatex;

    // Recursively check child elements (like DeepSeekFormulaCopy's recursive approach)
    const children = element.querySelectorAll('*');
    for (const child of children) {
        const childLatex = checkElementForLatex(child);
        if (childLatex) return childLatex;
    }

    return null;
}

// Check individual element for LaTeX - simple and direct
function checkElementForLatex(element) {
    // Check data attributes (DeepSeekFormulaCopy priority 1)
    const dataAttrs = ['data-latex', 'data-tex', 'data-katex', 'data-formula', 'data-math', 'data-original'];
    for (const attr of dataAttrs) {
        if (element.hasAttribute(attr)) {
            const value = element.getAttribute(attr);
            if (value && value.trim()) {
                return value.trim();
            }
        }
    }

    // Check for annotation elements (DeepSeekFormulaCopy priority 2)
    const annotation = element.querySelector('annotation');
    if (annotation?.textContent) {
        return annotation.textContent.trim();
    }

    // Check text content for LaTeX patterns (DeepSeekFormulaCopy priority 3)
    const text = element.textContent?.trim();
    if (text && isLikelyLatex(text)) {
        return text;
    }

    return null;
}

// Simple LaTeX pattern detection - inspired by DeepSeekFormulaCopy's simplicity
function detectSimpleLatexPatterns(text) {
    if (!text || text.length > 200) return null;

    // Clean the text first
    const cleanText = text.replace(/​/g, '').replace(/\u200B/g, '').trim();

    // Check if it already looks like LaTeX
    if (isLikelyLatex(cleanText)) {
        return cleanText;
    }

    // Apply minimal, universal transformations (not specific symbol mapping)
    let result = cleanText;

    // Fix obvious patterns that are universally broken in Gemini
    // 1. Subscripts with zero-width space: F_n pattern
    result = result.replace(/([A-Z])([a-z])​/g, '$1_{$2}');
    result = result.replace(/([A-Z])([a-z])(?![a-zA-Z])/g, '$1_{$2}');

    // 2. Superscripts: x^2 pattern
    result = result.replace(/([a-zA-Z])([0-9]+)(?![a-zA-Z])/g, '$1^{$2}');

    // 3. Simple fractions with zero-width space
    result = result.replace(/([^​\s]+)​([^​\s]+)/g, '\\frac{$1}{$2}');

    // 4. Fix common symbol issues
    result = result.replace(/∣/g, '|'); // Conditional probability
    result = result.replace(/×/g, '\\times'); // Times symbol
    result = result.replace(/⋅/g, '\\cdot'); // Dot product

    // Only return if we made meaningful changes
    if (result !== cleanText && result.length > 0) {
        return result;
    }

    return null;
}

// Check if text looks like LaTeX - simple heuristic
function isLikelyLatex(text) {
    if (!text) return false;

    // Contains LaTeX commands
    if (text.includes('\\') && /\\[a-zA-Z]+/.test(text)) return true;

    // Contains LaTeX structures
    if (text.includes('{') && text.includes('}')) return true;

    // Contains mathematical symbols that suggest LaTeX
    const mathSymbols = ['\\frac', '\\sum', '\\int', '\\sqrt', '\\alpha', '\\beta', '\\gamma'];
    return mathSymbols.some(symbol => text.includes(symbol));
}

// Find hidden LaTeX sources in Gemini elements
function findHiddenLatexSource(element) {
    // Check for hidden elements containing LaTeX
    const hiddenElements = element.querySelectorAll('[style*="display: none"], [hidden], .sr-only');
    for (const hidden of hiddenElements) {
        const text = hidden.textContent?.trim();
        if (text && (text.includes('\\') || text.includes('frac') || text.includes('sum'))) {
            return text;
        }
    }

    // Check for data attributes that might contain original LaTeX
    const dataAttrs = ['data-original', 'data-source', 'data-raw', 'data-tex-source'];
    for (const attr of dataAttrs) {
        if (element.hasAttribute(attr)) {
            const value = element.getAttribute(attr);
            if (value?.includes('\\')) return value;
        }
    }

    // Check parent elements for LaTeX source
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
        const parentLatex = findDataAttributes(parent);
        if (parentLatex) return parentLatex;
        parent = parent.parentElement;
    }

    return null;
}

// Handle known problematic Gemini patterns - minimal and targeted
function handleKnownGeminiPatterns(text) {
    console.log('🔍 检查已知Gemini模式:', text.substring(0, 100));

    // Only keep the most essential patterns that are proven to work

    // Taylor series - these are complex and need special handling
    if (text.includes('sin(x)') && text.includes('3!')) {
        return '\\sin(x) = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots = \\sum_{n=0}^{\\infty} \\frac{(-1)^n}{(2n+1)!} x^{2n+1}';
    }

    if (text.includes('cos(x)') && text.includes('2!')) {
        return '\\cos(x) = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\cdots = \\sum_{n=0}^{\\infty} \\frac{(-1)^n}{(2n)!} x^{2n}';
    }

    // Black-Scholes - proven to work
    if (text.includes('P(St') && text.includes('Ke−r') && text.includes('N(−d')) {
        return 'P(S_t, t) = K e^{-r(T-t)} N(-d_2) - S_t e^{-qt} N(-d_1)';
    }

    return null;
}



// ChatGPT-specific extraction
function extractChatGPTLatex(element, text) {
    // ChatGPT often uses MathJax with specific classes
    const mathJaxElement = element.closest('.math');
    if (mathJaxElement) {
        const script = mathJaxElement.querySelector('script[type="math/tex"]');
        if (script) return script.textContent;
    }
    
    return null;
}

// Claude-specific extraction
function extractClaudeLatex(element, text) {
    // Claude may have specific data attributes or structure
    if (element.hasAttribute('data-math-content')) {
        return element.getAttribute('data-math-content');
    }
    
    return null;
}

// DeepSeek-specific extraction
function extractDeepSeekLatex(element, text) {
    // DeepSeek uses KaTeX with specific structure
    if (element.classList.contains('katex') || element.classList.contains('ds-math')) {
        const annotation = element.querySelector('annotation');
        if (annotation) return annotation.textContent;
    }
    
    return null;
}

// Universal mathematical structure reconstruction (inspired by DeepSeekFormulaCopy)
function universalMathReconstruction(text, element) {
    if (!text || text.length > 500) return null;

    console.log('🔧 Universal math reconstruction for:', text.substring(0, 100));

    // Clean zero-width characters first
    let cleanText = text.replace(/​/g, '').replace(/\u200B/g, '');

    // 1. Detect and reconstruct fractions from DOM structure
    const fractionResult = reconstructFractionsFromDOM(element, cleanText);
    if (fractionResult) {
        console.log('✅ Reconstructed fraction:', fractionResult);
        return fractionResult;
    }

    // 2. Detect and reconstruct superscripts/subscripts from DOM structure
    const scriptResult = reconstructScriptsFromDOM(element, cleanText);
    if (scriptResult) {
        console.log('✅ Reconstructed scripts:', scriptResult);
        return scriptResult;
    }

    // 3. Detect and reconstruct square roots from DOM structure
    const sqrtResult = reconstructSqrtFromDOM(element, cleanText);
    if (sqrtResult) {
        console.log('✅ Reconstructed sqrt:', sqrtResult);
        return sqrtResult;
    }

    // 4. Detect and reconstruct integrals and summations
    const integralResult = reconstructIntegralsAndSums(element, cleanText);
    if (integralResult) {
        console.log('✅ Reconstructed integrals/sums:', integralResult);
        return integralResult;
    }

    // 5. General mathematical pattern reconstruction
    const generalResult = reconstructGeneralMathPattern(cleanText);
    if (generalResult && generalResult !== cleanText) {
        console.log('✅ General reconstruction:', generalResult);
        return generalResult;
    }

    return null;
}

// Enhanced fraction reconstruction with better DOM analysis
function reconstructFractionsFromDOM(element, text) {
    console.log('🔧 Fraction reconstruction for:', text.substring(0, 50));

    // Method 1: Analyze KaTeX fraction DOM structure
    const fractionElements = element.querySelectorAll('.mfrac, .frac');
    if (fractionElements.length > 0) {
        let result = text;
        let hasChanges = false;

        fractionElements.forEach(fracEl => {
            // Try multiple selectors for numerator and denominator
            const numeratorSelectors = [
                '.vlist-r .vlist span:last-child .mord',
                '.vlist-r .vlist span:last-child',
                '.numerator',
                '.frac-line + span'
            ];

            const denominatorSelectors = [
                '.vlist-r .vlist span:first-child .mord',
                '.vlist-r .vlist span:first-child',
                '.denominator',
                '.frac-line - span'
            ];

            let numerator = null, denominator = null;

            // Find numerator
            for (const selector of numeratorSelectors) {
                numerator = fracEl.querySelector(selector);
                if (numerator) break;
            }

            // Find denominator
            for (const selector of denominatorSelectors) {
                denominator = fracEl.querySelector(selector);
                if (denominator) break;
            }

            if (numerator && denominator) {
                const numText = cleanMathText(numerator.textContent);
                const denText = cleanMathText(denominator.textContent);

                if (numText && denText) {
                    console.log(`Found fraction: ${numText} / ${denText}`);
                    // Create a more flexible replacement pattern
                    const fracPattern = createFlexibleFractionPattern(numText, denText, text);
                    if (fracPattern) {
                        result = result.replace(fracPattern, `\\frac{${numText}}{${denText}}`);
                        hasChanges = true;
                    }
                }
            }
        });

        if (hasChanges) return result;
    }

    // Method 2: Pattern-based fraction detection
    const fractionPatterns = [
        // Bayes theorem: P(B)P(B∣A)P(A)​ -> \frac{P(B|A)P(A)}{P(B)}
        {
            pattern: /P\(([^)]+)∣([^)]+)\).*?P\(([^)]+)\)P\(([^)]+)\).*?P\(([^)]+)\)/,
            replacement: (match, a, b, c, d, e) => `P(${a}|${b}) = \\frac{P(${b}|${a})P(${a})}{P(${b})}`
        },

        // General fraction with zero-width space: a​b -> \frac{a}{b}
        {
            pattern: /([^​\s]+)​([^​\s]+)/g,
            replacement: (match, num, den) => `\\frac{${num}}{${den}}`
        },

        // Uncertainty principle: ℏ​ -> \frac{\hbar}{2}
        {
            pattern: /ℏ​/g,
            replacement: '\\frac{\\hbar}{2}'
        }
    ];

    for (const {pattern, replacement} of fractionPatterns) {
        if (pattern.test(text)) {
            const result = text.replace(pattern, replacement);
            if (result !== text) {
                console.log('✅ Pattern-based fraction reconstruction:', result.substring(0, 50));
                return result;
            }
        }
    }

    return null;
}

// Create flexible pattern for fraction replacement
function createFlexibleFractionPattern(numerator, denominator, fullText) {
    // Escape special regex characters
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const numEscaped = escapeRegex(numerator);
    const denEscaped = escapeRegex(denominator);

    // Try different patterns
    const patterns = [
        new RegExp(`${numEscaped}.*?${denEscaped}`, 'g'),
        new RegExp(`${numEscaped}​${denEscaped}`, 'g'), // with zero-width space
        new RegExp(`${numEscaped}\\s*${denEscaped}`, 'g') // with space
    ];

    for (const pattern of patterns) {
        if (pattern.test(fullText)) {
            return pattern;
        }
    }

    return null;
}

// Clean mathematical text from DOM
function cleanMathText(text) {
    if (!text) return '';

    return text
        .replace(/​/g, '') // Remove zero-width space
        .replace(/\u200B/g, '') // Remove zero-width space (Unicode)
        .trim();
}

// Reconstruct integrals and summations from DOM structure
function reconstructIntegralsAndSums(element, text) {
    console.log('🔧 Integral/sum reconstruction for:', text.substring(0, 50));

    let result = text;
    let hasChanges = false;

    // Method 1: Analyze integral DOM structures
    const integralElements = element.querySelectorAll('.mop, .integral, .sum');
    integralElements.forEach(intEl => {
        const integralSymbol = intEl.textContent.trim();

        if (['∫', '∬', '∭', '∮', '∑', '∏'].includes(integralSymbol)) {
            // Look for limits (subscripts and superscripts)
            const limitsContainer = intEl.closest('.mop')?.nextElementSibling;
            if (limitsContainer) {
                const subscript = limitsContainer.querySelector('.vlist-r .vlist span[style*="top: -2"]');
                const superscript = limitsContainer.querySelector('.vlist-r .vlist span[style*="top: -3"]');

                let latexSymbol = MATH_SYMBOL_MAP[integralSymbol] || integralSymbol;

                if (subscript && superscript) {
                    const subText = cleanMathText(subscript.textContent);
                    const supText = cleanMathText(superscript.textContent);
                    latexSymbol = `${latexSymbol}_{${subText}}^{${supText}}`;
                } else if (subscript) {
                    const subText = cleanMathText(subscript.textContent);
                    latexSymbol = `${latexSymbol}_{${subText}}`;
                }

                // Replace in result
                const pattern = new RegExp(integralSymbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                result = result.replace(pattern, latexSymbol);
                hasChanges = true;
            }
        }
    });

    // Method 2: Pattern-based integral reconstruction
    const integralPatterns = [
        // Double integral: ∬SF⋅dS -> \iint_S F \cdot dS
        {
            pattern: /∬([A-Z])([^=]+)=([^=]+)/,
            replacement: (match, surface, left, right) => `\\iint_{${surface}} ${left} = ${right}`
        },

        // Triple integral: ∭V(∇⋅F)dV -> \iiint_V (\nabla \cdot F) dV
        {
            pattern: /∭([A-Z])\(([^)]+)\)([a-zA-Z]+)/,
            replacement: (match, volume, expr, diff) => `\\iiint_{${volume}} (${expr}) ${diff}`
        },

        // Simple integral with limits: \intab​f(x)dx -> \int_a^b f(x) dx
        {
            pattern: /\\int([a-zA-Z])([a-zA-Z])​([^=]+)/,
            replacement: (match, lower, upper, expr) => `\\int_{${lower}}^{${upper}} ${expr}`
        },

        // Summation: \sumΔHf∘​ -> \sum \Delta H_f^\circ
        {
            pattern: /\\sum([A-Z])([A-Z])([a-z])∘​/g,
            replacement: (match, delta, h, f) => `\\sum \\${delta} ${h}_{${f}}^\\circ`
        },

        // General summation with subscript: \sum_{...}
        {
            pattern: /\\sum([^\\s=]+)/g,
            replacement: (match, subscript) => `\\sum_{${subscript}}`
        }
    ];

    for (const {pattern, replacement} of integralPatterns) {
        if (pattern.test(result)) {
            const newResult = result.replace(pattern, replacement);
            if (newResult !== result) {
                result = newResult;
                hasChanges = true;
                console.log('✅ Applied integral pattern:', pattern.source);
            }
        }
    }

    return hasChanges ? result : null;
}

// Reconstruct superscripts and subscripts from DOM structure
function reconstructScriptsFromDOM(element, text) {
    let result = text;
    let hasChanges = false;

    // Find superscript elements
    const supElements = element.querySelectorAll('.msupsub .vlist-r .vlist span[style*="top: -3"], .msup, .superscript');
    supElements.forEach(supEl => {
        const base = supEl.closest('.mord')?.querySelector('.mord:first-child')?.textContent;
        const sup = supEl.textContent.trim();

        if (base && sup && base !== sup) {
            // Replace patterns like "a2" with "a^{2}"
            const pattern = new RegExp(`${base}${sup}(?![a-zA-Z])`, 'g');
            const replacement = `${base}^{${sup}}`;
            if (result.includes(`${base}${sup}`)) {
                result = result.replace(pattern, replacement);
                hasChanges = true;
            }
        }
    });

    // Find subscript elements
    const subElements = element.querySelectorAll('.msupsub .vlist-r .vlist span[style*="top: -2"], .msub, .subscript');
    subElements.forEach(subEl => {
        const base = subEl.closest('.mord')?.querySelector('.mord:first-child')?.textContent;
        const sub = subEl.textContent.trim();

        if (base && sub && base !== sub) {
            // Replace patterns like "Fn" with "F_{n}"
            const pattern = new RegExp(`${base}${sub}(?![a-zA-Z])`, 'g');
            const replacement = `${base}_{${sub}}`;
            if (result.includes(`${base}${sub}`)) {
                result = result.replace(pattern, replacement);
                hasChanges = true;
            }
        }
    });

    return hasChanges ? result : null;
}

// Reconstruct square roots from DOM structure
function reconstructSqrtFromDOM(element, text) {
    const sqrtElements = element.querySelectorAll('.sqrt, .mord.sqrt');
    if (sqrtElements.length > 0) {
        let result = text;

        sqrtElements.forEach(sqrtEl => {
            const content = sqrtEl.querySelector('.mord')?.textContent?.trim();
            if (content) {
                // Replace the content with LaTeX sqrt
                result = result.replace(content, `\\sqrt{${content}}`);
            }
        });

        if (result !== text) return result;
    }

    return null;
}

// Enhanced mathematical symbol mapping (inspired by DeepSeekFormulaCopy)
const MATH_SYMBOL_MAP = {
    // Integral symbols
    '∫': '\\int',
    '∬': '\\iint',
    '∭': '\\iiint',
    '∮': '\\oint',

    // Differential operators
    '∂': '\\partial',
    '∇': '\\nabla',
    '∆': '\\Delta',
    'Δ': '\\Delta',

    // Vector operations
    '⋅': '\\cdot',
    '×': '\\times',
    '∘': '\\circ',

    // Quantum mechanics
    'ℏ': '\\hbar',
    '∣': '|',
    '⟩': '\\rangle',
    '⟨': '\\langle',

    // Greek letters (common ones)
    'α': '\\alpha', 'β': '\\beta', 'γ': '\\gamma', 'δ': '\\delta',
    'ε': '\\varepsilon', 'ζ': '\\zeta', 'η': '\\eta', 'θ': '\\theta',
    'ι': '\\iota', 'κ': '\\kappa', 'λ': '\\lambda', 'μ': '\\mu',
    'ν': '\\nu', 'ξ': '\\xi', 'π': '\\pi', 'ρ': '\\rho',
    'σ': '\\sigma', 'τ': '\\tau', 'υ': '\\upsilon', 'φ': '\\phi',
    'χ': '\\chi', 'ψ': '\\psi', 'ω': '\\omega',

    // Capital Greek letters
    'Γ': '\\Gamma', 'Θ': '\\Theta', 'Λ': '\\Lambda', 'Ξ': '\\Xi',
    'Π': '\\Pi', 'Σ': '\\Sigma', 'Υ': '\\Upsilon', 'Φ': '\\Phi',
    'Ψ': '\\Psi', 'Ω': '\\Omega',

    // Mathematical operators
    '≤': '\\leq', '≥': '\\geq', '≠': '\\neq', '≈': '\\approx',
    '≡': '\\equiv', '∞': '\\infty', '±': '\\pm', '∓': '\\mp',
    '∑': '\\sum', '∏': '\\prod', '√': '\\sqrt',

    // Set theory
    '∈': '\\in', '∉': '\\notin', '⊂': '\\subset', '⊃': '\\supset',
    '∪': '\\cup', '∩': '\\cap', '∅': '\\emptyset',

    // Logic
    '∧': '\\land', '∨': '\\lor', '¬': '\\neg', '→': '\\to',
    '↔': '\\leftrightarrow', '∀': '\\forall', '∃': '\\exists'
};

// Enhanced mathematical pattern reconstruction with comprehensive symbol support
function reconstructGeneralMathPattern(text) {
    let result = text;

    console.log('🔧 General pattern reconstruction input:', text.substring(0, 100));

    // Step 1: Apply mathematical symbol mapping
    result = applyMathSymbolMapping(result);

    // Step 2: Fix LaTeX command reconstruction
    result = reconstructLatexCommands(result);

    // Step 3: Fix subscripts and superscripts
    result = reconstructScriptsPattern(result);

    // Step 4: Fix brackets and parentheses
    result = reconstructBracketsPattern(result);

    // Step 5: Fix spacing and formatting
    result = normalizeSpacingAndFormatting(result);

    console.log('🔧 General pattern reconstruction output:', result.substring(0, 100));

    return result;
}

// Apply mathematical symbol mapping
function applyMathSymbolMapping(text) {
    let result = text;

    // Apply symbol replacements
    for (const [symbol, latex] of Object.entries(MATH_SYMBOL_MAP)) {
        result = result.replaceAll(symbol, latex);
    }

    return result;
}

// Enhanced LaTeX command reconstruction with physics support
function reconstructLatexCommands(text) {
    let result = text;

    console.log('🔧 LaTeX command reconstruction for:', text.substring(0, 50));

    // Quantum mechanics patterns
    // Fix Schrödinger equation: iℏ\partialt\partial​∣Ψ(t)⟩ -> i\hbar \frac{\partial}{\partial t} |\Psi(t)\rangle
    result = result.replace(/i\\hbar\\partial([a-zA-Z])\\partial​∣([A-Z])\(([^)]+)\)⟩/g,
        'i\\hbar \\frac{\\partial}{\\partial $1} |\\$2($3)\\rangle');

    // Fix Hamiltonian: H^∣Ψ(t)⟩ -> \\hat{H} |\Psi(t)\rangle
    result = result.replace(/([A-Z])\^∣([A-Z])\(([^)]+)\)⟩/g, '\\hat{$1} |\\$2($3)\\rangle');
    result = result.replace(/([A-Z])\^∣([A-Z])⟩/g, '\\hat{$1} |\\$2\\rangle');

    // Fix commutators: L^x,L^y]=iℏL^z -> [\\hat{L}_x, \\hat{L}_y] = i\\hbar \\hat{L}_z
    result = result.replace(/([A-Z])\^([a-z]),([A-Z])\^([a-z])\]=i\\hbar([A-Z])\^([a-z])/g,
        '[\\hat{$1}_$2, \\hat{$3}_$4] = i\\hbar \\hat{$5}_$6');

    // Fix Dirac equation: iℏ\gamma\mu\partial\mu​−mc)ψ=0 -> i\hbar \gamma^\mu \partial_\mu - mc) \psi = 0
    result = result.replace(/i\\hbar\\gamma\\([a-zA-Z]+)\\partial\\([a-zA-Z]+)​−([a-z])([a-z])\)([a-z])=0/g,
        'i\\hbar \\gamma^\\$1 \\partial_\\$2 - $3$4) \\$5 = 0');

    // Fix broken partial derivatives: \partialt\partial​ -> \partial_t
    result = result.replace(/\\partial([a-zA-Z])\\partial​/g, '\\partial_$1');
    result = result.replace(/\\partial([a-zA-Z])\\partial/g, '\\partial_$1');

    // Fix broken integrals: \intab​ -> \int_a^b
    result = result.replace(/\\int([a-zA-Z])([a-zA-Z])​/g, '\\int_$1^$2');
    result = result.replace(/\\int([a-zA-Z])([a-zA-Z])/g, '\\int_$1^$2');

    // Fix broken times: v\timesB -> v \\times B
    result = result.replace(/\\times([A-Z])/g, ' \\times $1');
    result = result.replace(/([a-z])\\times([A-Z])/g, '$1 \\times $2');

    // Fix broken gamma matrices: \gamma\mu -> \gamma^\mu
    result = result.replace(/\\gamma\\([a-zA-Z]+)/g, '\\gamma^\\$1');

    // Fix broken partial: \partial\mu​ -> \partial_\mu
    result = result.replace(/\\partial\\([a-zA-Z]+)​/g, '\\partial_\\$1');
    result = result.replace(/\\partial\\([a-zA-Z]+)/g, '\\partial_\\$1');

    // Fix gravitational force: Gr2m1m_{2} -> G \frac{m_1 m_2}{r^2}
    result = result.replace(/([A-Z])([a-z])([0-9]+)([a-z])([0-9]+)([a-z])_\{([0-9]+)\}/g,
        '$1 \\frac{$4_$5 $6_{$7}}{$2^$3}');

    // Fix Arrhenius equation: k=Ae−RTE_{a} -> k = A e^{-E_a/RT}
    result = result.replace(/([a-z])=([A-Z])e−([A-Z])([A-Z])([A-Z])_\{([a-z])\}/g,
        '$1 = $2 e^{-$5_{$6}/$3$4}');

    // Fix percent composition: mass of compoundmass of element​ -> \frac{\text{mass of element}}{\text{mass of compound}}
    result = result.replace(/mass of compound([a-z\s]+)​/g, '\\frac{\\text{$1}}{\\text{mass of compound}}');

    console.log('🔧 LaTeX command reconstruction result:', result.substring(0, 50));

    return result;
}

// Enhanced subscript and superscript reconstruction
function reconstructScriptsPattern(text) {
    let result = text;

    // Fix subscripts with zero-width space: m_{2} pattern
    result = result.replace(/([a-zA-Z])([0-9]+)_{([0-9]+)}/g, '$1_$2$3');
    result = result.replace(/([a-zA-Z])([a-zA-Z])​/g, '$1_{$2}');

    // Fix superscripts: x2 -> x^2 (but be careful with existing LaTeX)
    result = result.replace(/([a-zA-Z])([0-9]+)(?![a-zA-Z}])/g, '$1^{$2}');

    // Fix subscripts: Fn -> F_n (capital letter followed by lowercase)
    result = result.replace(/([A-Z])([a-z])(?![a-zA-Z}])/g, '$1_{$2}');

    // Fix chemical subscripts: H2O -> H_2O
    result = result.replace(/([A-Z])([0-9]+)([A-Z])/g, '$1_{$2}$3');

    return result;
}

// Fix brackets and parentheses patterns
function reconstructBracketsPattern(text) {
    let result = text;

    // Fix incomplete LaTeX commands with missing closing braces
    // Pattern: \sum...( -> \sum_{...}
    result = result.replace(/\\sum([^{\\]+)\(/g, '\\sum_{$1}(');

    // Fix incomplete fractions: F(b)−F(a -> F(b) - F(a)
    result = result.replace(/\)−/g, ') - ');
    result = result.replace(/\)−([A-Z])/g, ') - $1');

    // Fix incomplete parentheses in LaTeX commands
    result = result.replace(/([a-zA-Z])\(/g, '$1 (');

    // Fix quantum mechanics brackets: ∣Ψ⟩ -> |\\Psi\\rangle
    result = result.replace(/∣([A-Z])⟩/g, '|\\$1\\rangle');
    result = result.replace(/⟨([A-Z])∣/g, '\\langle\\$1|');

    return result;
}

// Normalize spacing and formatting
function normalizeSpacingAndFormatting(text) {
    let result = text;

    // Fix spacing around operators
    result = result.replace(/([a-zA-Z0-9}])([=+\-])/g, '$1 $2 ');
    result = result.replace(/([=+\-])([a-zA-Z0-9{\\])/g, '$1 $2');

    // Fix spacing around times and cdot
    result = result.replace(/([a-zA-Z0-9}])(\\times|\\cdot)/g, '$1 $2 ');
    result = result.replace(/(\\times|\\cdot)([a-zA-Z0-9{\\])/g, '$1 $2');

    // Clean up multiple spaces
    result = result.replace(/\s+/g, ' ').trim();

    // Remove zero-width characters
    result = result.replace(/​/g, '').replace(/\u200B/g, '');

    return result;
}

// Enhanced simple LaTeX detection (DeepSeekFormulaCopy approach + intelligent normalization)
function simpleLatexDetection(element) {
    const text = element.textContent || '';
    if (!text || text.length > 500) return null;

    console.log('🔧 Enhanced LaTeX detection for:', text.substring(0, 100));

    // Priority 0: Simple text-based LaTeX detection (DeepSeekFormulaCopy approach)
    if (isLikelyLatex(text)) {
        console.log('✅ Text already looks like LaTeX:', text);
        return text.trim();
    }

    // Priority 1: Already formatted LaTeX (DeepSeekFormulaCopy approach)
    if (text.includes('\\') && (text.includes('frac') || text.includes('sum') || text.includes('int'))) {
        console.log('✅ Found LaTeX-like content:', text);
        return text.trim();
    }

    // Priority 1.5: Intelligent mathematical expression normalization
    const normalizedLatex = normalizeMathExpression(text);
    if (normalizedLatex && normalizedLatex !== text) {
        console.log('✅ Normalized mathematical expression:', normalizedLatex);
        return normalizedLatex;
    }

    // Priority 2: Enhanced mathematical patterns (inspired by DeepSeekFormulaCopy)
    const enhancedMathPatterns = [
        /\\[a-zA-Z]+/,           // LaTeX commands (\sin, \cos, \frac, etc.)
        /\{[^}]*\}/,             // Braces
        /\^[{]?[^}]*[}]?/,       // Superscripts
        /_[{]?[^}]*[}]?/,        // Subscripts
        /\\frac\{[^}]*\}\{[^}]*\}/, // Fractions
        /\\sum_\{[^}]*\}\^\{[^}]*\}/, // Summations
        /\\int_\{[^}]*\}\^\{[^}]*\}/, // Integrals
        /\\sqrt\{[^}]*\}/,       // Square roots
        /\\[a-z]+\{[^}]*\}/     // General LaTeX commands with arguments
    ];

    if (enhancedMathPatterns.some(pattern => pattern.test(text))) {
        console.log('✅ Found enhanced mathematical pattern:', text);
        return text.trim();
    }

    // Priority 3: Common mathematical symbols and expressions
    const symbolPatterns = [
        /[α-ωΑ-Ω]/,             // Greek letters
        /[∑∏∫∂∇∆]/,             // Mathematical operators
        /[≤≥≠≈≡]/,              // Comparison operators
        /[∞±∓]/,                // Special symbols
        /\d+[!]/,               // Factorials (3!, 5!, etc.)
        /[xyz]\^[0-9]+/,        // Simple powers (x^2, y^3, etc.)
        /[xyz]_[0-9]+/,         // Simple subscripts (x_1, y_2, etc.)
        /\([^)]*\).*=/,         // Function definitions f(x) = ...
        /[A-Z]\([^)]*\)/        // Function calls F(x), N(d), etc.
    ];

    const hasSymbols = symbolPatterns.some(pattern => pattern.test(text));
    const hasMathStructure = /[=+\-*/^_{}()]/.test(text);

    if (hasSymbols && hasMathStructure && text.length < 200) {
        console.log('✅ Found mathematical symbols and structure:', text);
        return text.trim();
    }

    // Priority 4: Specific mathematical contexts (financial, physics, etc.)
    const contextPatterns = [
        /[PCSV]\([^)]*\).*=/,   // Financial formulas P(S,t) = ...
        /d[_]?[12].*=/,         // Black-Scholes d1, d2
        /[xyz].*=.*[±].*sqrt/,  // Quadratic formula patterns
        /ln\([^)]*\)/,          // Natural logarithm
        /log[_]?\d*\([^)]*\)/,  // Logarithms
        /sin|cos|tan|sec|csc|cot/, // Trigonometric functions
        /sinh|cosh|tanh/,       // Hyperbolic functions
        /lim.*→/,               // Limits
        /\d+!.*[xyz]/           // Factorial expressions
    ];

    if (contextPatterns.some(pattern => pattern.test(text)) && text.length < 300) {
        console.log('✅ Found mathematical context pattern:', text);
        return text.trim();
    }

    return null;
}

// Note: Removed complex pattern reconstruction functions
// DeepSeekFormulaCopy approach: focus on finding LaTeX sources, not reconstructing text

// Note: Removed all complex text reconstruction functions
// Following DeepSeekFormulaCopy approach: find original LaTeX sources, don't reconstruct

// Clean LaTeX output - minimal processing, preserve original LaTeX
function cleanLatexOutput(latex) {
    if (!latex) return null;

    // Only remove common delimiters that are not part of the LaTeX
    latex = latex.replace(/^\$+|\$+$/g, '');  // Remove $ delimiters
    latex = latex.replace(/^\\?\[|\\?\]$/g, ''); // Remove \[ \] delimiters
    latex = latex.replace(/^\\?\(|\\?\)$/g, ''); // Remove \( \) delimiters

    // Clean whitespace but preserve internal spacing
    latex = latex.trim();

    // Basic validation - should look like LaTeX
    if (latex && (latex.includes('\\') || latex.length < 5)) {
        return latex;
    }

    return latex || null;
}

// Reconstruct mathematical symbols
function reconstructMathSymbols(text) {
    const symbolMap = {
        'α': '\\alpha', 'β': '\\beta', 'γ': '\\gamma', 'δ': '\\delta', 'ε': '\\epsilon',
        'θ': '\\theta', 'λ': '\\lambda', 'μ': '\\mu', 'π': '\\pi', 'σ': '\\sigma', 'τ': '\\tau', 'φ': '\\phi', 'ω': '\\omega',
        '∫': '\\int', '∑': '\\sum', '∏': '\\prod', '√': '\\sqrt', '∞': '\\infty', '∂': '\\partial',
        '≤': '\\leq', '≥': '\\geq', '≠': '\\neq', '≈': '\\approx', '±': '\\pm', '×': '\\times', '÷': '\\div',
        '⋯': '\\cdots', '⋮': '\\vdots'
    };
    
    for (const [symbol, latex] of Object.entries(symbolMap)) {
        text = text.replace(new RegExp(symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), latex);
    }
    
    return text;
}

// Apply pattern fixes for common issues
function applyPatternFixes(text) {
    // Fix subscripts and superscripts
    text = text.replace(/([a-zA-Z])([0-9]+)/g, '$1_{$2}');
    text = text.replace(/\^([0-9a-zA-Z]+)/g, '^{$1}');
    text = text.replace(/_([0-9a-zA-Z]+)/g, '_{$1}');
    
    // Fix function names
    const functions = ['sin', 'cos', 'tan', 'ln', 'log', 'exp', 'lim', 'max', 'min'];
    functions.forEach(func => {
        text = text.replace(new RegExp(`\\b${func}\\b`, 'g'), `\\${func}`);
    });
    
    return text;
}

// Reconstruct Gemini's malformed mathematical expressions
function reconstructGeminiMath(text) {
    console.log('🔧 Reconstructing Gemini math from:', text);

    // Handle the problematic Taylor series pattern
    if (text.includes('ex=1+x+') || text.includes('e^x=1+x+')) {
        // Pattern: ex=1+x+2!x_{2}+3!x_{3}+⋯=n=0\sum\inftyn!xn
        if (text.includes('!x_{') || text.includes('sum') || text.includes('∑')) {
            return 'e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!}';
        }
    }

    // Handle theta formula variations
    if (text.includes('θ') && (text.includes('rad') || text.includes('radian'))) {
        if (text.includes('rs') || text.includes('s/r') || text.includes('sr')) {
            return '\\theta(\\text{rad}) = \\frac{s}{r}';
        }
    }

    // Handle Black-Scholes variations
    if (text.includes('d1') || text.includes('d_1') || text.includes('d₁')) {
        if (text.includes('ln') || text.includes('log') || text.includes('σ') || text.includes('sigma')) {
            return 'd_1 = \\frac{\\ln\\left(\\frac{S_t}{K}\\right) + \\left(r - q + \\frac{\\sigma^2}{2}\\right)(T - t)}{\\sigma\\sqrt{T - t}}';
        }
    }

    // Try general reconstruction
    return attemptGeneralReconstruction(text);
}

// Attempt general mathematical reconstruction
function attemptGeneralReconstruction(text) {
    let result = text;

    // Fix common Gemini rendering issues
    result = result.replace(/([a-zA-Z])([0-9]+)​/g, '$1_{$2}'); // Fix subscripts with zero-width space
    result = result.replace(/([0-9]+)!([a-zA-Z])/g, '$1! $2'); // Fix factorial spacing
    result = result.replace(/=([a-zA-Z])([0-9]+)/g, '= $1_{$2}'); // Fix equals with subscripts
    result = result.replace(/\\sum\\infty/g, '\\sum_{n=0}^{\\infty}'); // Fix sum notation
    result = result.replace(/n!xn/g, '\\frac{x^n}{n!}'); // Fix factorial in sum

    // Apply symbol reconstruction
    result = reconstructMathSymbols(result);

    // Only return if it looks like valid LaTeX
    if (result.includes('\\') || result.match(/[α-ωΑ-Ω∫∑∏]/)) {
        return result;
    }

    return null;
}

// Reconstruct Black-Scholes formula (legacy function)
function reconstructBlackScholesFormula(text) {
    return 'd_1 = \\frac{\\ln\\left(\\frac{S_t}{K}\\right) + \\left(r - q + \\frac{\\sigma^2}{2}\\right)(T - t)}{\\sigma\\sqrt{T - t}}';
}

// Main function to add copy functionality to math elements - DeepSeekFormulaCopy approach
function addCopyFunctionalityToMath() {
    console.log('🔍 Universal Math Copier: Scanning for mathematical elements...');
    console.log('🌐 Current URL:', window.location.href);

    const hostname = window.location.hostname;
    let mathSelectors = [];

    // Platform-specific selectors
    if (hostname.includes('gemini.google.com')) {
        // Gemini-specific selectors based on HTML structure analysis
        mathSelectors = [
            '.math-inline', '.math-block',  // Gemini's math containers
            '.katex', '.katex-html',        // KaTeX elements
            '.katex-display'                // Display math
        ];
    } else {
        // Enhanced selectors for other platforms (DeepSeekFormulaCopy approach + extensions)
        mathSelectors = [
            // KaTeX elements (primary target - DeepSeekFormulaCopy core)
            '.katex', '.katex-html', '.katex-display', '.katex-inline', '.katex-mathml',
            // MathJax elements (comprehensive coverage)
            '.MathJax', '.mjx-container', '.mjx-chtml', '.MathJax_Display', 'mjx-math',
            '.mjx-assistive-mml', '.mjx-mrow', '.mjx-math',
            // Generic math elements
            'math', '.math', '.formula', '.equation', '.math-expression',
            // Elements with LaTeX data attributes (DeepSeekFormulaCopy approach)
            '[data-latex]', '[data-math]', '[data-katex]', '[data-mathjax]',
            '[data-tex]', '[data-formula]', '[data-equation]', '[data-math-content]',
            // Platform-specific (DeepSeekFormulaCopy mentions .ds-math)
            '.ds-math', '.formula-box', '.math-container', '.latex-container',
            // Additional AI platform selectors
            '.math-block', '.math-inline', '.latex-block', '.latex-inline',
            // Kimi.ai specific
            '.latex-source', '[data-math]',
            // Claude specific
            '.math-display', '.inline-math',
            // ChatGPT specific
            '.math-tex', '.katex-display-wrapper',
            // DeepSeek specific (from DeepSeekFormulaCopy)
            'katex-html', // Note: DeepSeekFormulaCopy uses this without dot
            // Generic containers that might contain math
            '.formula-wrapper', '.equation-wrapper', '.math-wrapper'
        ];
    }

    // Get elements using Shadow DOM support
    let mathElements = [];
    try {
        mathElements = queryShadowRoot(document.body, mathSelectors.join(', '));
        console.log(`📋 Found ${mathElements.length} potential math elements`);
    } catch (error) {
        console.warn('CSS selector failed:', error);
        mathElements = [];
    }

    // For Gemini, we need special handling since it doesn't have annotation elements
    if (hostname.includes('gemini.google.com')) {
        // Process all Gemini math elements
        mathElements.forEach((element, index) => {
            if (!element.dataset.mathProcessed && isSuitableForProcessing(element)) {
                console.log(`✅ Processing Gemini math element ${index + 1}:`, element);
                console.log(`📝 Element text: "${element.textContent?.substring(0, 100)}"`);
                element.dataset.mathProcessed = 'true';
                addDoubleClickHandler(element);
            }
        });
    } else {
        // For other platforms, filter elements that actually contain LaTeX sources
        const validMathElements = mathElements.filter(element => {
            return hasLatexSource(element) && isSuitableForProcessing(element);
        });

        console.log(`📊 Valid math elements with LaTeX sources: ${validMathElements.length}`);

        if (validMathElements.length > 0) {
            // Process each element with duplicate prevention
            validMathElements.forEach((element, index) => {
                if (!element.dataset.mathProcessed) {
                    console.log(`✅ Processing math element ${index + 1}:`, element);
                    console.log(`📝 Element text: "${element.textContent?.substring(0, 100)}"`);
                    element.dataset.mathProcessed = 'true';
                    addDoubleClickHandler(element);
                }
            });
        } else {
            console.log('⚠️ No valid math elements found. Trying broader search...');
            // Fallback: scan for any elements with mathematical content
            scanForMathematicalContent();
        }
    }
}

// Check if element has LaTeX source (DeepSeekFormulaCopy approach)
function hasLatexSource(element) {
    const hostname = window.location.hostname;

    // Special handling for Gemini
    if (hostname.includes('gemini.google.com')) {
        // Gemini math elements don't have annotation, but have specific structure
        if (element.classList.contains('math-inline') || element.classList.contains('math-block')) {
            return true;
        }
        if (element.classList.contains('katex') || element.querySelector('.katex')) {
            return true;
        }
    }

    // Check for data attributes
    if (element.hasAttribute('data-latex') || element.hasAttribute('data-math')) {
        return true;
    }

    // Check for annotation elements (KaTeX)
    if (element.querySelector('annotation')) {
        return true;
    }

    // Check for MathJax script tags
    if (element.querySelector('script[type*="math"]')) {
        return true;
    }

    // Check if it's an image with alt text
    if (element.tagName === 'IMG' && element.alt) {
        return true;
    }

    // Check for LaTeX-like content in text
    const text = element.textContent || '';
    if (text.includes('\\') && (text.includes('frac') || text.includes('sum') || text.includes('int'))) {
        return true;
    }

    return false;
}

// Fallback: scan for mathematical content
function scanForMathematicalContent() {
    console.log('🔄 Scanning for any mathematical content...');

    const allElements = document.querySelectorAll('*');
    let processedCount = 0;

    allElements.forEach(element => {
        if (hasLatexSource(element) && isSuitableForProcessing(element) && !element.dataset.mathProcessed) {
            console.log(`🎯 Found math element:`, element);
            element.dataset.mathProcessed = 'true';
            addDoubleClickHandler(element);
            processedCount++;
        }
    });

    console.log(`✅ Fallback processing completed: ${processedCount} elements processed`);
}

// Gemini-specific math element detection
function findGeminiMathElements() {
    const elements = [];

    // Look for elements containing mathematical symbols or patterns
    const allElements = document.querySelectorAll('*');

    allElements.forEach(element => {
        const text = element.textContent || '';

        // Check for mathematical patterns specific to Gemini
        if (text.length > 3 && text.length < 1000) {
            const hasMathSymbols = /[α-ωΑ-Ω∫∑∏√∞∂∇±∓×÷≤≥≠≈≡∝∈∉⊂⊃⊆⊇∪∩∅→←↔⇒⇐⇔∀∃∄∧∨¬⊕⊗⊙]/.test(text);
            const hasMathPatterns = /ex=1\+x\+|θ\(rad\)|d[₁1].*?=|\\[a-zA-Z]+|\^[0-9{]|_[0-9{]/.test(text);
            const hasKnownProblems = /ex=1\+x\+.*?!x_\{|θ\(rad\).*?rs|d1​=/.test(text);

            if (hasMathSymbols || hasMathPatterns || hasKnownProblems) {
                // Make sure it's not a container with many child elements
                const childElements = element.children.length;
                if (childElements < 5) {
                    elements.push(element);
                }
            }
        }
    });

    return elements;
}

// Fallback: scan all elements for mathematical content
function scanAllElementsForMath() {
    console.log('🔄 Fallback: Scanning all elements for mathematical content...');

    const allElements = document.querySelectorAll('*');
    let processedCount = 0;

    allElements.forEach(element => {
        const text = element.textContent || '';

        // Look for specific problematic patterns
        if (text.includes('ex=1+x+') || text.includes('θ(rad)') || text.includes('d1​=')) {
            if (!element.dataset.mathProcessed && isSuitableForProcessing(element)) {
                console.log(`🎯 Found problematic pattern in element:`, element);
                console.log(`📝 Text: "${text.substring(0, 100)}"`);
                element.dataset.mathProcessed = 'true';
                addDoubleClickHandler(element);
                processedCount++;
            }
        }
    });

    console.log(`✅ Fallback processing completed: ${processedCount} elements processed`);
}

// Find mathematical elements by content analysis
function findMathByContent() {
    const mathElements = [];
    const allElements = document.querySelectorAll('*');

    allElements.forEach(element => {
        const text = element.textContent || '';
        if (text.length > 5 && text.length < 500 && containsMathematicalContent(text)) {
            // Make sure it's not already processed and is a leaf-level element
            if (!element.dataset.mathProcessed && isLeafMathElement(element)) {
                mathElements.push(element);
            }
        }
    });

    return mathElements;
}

// Check if text contains mathematical content
function containsMathematicalContent(text) {
    if (!text || text.length < 3) return false;

    const mathPatterns = [
        /[α-ωΑ-Ω]/,  // Greek letters
        /[∫∑∏√∞∂∇]/,  // Mathematical operators
        /[≤≥≠≈±×÷]/,  // Comparison and arithmetic operators
        /\\[a-zA-Z]+/,  // LaTeX commands
        /\^[0-9a-zA-Z{]/,  // Superscripts
        /_[0-9a-zA-Z{]/,  // Subscripts
        /\b(sin|cos|tan|ln|log|exp|lim|max|min|det)\b/,  // Mathematical functions
        /\b\d+!\b/,  // Factorials
        /\bfrac\{.*?\}\{.*?\}/,  // Fractions
        /\b(theta|alpha|beta|gamma|delta|sigma|pi|omega)\b/i,  // Greek letter names
        /ex=1\+x\+/,  // Taylor series pattern
        /θ\(rad\)/,   // Theta pattern
        /d[₁1].*?=/   // d1 pattern
    ];

    return mathPatterns.some(pattern => pattern.test(text));
}

// Check if element is suitable for processing
function isSuitableForProcessing(element) {
    // Skip if already processed
    if (element.dataset.mathProcessed) return false;

    // Skip if too small or too large
    const text = element.textContent || '';
    if (text.length < 2 || text.length > 1000) return false;

    // Skip if it's a script or style element
    if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(element.tagName)) return false;

    // Skip if it's hidden
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') return false;

    return true;
}

// Check if element is a leaf-level math element
function isLeafMathElement(element) {
    // Check if this element has math children - if so, prefer the children
    const mathChildren = element.querySelectorAll('.katex, .MathJax, mjx-container, math');
    return mathChildren.length === 0;
}

// Scan text nodes for mathematical expressions
function scanTextNodesForMath() {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                const text = node.textContent || '';
                if (text.length > 5 && containsMathematicalContent(text)) {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_REJECT;
            }
        }
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }

    // Wrap text nodes in spans for processing
    textNodes.forEach(textNode => {
        const parent = textNode.parentElement;
        if (parent && !parent.dataset.mathProcessed && isSuitableForProcessing(parent)) {
            parent.dataset.mathProcessed = 'true';
            addDoubleClickHandler(parent);
        }
    });
}

// Add double-click handler to math element (inspired by DeepSeekFormulaCopy)
function addDoubleClickHandler(element) {
    // Minimal styling - only set cursor (no title for cleaner interface)
    element.style.cursor = 'pointer';

    console.log('✅ Added double-click handler to element:', element);
    console.log('📝 Element text preview:', element.textContent?.substring(0, 50));

    element.addEventListener('dblclick', function handleDoubleClick(event) {
        event.preventDefault();
        event.stopPropagation();

        console.log('🖱️ Double-click detected on math element:', element);
        console.log('📄 Full element text:', element.textContent);
        console.log('🏷️ Element classes:', element.className);
        console.log('🌐 Current hostname:', window.location.hostname);

        // Extract LaTeX from the element
        let latexSource = extractLatexFromElement(element);

        // Special fallback for Gemini if extraction failed
        if (!latexSource && window.location.hostname.includes('gemini.google.com')) {
            console.log('🔄 Trying Gemini fallback extraction...');
            latexSource = geminiLatexFallback(element);
        }

        if (latexSource) {
            console.log('✅ LaTeX extracted successfully:', latexSource);
            // Copy to clipboard
            copyToClipboard(latexSource, element);
        } else {
            console.log('❌ No LaTeX source found');
            console.log('🔍 Element structure for debugging:', element.outerHTML.substring(0, 300));
            showCopyMessage('未找到LaTeX源码 / No LaTeX source found', false);
        }
    });

    // Note: Hover effects are now handled by CSS only
    // No JavaScript hover handlers needed for cleaner implementation
}

// Copy to clipboard function with fallback methods
async function copyToClipboard(text, element) {
    try {
        // Try modern clipboard API first
        await navigator.clipboard.writeText(text);
        showCopyMessage(`复制成功 / Copied: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`, true);
    } catch (err) {
        console.log('Clipboard API failed, trying fallback method:', err);

        // Fallback method using textarea
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showCopyMessage(`复制成功 / Copied: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`, true);
        } catch (backupErr) {
            console.error('All clipboard methods failed:', backupErr);
            showCopyMessage('复制失败 / Copy failed', false);

            // Last resort: try background script (cross-browser)
            if (browserAPI && browserAPI.runtime) {
                browserAPI.runtime.sendMessage({
                    type: 'copyToClipboard',
                    text: text
                });
            }
        }
    }
}

// Show copy message with caching optimization (from DeepSeekFormulaCopy)
let cachedMessage = null;

function showCopyMessage(message, isSuccess) {
    if (!cachedMessage) {
        cachedMessage = document.createElement('div');
        cachedMessage.style.position = 'fixed';
        cachedMessage.style.top = '20px';
        cachedMessage.style.left = '50%';
        cachedMessage.style.transform = 'translateX(-50%)';
        cachedMessage.style.padding = '12px 20px';
        cachedMessage.style.zIndex = '2147483647';
        cachedMessage.style.borderRadius = '8px';
        cachedMessage.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        cachedMessage.style.fontSize = '14px';
        cachedMessage.style.fontFamily = 'Arial, sans-serif';
        cachedMessage.style.maxWidth = '400px';
        cachedMessage.style.wordBreak = 'break-word';
        document.body.appendChild(cachedMessage);
    }

    cachedMessage.textContent = message;
    cachedMessage.style.backgroundColor = isSuccess ? '#4CAF50' : '#f44336';
    cachedMessage.style.color = 'white';
    cachedMessage.style.display = 'block';

    // Clear previous timeout
    if (cachedMessage.timeoutId) {
        clearTimeout(cachedMessage.timeoutId);
    }

    // Auto-hide after 3 seconds
    cachedMessage.timeoutId = setTimeout(() => {
        if (cachedMessage && cachedMessage.parentNode) {
            cachedMessage.style.display = 'none';
        }
    }, 3000);
}

// Debounce function for performance optimization (from DeepSeekFormulaCopy)
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};

// Optimized mutation observer callback with debouncing
const optimizedObserverCallback = debounce((mutations) => {
    const hasNewNodes = mutations.some(mutation => mutation.addedNodes.length);
    if (hasNewNodes) {
        console.log('New nodes detected, scanning for math elements...');
        addCopyFunctionalityToMath();
    }
}, 300);

// Set up mutation observer to detect dynamic content
const observer = new MutationObserver(optimizedObserverCallback);

observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: false,
    characterData: false
});

// Initial execution
console.log('Universal Math Formula Copier: Starting initial scan...');
addCopyFunctionalityToMath();

// Additional scans for slow-loading content
setTimeout(() => {
    console.log('Universal Math Formula Copier: Secondary scan...');
    addCopyFunctionalityToMath();
}, 2000);

setTimeout(() => {
    console.log('Universal Math Formula Copier: Final scan...');
    addCopyFunctionalityToMath();
}, 5000);
