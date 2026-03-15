
function stripPrefix(str) {
    return str.replace(/^[a-z]\.\s*/i, "").trim();
}

function calculateScore(correct, answer) {
    const normalizedCorrect = (correct || "").trim().toLowerCase();
    const normalizedAnswer = (answer || "").trim().toLowerCase();

    // 1. Literal match (after normalization)
    let isMatch = normalizedCorrect === normalizedAnswer;

    // 2. Try stripping prefixes like "a. ", "b. ", etc. if not matched literally
    if (!isMatch) {
        const correctNoPrefix = stripPrefix(normalizedCorrect);
        const answerNoPrefix = stripPrefix(normalizedAnswer);
        if (correctNoPrefix !== "" && answerNoPrefix !== "") {
            isMatch = correctNoPrefix === answerNoPrefix;
        }
    }

    // 3. Fallback for single-letter answers matching prefixed correct answers or vice-versa
    if (!isMatch) {
        isMatch =
            (normalizedCorrect.length === 1 && normalizedAnswer.startsWith(normalizedCorrect + ".")) ||
            (normalizedAnswer.length === 1 && normalizedCorrect.startsWith(normalizedAnswer + "."));
    }

    return isMatch;
}

const testCases = [
    { c: "a. Python", a: "a. Python", expected: true },
    { c: "A. PYTHON", a: "a. python", expected: true },
    { c: "a. Python", a: "Python", expected: true },
    { c: "Python", a: "a. Python", expected: true },
    { c: "a", a: "a. Python", expected: true },
    { c: "a. Python", a: "a", expected: true },
    { c: "python", a: "python", expected: true },
    { c: "a. python", a: "b. python", expected: false }, // Should be false!
];

testCases.forEach((tc, b) => {
    const result = calculateScore(tc.c, tc.a);
    console.log(`Case ${b}: Correct="${tc.c}", Answer="${tc.a}", Match=${result} (Expected: ${tc.expected})`);
    if (result !== tc.expected) {
        console.error("FAIL!");
    }
});
