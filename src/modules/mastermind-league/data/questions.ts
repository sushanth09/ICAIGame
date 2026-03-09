// ICAI Atlanta Mastermind League - Question Data

import type { Round1Question, Round2Question, Round3Question } from "../types/gameTypes";

// ROUND 1 — THE ANALYST ARENA
export const round1Questions: Round1Question[] = [
  {
    id: "r1q1",
    text: "Under Ind AS 115, revenue from a contract with a customer is recognized when:",
    options: [
      { id: "A", text: "Cash is received" },
      { id: "B", text: "Control of goods or services transfers to the customer" },
      { id: "C", text: "Invoice is issued" },
      { id: "D", text: "Contract is signed" },
    ],
    correctAnswer: "B",
  },
  {
    id: "r1q2",
    text: "Which of the following does NOT form part of Cash Flow from Operating Activities under Ind AS 7?",
    options: [
      { id: "A", text: "Cash received from customers" },
      { id: "B", text: "Cash paid to suppliers" },
      { id: "C", text: "Purchase of machinery" },
      { id: "D", text: "Cash paid to employees" },
    ],
    correctAnswer: "C",
  },
  {
    id: "r1q3",
    text: "Which accounting principle requires expenses to be recorded in the same period as the related revenues?",
    options: [
      { id: "A", text: "Conservatism" },
      { id: "B", text: "Matching Principle" },
      { id: "C", text: "Consistency Principle" },
      { id: "D", text: "Accrual Principle" },
    ],
    correctAnswer: "B",
  },
  {
    id: "r1q4",
    text: "Under Ind AS 16, which of the following costs is NOT capitalized as part of Property, Plant and Equipment?",
    options: [
      { id: "A", text: "Site preparation costs" },
      { id: "B", text: "Delivery and handling costs" },
      { id: "C", text: "Administrative overheads unrelated to construction" },
      { id: "D", text: "Installation costs" },
    ],
    correctAnswer: "C",
  },
  {
    id: "r1q5",
    text: "Which financial ratio measures a company's ability to meet short-term obligations using its most liquid assets?",
    options: [
      { id: "A", text: "Current Ratio" },
      { id: "B", text: "Quick Ratio" },
      { id: "C", text: "Debt Equity Ratio" },
      { id: "D", text: "Interest Coverage Ratio" },
    ],
    correctAnswer: "B",
  },
];

// ROUND 2 — MYTH OR FACT
export const round2Questions: Round2Question[] = [
  {
    id: "r2q1",
    text: '"Depreciation is a process of valuation of assets."',
    correctAnswer: false, // Myth
  },
  {
    id: "r2q2",
    text: '"Revenue can be recognized even before cash is received under the accrual basis of accounting."',
    correctAnswer: true, // Fact
  },
  {
    id: "r2q3",
    text: '"An increase in accounts receivable increases operating cash flow."',
    correctAnswer: false, // Myth
  },
  {
    id: "r2q4",
    text: '"Goodwill is amortized under Ind AS."',
    correctAnswer: false, // Myth
  },
  {
    id: "r2q5",
    text: '"A company with a high debt-equity ratio is always financially unhealthy."',
    correctAnswer: false, // Myth
  },
];

// ROUND 3 — LIGHTNING ROUND
export const round3Questions: Round3Question[] = [
  { id: "r3q1", text: "Balance Sheet", correctAnswer: "Balance Sheet" },
  { id: "r3q2", text: "Return on Equity", correctAnswer: "ROE" },
  {
    id: "r3q3",
    text: "Earnings Before Interest Taxes Depreciation and Amortization",
    correctAnswer: "EBITDA",
  },
  { id: "r3q4", text: "Unqualified Opinion", correctAnswer: "Unqualified Opinion" },
  { id: "r3q5", text: "GST", correctAnswer: "Goods and Services Tax" },
  { id: "r3q6", text: "Going Concern", correctAnswer: "Going Concern" },
  { id: "r3q7", text: "Asset Turnover Ratio", correctAnswer: "Asset Turnover Ratio" },
  { id: "r3q8", text: "25–30%", correctAnswer: "Audit Fees" },
  { id: "r3q9", text: "Audit Report", correctAnswer: "Audit Report" },
  { id: "r3q10", text: "Operating Margin", correctAnswer: "Operating Margin" },
];
