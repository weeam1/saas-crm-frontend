const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

const convertToWords = (num) => {
  if (isNaN(num)) return "Invalid number";

  const [integerPart, decimalPart] = num.toString().split(".");

  const convertInteger = (n) => {
    if (n === 0) return "Zero";
    if (n < 20) return ones[n];
    if (n < 100) {
      return `${tens[Math.floor(n / 10)]}${n % 10 ? " " + ones[n % 10] : ""}`;
    }
    if (n < 1000) {
      return `${ones[Math.floor(n / 100)]} Hundred${n % 100 ? " And " + convertInteger(n % 100) : ""}`;
    }
    if (n < 1000000) {
      return `${convertInteger(Math.floor(n / 1000))} Thousand${n % 1000 ? " " + convertInteger(n % 1000) : ""}`;
    }
    if (n < 1000000000) {
      return `${convertInteger(Math.floor(n / 1000000))} Million${n % 1000000 ? " " + convertInteger(n % 1000000) : ""}`;
    }
    return `${convertInteger(Math.floor(n / 1000000000))} Billion${n % 1000000000 ? " " + convertInteger(n % 1000000000) : ""}`;
  };

  const integerWords = convertInteger(parseInt(integerPart, 10));

  // Convert decimal part if it exists
  if (decimalPart) {
    const decimalWords = decimalPart
      .split("")
      .map((digit) => ones[parseInt(digit, 10)])
      .join(" ");
    return `${integerWords} Point ${decimalWords}`;
  }

  return integerWords;
};

export default convertToWords;
