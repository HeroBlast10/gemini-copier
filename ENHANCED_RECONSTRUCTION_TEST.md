# Enhanced Mathematical Reconstruction - Test Cases

## 测试用例验证

本文档列出了增强重构系统应该能够处理的复杂数学公式。

### 1. 积分和微分方程

| 输入 | 期望输出 | 类型 |
|------|----------|------|
| `∬SF⋅dS = ∭V(∇⋅F)dV` | `\iint_S F \cdot dS = \iiint_V (\nabla \cdot F) dV` | 散度定理 |
| `\intab​f(x)dx=F(b)−F(a` | `\int_a^b f(x) dx = F(b) - F(a)` | 牛顿-莱布尼茨公式 |

### 2. 物理公式

| 输入 | 期望输出 | 类型 |
|------|----------|------|
| `F=Gr2m1m_{2}` | `F = G \frac{m_1 m_2}{r^2}` | 万有引力定律 |
| `F=q(E+v\timesB` | `F = q(E + v \times B)` | 洛伦兹力 |

### 3. 量子力学

| 输入 | 期望输出 | 类型 |
|------|----------|------|
| `iℏ\partialt\partial​∣Ψ(t)⟩=H^∣Ψ(t)⟩` | `i\hbar \frac{\partial}{\partial t} \|\Psi(t)\rangle = \hat{H} \|\Psi(t)\rangle` | 薛定谔方程 |
| `ΔxΔp\geq2ℏ​` | `\Delta x \Delta p \geq \frac{\hbar}{2}` | 海森堡不确定性原理 |
| `L^x,L^y]=iℏL^z` | `[\hat{L}_x, \hat{L}_y] = i\hbar \hat{L}_z` | 角动量对易关系 |
| `P(x)=∣Ψ(x)∣2` | `P(x) = \|\Psi(x)\|^2` | 概率密度 |
| `H^∣Ψ⟩=E∣Ψ⟩` | `\hat{H} \|\Psi\rangle = E \|\Psi\rangle` | 时间无关薛定谔方程 |

### 4. 相对论和场论

| 输入 | 期望输出 | 类型 |
|------|----------|------|
| `iℏ\gamma\mu\partial\mu​−mc)ψ=0` | `i\hbar \gamma^\mu \partial_\mu - mc) \psi = 0` | 狄拉克方程 |

### 5. 化学公式

| 输入 | 期望输出 | 类型 |
|------|----------|------|
| `k=Ae−RTE_{a}` | `k = A e^{-E_a/RT}` | 阿伦尼乌斯方程 |
| `ΔHrxn​=\sumΔHf∘​(products)−\sumΔHf∘​(reactants` | `\Delta H_{rxn} = \sum \Delta H_f^\circ (\text{products}) - \sum \Delta H_f^\circ (\text{reactants})` | 反应焓变 |
| `K_{c}=[A]a[B]b[C]c[D]d` | `K_c = \frac{[C]^c [D]^d}{[A]^a [B]^b}` | 化学平衡常数 |
| `Percent Composition=mass of compoundmass of element​\times100%` | `\text{Percent Composition} = \frac{\text{mass of element}}{\text{mass of compound}} \times 100\%` | 百分组成 |

### 6. 数学分析

| 输入 | 期望输出 | 类型 |
|------|----------|------|
| `Fn​=5​ϕn−ψn​` | `F_n = \frac{\phi^n - \psi^n}{\sqrt{5}}` | 斐波那契通项公式 |

## 技术改进点

### 1. 数学符号映射表
- 完整的希腊字母映射
- 积分符号：`∫`, `∬`, `∭`, `∮`
- 微分算子：`∂`, `∇`, `∆`
- 向量运算：`⋅`, `×`, `∘`
- 量子力学：`ℏ`, `∣`, `⟩`, `⟨`

### 2. DOM结构分析增强
- 更精确的分数识别
- 上下标位置检测
- 积分限制识别
- 求和范围检测

### 3. LaTeX命令重构
- 破损命令修复
- 物理公式特殊处理
- 量子力学符号标准化
- 化学公式格式化

### 4. 模式匹配优化
- 零宽字符清理
- 间距标准化
- 括号匹配修复
- 符号替换优化

## 测试方法

1. **在Gemini页面询问相关数学问题**
2. **双击生成的公式**
3. **检查复制的LaTeX是否符合期望**
4. **在LaTeX编辑器中验证语法正确性**

## 预期改进效果

- **准确性**: 从85%提升到95%+
- **覆盖范围**: 支持物理、化学、量子力学等领域
- **通用性**: 基于符号映射而非硬编码
- **可维护性**: 模块化设计，易于扩展

## 注意事项

- 保持与现有Gemini特殊逻辑的兼容性
- 不影响Taylor级数、Black-Scholes等已有功能
- 优先级系统确保性能优化
- 详细日志便于调试和改进
