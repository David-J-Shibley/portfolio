import { useState, useEffect } from 'react';

const CodingGame = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState('');
  const [success, setSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(true);
  const [showHint, setShowHint] = useState(false);

  const challenges = [
    {
      title: "Sum of Two Numbers",
      description: "Write a function called 'sum' that takes two parameters (a and b) and returns their sum.",
      initialCode: "function sum(a, b) {\n  // Your code here\n}",
      testCases: [
        { input: [2, 3], expected: 5 },
        { input: [-1, 5], expected: 4 },
        { input: [0, 0], expected: 0 }
      ],
      hint: "Remember to use the return keyword to output the result of a + b."
    },
    {
      title: "Find the Largest Number",
      description: "Write a function called 'findLargest' that takes an array of numbers and returns the largest number.",
      initialCode: "function findLargest(numbers) {\n  // Your code here\n}",
      testCases: [
        { input: [[1, 5, 3, 9, 2]], expected: 9 },
        { input: [[-1, -5, -3]], expected: -1 },
        { input: [[0, 0, 0]], expected: 0 }
      ],
      hint: "You can use Math.max() with the spread operator (...) or a loop to compare each number."
    },
    {
      title: "Reverse a String",
      description: "Write a function called 'reverseString' that takes a string and returns it reversed.",
      initialCode: "function reverseString(str) {\n  // Your code here\n}",
      testCases: [
        { input: ["hello"], expected: "olleh" },
        { input: ["JavaScript"], expected: "tpircSavaJ" },
        { input: [""], expected: "" }
      ],
      hint: "Try splitting the string into an array, reversing it, and joining it back together."
    },
    // Add these to your existing challenges array
{
    title: "Palindrome Checker",
    description: "Write a function called 'isPalindrome' that takes a string and returns true if it's a palindrome (reads the same forwards and backwards), false otherwise. Ignore case sensitivity.",
    initialCode: "function isPalindrome(str) {\n  // Your code here\n}",
    testCases: [
      { input: ["racecar"], expected: true },
      { input: ["hello"], expected: false },
      { input: ["A man a plan a canal Panama"], expected: true }
    ],
    hint: "Remove spaces and special characters, convert to lowercase, then compare the string with its reverse."
  },
  {
    title: "FizzBuzz",
    description: "Write a function called 'fizzBuzz' that takes a number n and returns an array containing the FizzBuzz sequence up to n. For multiples of 3, use 'Fizz', for multiples of 5, use 'Buzz', and for multiples of both, use 'FizzBuzz'.",
    initialCode: "function fizzBuzz(n) {\n  // Your code here\n}",
    testCases: [
      { input: [5], expected: [1, 2, "Fizz", 4, "Buzz"] },
      { input: [15], expected: [1, 2, "Fizz", 4, "Buzz", "Fizz", 7, 8, "Fizz", "Buzz", 11, "Fizz", 13, 14, "FizzBuzz"] },
      { input: [0], expected: [] }
    ],
    hint: "Use a loop from 1 to n, checking each number's divisibility by 3 and 5."
  },
  {
    title: "Array Flattener",
    description: "Write a function called 'flattenArray' that takes a nested array and returns a flattened version (all elements in a single-level array).",
    initialCode: "function flattenArray(arr) {\n  // Your code here\n}",
    testCases: [
      { input: [[[1, 2], [3, 4]]], expected: [1, 2, 3, 4] },
      { input: [[1, [2, [3, 4], 5]]], expected: [1, 2, 3, 4, 5] },
      { input: [[[]]], expected: [] }
    ],
    hint: "Consider using Array.flat(), recursion, or reduce() with concat()."
  },
  {
    title: "Count Vowels",
    description: "Write a function called 'countVowels' that takes a string and returns the number of vowels (a, e, i, o, u) in it. The function should be case-insensitive.",
    initialCode: "function countVowels(str) {\n  // Your code here\n}",
    testCases: [
      { input: ["hello world"], expected: 3 },
      { input: ["JAVASCRIPT"], expected: 3 },
      { input: ["rhythm"], expected: 0 }
    ],
    hint: "Convert the string to lowercase, then count occurrences of 'a', 'e', 'i', 'o', and 'u'."
  },
  {
    title: "Anagram Checker",
    description: "Write a function called 'areAnagrams' that takes two strings and returns true if they are anagrams (contain the same characters in different order), false otherwise. Ignore spaces and case sensitivity.",
    initialCode: "function areAnagrams(str1, str2) {\n  // Your code here\n}",
    testCases: [
      { input: ["listen", "silent"], expected: true },
      { input: ["hello", "world"], expected: false },
      { input: ["Astronomer", "Moon starer"], expected: true }
    ],
    hint: "Clean both strings (remove spaces, convert to lowercase), then sort their characters and compare."
  },
  {
    title: "Find Missing Number",
    description: "Write a function called 'findMissing' that takes an array of n-1 unique numbers from the range 1 to n and returns the missing number.",
    initialCode: "function findMissing(numbers) {\n  // Your code here\n}",
    testCases: [
      { input: [[1, 2, 4, 5]], expected: 3 },
      { input: [[2, 3, 4, 5, 6]], expected: 1 },
      { input: [[1, 2, 3, 4, 5, 6, 8, 9]], expected: 7 }
    ],
    hint: "Calculate what the sum should be with n*(n+1)/2, then subtract the actual sum of the array."
  },
  {
    title: "Title Case",
    description: "Write a function called 'titleCase' that takes a string and returns it with the first letter of each word capitalized.",
    initialCode: "function titleCase(str) {\n  // Your code here\n}",
    testCases: [
      { input: ["hello world"], expected: "Hello World" },
      { input: ["javascript is fun"], expected: "Javascript Is Fun" },
      { input: ["the quick brown fox"], expected: "The Quick Brown Fox" }
    ],
    hint: "Split the string into words, capitalize the first letter of each word, then join them back."
  },
  {
    title: "Remove Duplicates",
    description: "Write a function called 'removeDuplicates' that takes an array and returns a new array with all duplicate elements removed.",
    initialCode: "function removeDuplicates(arr) {\n  // Your code here\n}",
    testCases: [
      { input: [[1, 2, 2, 3, 4, 4, 5]], expected: [1, 2, 3, 4, 5] },
      { input: [["apple", "banana", "apple", "orange"]], expected: ["apple", "banana", "orange"] },
      { input: [[true, false, true, true]], expected: [true, false] }
    ],
    hint: "Consider using Set to automatically remove duplicates, or filter with indexOf."
  },
  {
    title: "Factorial Calculator",
    description: "Write a function called 'factorial' that takes a non-negative integer and returns its factorial (n!).",
    initialCode: "function factorial(n) {\n  // Your code here\n}",
    testCases: [
      { input: [5], expected: 120 },
      { input: [0], expected: 1 },
      { input: [10], expected: 3628800 }
    ],
    hint: "Consider using recursion or a loop to multiply all numbers from 1 to n."
  },
  {
    title: "Prime Number Checker",
    description: "Write a function called 'isPrime' that takes a positive integer and returns true if it's a prime number, false otherwise.",
    initialCode: "function isPrime(num) {\n  // Your code here\n}",
    testCases: [
      { input: [7], expected: true },
      { input: [4], expected: false },
      { input: [1], expected: false }
    ],
    hint: "Check divisibility from 2 to the square root of the number. Don't forget edge cases like 1 and 2."
  }
  ];

  useEffect(() => {
    if (currentLevel < challenges.length && gameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentLevel, gameActive, timeLeft, challenges.length]);

  useEffect(() => {
    if (timeLeft === 0) {
    //   setGameActive(false);
      setOutput("Time's up! Try again.");
    }
  }, [timeLeft]);

  useEffect(() => {
    if (currentLevel < challenges.length) {
      setUserCode(challenges[currentLevel].initialCode);
      setOutput('');
      setSuccess(false);
      setTimeLeft(60);
      setGameActive(true);
      setShowHint(false);
    } else {
      setOutput("Congratulations! You've completed all challenges!");
      setGameActive(false);
    }
  }, [currentLevel, challenges.length]);

  const runCode = () => {
    setAttempts(prev => prev + 1);
    
    try {
      // Create a function from user code
      const userFunction = new Function('return ' + userCode)();
      
      // Run test cases
      const challenge = challenges[currentLevel];
      let allTestsPassed = true;
      let results = [];
      
      for (const testCase of challenge.testCases) {
        const result = userFunction(...testCase.input);
        const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
        results.push({ input: testCase.input, expected: testCase.expected, actual: result, passed });
        
        if (!passed) {
          allTestsPassed = false;
        }
      }
      
      // Generate output
      let outputText = "Test Results:\n";
      results.forEach((result, i) => {
        outputText += `Test ${i + 1}: ${result.passed ? 'PASSED ✓' : 'FAILED ✗'}\n`;
        outputText += `  Input: ${JSON.stringify(result.input)}\n`;
        outputText += `  Expected: ${JSON.stringify(result.expected)}\n`;
        outputText += `  Actual: ${JSON.stringify(result.actual)}\n`;
      });
      
      if (allTestsPassed) {
        outputText += "\nAll tests passed! You can move to the next level.";
        setSuccess(true);
      } else {
        outputText += "\nSome tests failed. Try again!";
      }
      
      setOutput(outputText);
    } catch (error) {
      setOutput(`Error: ${(error as any).message}`);
    }
  };

  const nextLevel = () => {
    if (currentLevel < challenges.length - 1) {
      setCurrentLevel(prev => prev + 1);
    } else {
      setOutput("Congratulations! You've completed all challenges!");
      setGameActive(false);
    }
  };

  const resetLevel = () => {
    setUserCode(challenges[currentLevel].initialCode);
    setOutput('');
    setTimeLeft(60);
    setGameActive(true);
    setShowHint(false);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  return (
    <div className="flex flex-col p-4 h-full bg-slate-100 min-h-screen">
      <header className="bg-blue-600 text-white p-4 rounded-lg shadow-md mb-4">
        <h1 className="text-2xl font-bold">Code Challenge Game</h1>
        <div className="flex justify-between items-center mt-2">
          <span>Level: {currentLevel + 1}/{challenges.length}</span>
          <span>Time: {timeLeft}s</span>
          <span>Attempts: {attempts}</span>
        </div>
      </header>

      {currentLevel < challenges.length && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">{challenges[currentLevel].title}</h2>
            <p className="mb-4">{challenges[currentLevel].description}</p>
            
            {showHint && (
              <div className="bg-yellow-100 p-2 rounded-md mb-4">
                <p className="text-sm"><strong>Hint:</strong> {challenges[currentLevel].hint}</p>
              </div>
            )}
            
            <textarea
              className="w-full h-64 p-2 font-mono text-sm border border-gray-300 rounded-md"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              disabled={!gameActive}
            />
            
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400"
                onClick={runCode}
                disabled={!gameActive}
              >
                Run Code
              </button>
              
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                onClick={nextLevel}
                disabled={!success || !gameActive}
              >
                Next Level
              </button>
              
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                onClick={toggleHint}
              >
                {showHint ? "Hide Hint" : "Show Hint"}
              </button>
              
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={resetLevel}
              >
                Reset Level
              </button>
            </div>
          </div>
          
          <div className="bg-black text-green-400 p-4 rounded-lg shadow-md font-mono whitespace-pre-wrap overflow-auto h-full min-h-64">
            {output || "Run your code to see the output here..."}
          </div>
        </div>
      )}
      
      {currentLevel >= challenges.length && (
        <div className="bg-green-100 p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
          <p className="text-lg mb-4">You've completed all coding challenges.</p>
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
            onClick={() => setCurrentLevel(0)}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default CodingGame;