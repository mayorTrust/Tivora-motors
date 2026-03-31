import React, { useState, useEffect } from 'react';

const LoanCalculator = ({ price }) => {
  const [loanAmount, setLoanAmount] = useState(price);
  const [downPayment, setDownPayment] = useState(price * 0.1); // Default 10%
  const [interestRate, setInterestRate] = useState(5); // Default 5%
  const [loanTerm, setLoanTerm] = useState(60); // Default 60 months (5 years)
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    setLoanAmount(price);
    setDownPayment(price * 0.1);
  }, [price]);

  useEffect(() => {
    const calculateEMI = () => {
      const principal = loanAmount - downPayment;
      const monthlyInterestRate = (interestRate / 100) / 12;

      if (principal <= 0 || monthlyInterestRate === 0 || loanTerm <= 0) {
        setMonthlyPayment(0);
        return;
      }

      // EMI calculation formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
      const emi =
        principal *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, loanTerm) /
        (Math.pow(1 + monthlyInterestRate, loanTerm) - 1);

      setMonthlyPayment(emi);
    };

    calculateEMI();
  }, [loanAmount, downPayment, interestRate, loanTerm]);

  return (
    <div className="mt-16 bg-foreground/5 p-6 rounded-2xl border border-foreground/10">
      <h3 className="text-2xl font-bold mb-6 text-foreground">Loan & EMI Calculator</h3>
      <div className="space-y-5">
        <div>
          <label htmlFor="loanAmount" className="block text-sm font-medium text-foreground/70 mb-2">Vehicle Price</label>
          <input
            type="number"
            id="loanAmount"
            className="w-full p-3 bg-foreground/5 rounded-md border border-foreground/10 focus:outline-none focus:ring-2 focus:ring-accent"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            min="0"
          />
        </div>
        <div>
          <label htmlFor="downPayment" className="block text-sm font-medium text-foreground/70 mb-2">Down Payment</label>
          <input
            type="number"
            id="downPayment"
            className="w-full p-3 bg-foreground/5 rounded-md border border-foreground/10 focus:outline-none focus:ring-2 focus:ring-accent"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            min="0"
            max={loanAmount}
          />
        </div>
        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium text-foreground/70 mb-2">Interest Rate (%)</label>
          <input
            type="number"
            id="interestRate"
            className="w-full p-3 bg-foreground/5 rounded-md border border-foreground/10 focus:outline-none focus:ring-2 focus:ring-accent"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <label htmlFor="loanTerm" className="block text-sm font-medium text-foreground/70 mb-2">Loan Term (Months)</label>
          <input
            type="number"
            id="loanTerm"
            className="w-full p-3 bg-foreground/5 rounded-md border border-foreground/10 focus:outline-none focus:ring-2 focus:ring-accent"
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            min="1"
          />
        </div>

        <div className="pt-5 border-t border-foreground/10 mt-5">
          <p className="text-sm font-medium text-foreground/70 mb-2">Estimated Monthly Payment:</p>
          <p className="text-3xl font-bold text-accent">${monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;
