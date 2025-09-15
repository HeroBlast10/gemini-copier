# KaTeX数据属性提取和HTML反向工程实现

## 问题分析

根据你的分析，问题的核心在于：

1. **DeepSeekFormulaCopy成功的原因**：它利用ChatGPT页面中MathML的`<annotation encoding="application/x-tex">…</annotation>`保存的原始LaTeX来实现复制功能
2. **Gemini的问题**：Gemini页面缺少`<annotation>`元素，所以插件无法获取原始LaTeX
3. **解决方案**：需要从KaTeX渲染节点反向提取LaTeX

## 实现的解决方案

### 1. KaTeX数据属性提取 (`extractKatexDataAttributes`)

```javascript
function extractKatexDataAttributes(element) {
    // 定义所有可能的KaTeX数据属性名称
    const katexDataAttrs = [
        'data-latex', 'data-expr', 'data-katex', 'data-original', 
        'data-tex', 'data-formula', 'data-math', 'data-source',
        'data-katex-source', 'data-math-content', 'data-raw'
    ];
    
    // 搜索优先级：
    // 1. 当前元素
    // 2. KaTeX容器 (.katex)
    // 3. 数学容器 (.math-inline, .math-block)
    // 4. 子元素中的KaTeX相关类
    // 5. JavaScript附加数据 (__katex, _katex)
}
```

### 2. KaTeX HTML反向工程 (`reverseEngineerKatexHtml`)

```javascript
function reverseEngineerKatexHtml(element) {
    // 方法1: 从KaTeX HTML结构提取
    const katexHtml = element.querySelector('.katex-html');
    if (katexHtml) {
        const latex = extractLatexFromKatexHtml(katexHtml);
    }
    
    // 方法2: 从MathML提取（如果可用）
    const mathml = element.querySelector('.katex-mathml math');
    if (mathml) {
        const latex = extractLatexFromMathML(mathml);
    }
    
    // 方法3: 基于模式的文本提取
    const text = element.textContent || '';
    if (text) {
        const latex = extractLatexFromRenderedText(text);
    }
}
```

### 3. KaTeX HTML结构分析 (`extractLatexFromKatexHtml`)

识别和转换KaTeX DOM结构：

- **分数**: `.mfrac` → `\frac{numerator}{denominator}`
- **上下标**: `.msupsub` → `base^{superscript}_{subscript}`
- **平方根**: `.sqrt` → `\sqrt{content}`

### 4. MathML转换 (`extractLatexFromMathML`)

处理MathML元素：

- `<mfrac>` → `\frac{}{}`
- `<msup>` → `^{}`
- `<msub>` → `_{}`
- `<msqrt>` → `\sqrt{}`

### 5. 渲染文本模式识别 (`extractLatexFromRenderedText`)

从渲染后的文本中识别数学模式：

```javascript
// 分数模式: "a/b" → "\frac{a}{b}"
cleanText = cleanText.replace(/([^\/\s]+)\/([^\/\s]+)/g, '\\frac{$1}{$2}');

// 上标模式: "x²" → "x^{2}"
cleanText = cleanText.replace(/([a-zA-Z])([²³⁴⁵⁶⁷⁸⁹⁰¹])/g, (match, base, sup) => {
    const supMap = {'²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁰': '0', '¹': '1'};
    return `${base}^{${supMap[sup] || sup}}`;
});

// 数学符号转换
cleanText = cleanText.replace(/≥/g, '\\geq');
cleanText = cleanText.replace(/Δ/g, '\\Delta');
cleanText = cleanText.replace(/ℏ/g, '\\hbar');
// ... 更多符号映射
```

## 优先级系统

实现了多层次的提取策略：

1. **最高优先级**: KaTeX数据属性搜索
2. **高优先级**: HTML结构反向工程
3. **中优先级**: MathML转换
4. **低优先级**: 模式基础文本提取
5. **备用方案**: 现有Gemini逻辑

## 测试用例

### 你提供的例子

**输入HTML**:
```html
<span class="katex" data-katex-processed="true">
  <span class="katex-mathml">
    <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
      <semantics>
        <mrow><mi mathvariant="normal">Δ</mi><mi>x</mi><mi mathvariant="normal">Δ</mi><mi>p</mi><mo>≥</mo><mfrac><mi mathvariant="normal">ℏ</mi><mn>2</mn></mfrac></mrow>
        <annotation encoding="application/x-tex">\Delta x \Delta p \ge \frac{\hbar}{2}</annotation>
      </semantics>
    </math>
  </span>
  <!-- KaTeX HTML 渲染内容 -->
</span>
```

**期望输出**: `\Delta x \Delta p \ge \frac{\hbar}{2}`

### 处理流程

1. **检查annotation元素** (如果存在) → 直接返回LaTeX
2. **搜索KaTeX数据属性** → 查找data-latex等属性
3. **分析KaTeX HTML结构** → 识别.mfrac等元素
4. **转换MathML** → 处理mfrac, msup等元素
5. **文本模式识别** → 符号替换和模式匹配

## 技术特点

### 兼容性
- 保持与现有Gemini特殊逻辑的完全兼容
- 不影响其他平台的功能
- 向后兼容所有现有功能

### 可靠性
- 多层次备用方案
- 错误处理和日志记录
- 渐进式降级策略

### 性能
- 优先级系统避免不必要的计算
- 缓存DOM查询结果
- 早期返回机制

## 实际应用

这个实现解决了你提到的核心问题：

1. **模拟DeepSeekFormulaCopy的成功方法**：优先查找原始LaTeX源码
2. **处理Gemini的特殊情况**：当没有annotation时，通过多种方法反向工程
3. **保持通用性**：不仅针对特定公式，而是通用的结构分析

## 预期效果

对于你提到的问题公式：

- `k=Ae−RTE_{a}` → 通过文本模式识别和符号替换
- `F=Gr2m1m_{2}` → 通过上下标识别和分数结构分析
- `ΔxΔp≥2ℏ​` → 通过符号映射和分数识别

这种方法结合了DeepSeekFormulaCopy的"查找源码"理念和针对Gemini特殊情况的"智能反向工程"，应该能够显著提高LaTeX提取的成功率和准确性。
