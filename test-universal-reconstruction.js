/**
 * Test script for Universal Mathematical Reconstruction
 * Tests the improved LaTeX extraction logic
 */

// Test cases based on the problematic formulas
const testCases = [
    {
        name: "Quadratic Equation",
        input: "ax2+bx+c=0",
        expected: "ax^{2} + bx + c = 0",
        description: "Should convert superscripts correctly"
    },
    {
        name: "Bayes' Theorem",
        input: "P(A∣B)=P(B)P(B∣A)P(A)​",
        expected: "P(A|B) = \\frac{P(B|A)P(A)}{P(B)}",
        description: "Should reconstruct fraction and fix conditional probability symbol"
    },
    {
        name: "Fibonacci Formula",
        input: "Fn​=5​ϕn−ψn​",
        expected: "F_{n} = \\frac{\\phi^{n} - \\psi^{n}}{\\sqrt{5}}",
        description: "Should reconstruct subscripts, superscripts, fraction and square root"
    },
    {
        name: "Simple Power",
        input: "x2+y3=z4",
        expected: "x^{2} + y^{3} = z^{4}",
        description: "Should handle multiple superscripts"
    },
    {
        name: "Subscript Test",
        input: "An+Bn=Cn",
        expected: "A_{n} + B_{n} = C_{n}",
        description: "Should handle multiple subscripts"
    }
];

// Mock DOM element creation
function createMockElement(text, htmlStructure = null) {
    const div = document.createElement('div');
    div.textContent = text;
    
    if (htmlStructure) {
        div.innerHTML = htmlStructure;
    }
    
    return div;
}

// Test the universal reconstruction function
function testUniversalReconstruction() {
    console.log('🧪 Testing Universal Mathematical Reconstruction');
    console.log('=' .repeat(60));
    
    let passedTests = 0;
    let totalTests = testCases.length;
    
    testCases.forEach((testCase, index) => {
        console.log(`\n📝 Test ${index + 1}: ${testCase.name}`);
        console.log(`Input: "${testCase.input}"`);
        console.log(`Expected: "${testCase.expected}"`);
        console.log(`Description: ${testCase.description}`);
        
        // Create mock element
        const mockElement = createMockElement(testCase.input);
        
        // Test the function
        try {
            const result = universalMathReconstruction(testCase.input, mockElement);
            console.log(`Result: "${result}"`);
            
            if (result === testCase.expected) {
                console.log('✅ PASSED');
                passedTests++;
            } else if (result && result.includes('\\')) {
                console.log('⚠️  PARTIAL - Contains LaTeX but not exact match');
                console.log(`   Difference: Expected "${testCase.expected}", got "${result}"`);
            } else {
                console.log('❌ FAILED - No LaTeX output');
            }
        } catch (error) {
            console.log('💥 ERROR:', error.message);
        }
    });
    
    console.log('\n' + '=' .repeat(60));
    console.log(`📊 Test Results: ${passedTests}/${totalTests} passed (${Math.round(passedTests/totalTests*100)}%)`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests passed!');
    } else {
        console.log('🔧 Some tests need improvement');
    }
}

// Test the general pattern reconstruction
function testGeneralPatternReconstruction() {
    console.log('\n🔧 Testing General Pattern Reconstruction');
    console.log('=' .repeat(60));
    
    const patterns = [
        { input: "ax2", expected: "ax^{2}" },
        { input: "Fn", expected: "F_{n}" },
        { input: "x2+y3", expected: "x^{2} + y^{3}" },
        { input: "P(A∣B)", expected: "P(A|B)" },
        { input: "a=b+c", expected: "a = b + c" }
    ];
    
    patterns.forEach((pattern, index) => {
        console.log(`\n🔍 Pattern ${index + 1}: "${pattern.input}" -> "${pattern.expected}"`);
        
        try {
            const result = reconstructGeneralMathPattern(pattern.input);
            console.log(`Result: "${result}"`);
            
            if (result === pattern.expected) {
                console.log('✅ PASSED');
            } else {
                console.log('⚠️  Different result');
            }
        } catch (error) {
            console.log('💥 ERROR:', error.message);
        }
    });
}

// Main test runner
function runAllTests() {
    console.log('🚀 Starting Universal Math Reconstruction Tests');
    console.log('Time:', new Date().toISOString());
    
    // Test if functions exist
    if (typeof universalMathReconstruction === 'undefined') {
        console.error('❌ universalMathReconstruction function not found!');
        console.log('💡 Make sure to load the content.js file first');
        return;
    }
    
    if (typeof reconstructGeneralMathPattern === 'undefined') {
        console.error('❌ reconstructGeneralMathPattern function not found!');
        console.log('💡 Make sure to load the content.js file first');
        return;
    }
    
    testUniversalReconstruction();
    testGeneralPatternReconstruction();
    
    console.log('\n🏁 All tests completed!');
}

// Auto-run if in browser console
if (typeof window !== 'undefined') {
    console.log('🌐 Browser environment detected');
    console.log('📋 To run tests, execute: runAllTests()');
    
    // Make functions available globally for manual testing
    window.testUniversalReconstruction = testUniversalReconstruction;
    window.testGeneralPatternReconstruction = testGeneralPatternReconstruction;
    window.runAllTests = runAllTests;
    
    // Auto-run after a short delay to allow content.js to load
    setTimeout(() => {
        if (typeof universalMathReconstruction !== 'undefined') {
            runAllTests();
        } else {
            console.log('⏳ Waiting for content.js to load...');
            console.log('💡 Run runAllTests() manually when ready');
        }
    }, 1000);
} else {
    console.log('📦 Node.js environment detected');
    console.log('💡 This script is designed for browser testing');
}
