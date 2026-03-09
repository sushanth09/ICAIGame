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

// ROUND 3 — LIGHTNING ROUND (MCQ format)
export const round3Questions: Round3Question[] = [
  {
    id: "r3q1",
    text: "What is another name for the 'Statement of Financial Position'?",
    options: [
      { id: "A", text: "Income Statement" },
      { id: "B", text: "Cash Flow Statement" },
      { id: "C", text: "Balance Sheet" },
      { id: "D", text: "Statement of Changes in Equity" },
    ],
    correctAnswer: "C",
  },
  {
    id: "r3q2",
    text: "ROE stands for:",
    options: [
      { id: "A", text: "Revenue on Equity" },
      { id: "B", text: "Return on Equity" },
      { id: "C", text: "Rate of Earnings" },
      { id: "D", text: "Return on Expenses" },
    ],
    correctAnswer: "B",
  },
  {
    id: "r3q3",
    text: "EBITDA stands for Earnings Before Interest, Taxes, Depreciation, and:",
    options: [
      { id: "A", text: "Assets" },
      { id: "B", text: "Accounts" },
      { id: "C", text: "Amortization" },
      { id: "D", text: "Allocation" },
    ],
    correctAnswer: "C",
  },
  {
    id: "r3q4",
    text: "An audit opinion issued when financial statements are free from material misstatement is called:",
    options: [
      { id: "A", text: "Qualified Opinion" },
      { id: "B", text: "Adverse Opinion" },
      { id: "C", text: "Disclaimer of Opinion" },
      { id: "D", text: "Unqualified Opinion" },
    ],
    correctAnswer: "D",
  },
  {
    id: "r3q5",
    text: "GST stands for:",
    options: [
      { id: "A", text: "General Sales Tax" },
      { id: "B", text: "Goods and Services Tax" },
      { id: "C", text: "Government Standard Tax" },
      { id: "D", text: "Gross Service Tax" },
    ],
    correctAnswer: "B",
  },
  {
    id: "r3q6",
    text: "The assumption that a business will continue to operate indefinitely is called:",
    options: [
      { id: "A", text: "Accrual Concept" },
      { id: "B", text: "Consistency Principle" },
      { id: "C", text: "Going Concern" },
      { id: "D", text: "Materiality Concept" },
    ],
    correctAnswer: "C",
  },
  {
    id: "r3q7",
    text: "Which ratio measures how efficiently a company uses its assets to generate sales revenue?",
    options: [
      { id: "A", text: "Current Ratio" },
      { id: "B", text: "Debt-to-Equity Ratio" },
      { id: "C", text: "Gross Profit Margin" },
      { id: "D", text: "Asset Turnover Ratio" },
    ],
    correctAnswer: "D",
  },
  {
    id: "r3q8",
    text: "Under ICAI guidelines, the cap on audit fees from a single client as a percentage of total fee income is:",
    options: [
      { id: "A", text: "50–60%" },
      { id: "B", text: "10–15%" },
      { id: "C", text: "25–30%" },
      { id: "D", text: "35–40%" },
    ],
    correctAnswer: "C",
  },
  {
    id: "r3q9",
    text: "The formal document issued by an auditor summarizing audit findings is called:",
    options: [
      { id: "A", text: "Trial Balance" },
      { id: "B", text: "Audit Report" },
      { id: "C", text: "Balance Sheet" },
      { id: "D", text: "Management Letter" },
    ],
    correctAnswer: "B",
  },
  {
    id: "r3q10",
    text: "Operating Profit divided by Revenue equals:",
    options: [
      { id: "A", text: "Net Profit Margin" },
      { id: "B", text: "Gross Margin" },
      { id: "C", text: "EBITDA Margin" },
      { id: "D", text: "Operating Margin" },
    ],
    correctAnswer: "D",
  },
];
