document.getElementById('calculateBtn').addEventListener('click', () => {
  const amount = parseFloat(document.getElementById('loanAmount').value);
  const rate = parseFloat(document.getElementById('interestRate').value) / 100 / 12;
  const years = parseInt(document.getElementById('termYears').value, 10);
  const resultEl = document.getElementById('calcResult');

  if (!amount || !rate || !years) {
    resultEl.textContent = 'Please enter valid loan details.';
    return;
  }

  const payments = years * 12;
  const payment = (amount * rate) / (1 - Math.pow(1 + rate, -payments));
  const formatted = payment.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });
  resultEl.textContent = `Estimated monthly repayment: ${formatted}`;
});
