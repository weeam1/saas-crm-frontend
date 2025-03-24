// utils/numberToWords.js
const ones = [
  "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen"
];

const tens = [
  "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"
];

const convertToWords = (num) => {
  if (isNaN(num)) return "Invalid number";

  const [integerPart, decimalPart] = num.toString().split(".");

  const convertInteger = (n) => {
    if (n === 0) return "zero";
    if (n < 20) return ones[n];
    if (n < 100) {
      return `${tens[Math.floor(n / 10)]}${n % 10 ? "-" + ones[n % 10] : ""}`;
    }
    if (n < 1000) {
      return `${ones[Math.floor(n / 100)]} hundred${n % 100 ? " and " + convertInteger(n % 100) : ""}`;
    }
    if (n < 1000000) {
      return `${convertInteger(Math.floor(n / 1000))} thousand${n % 1000 ? " " + convertInteger(n % 1000) : ""}`;
    }
    if (n < 1000000000) {
      return `${convertInteger(Math.floor(n / 1000000))} million${n % 1000000 ? " " + convertInteger(n % 1000000) : ""}`;
    }
    return `${convertInteger(Math.floor(n / 1000000000))} billion${n % 1000000000 ? " " + convertInteger(n % 1000000000) : ""}`;
  };

  const integerWords = convertInteger(parseInt(integerPart, 10));
  
  // Convert decimal part if it exists
  if (decimalPart) {
    const decimalWords = decimalPart.split("").map((digit) => ones[parseInt(digit, 10)]).join(" ");
    return `${integerWords} point ${decimalWords}`;
  }

  return integerWords;
};

export default convertToWords;
