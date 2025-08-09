function formatCurrency(value) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(value);
}

function loanPayment(amount, annualRate, years) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) {
    return amount / n;
  }
  return amount * r / (1 - Math.pow(1 + r, -n));
}

document.addEventListener('DOMContentLoaded', () => {
  const bindRange = (id) => {
    const input = document.getElementById(id);
    const display = document.getElementById(`${id}-display`);
    if (input && display) {
      const update = () => {
        display.textContent = input.value;
      };
      input.addEventListener('input', update);
      update();
    }
  };

  function calcBorrow() {
    const income = parseFloat(document.getElementById('income').value) || 0;
    const expenses = parseFloat(document.getElementById('expenses').value) || 0;
    const rate = parseFloat(document.getElementById('bc-rate').value) || 0;
    const term = parseInt(document.getElementById('bc-term').value) || 0;
    const monthlyAvailable = Math.max(0, income / 12 - expenses);
    const r = rate / 100 / 12;
    const n = term * 12;
    let borrow = 0;
    if (r > 0) {
      borrow = monthlyAvailable * (1 - Math.pow(1 + r, -n)) / r;
    } else {
      borrow = monthlyAvailable * n;
    }
    document.getElementById('borrow-result').textContent =
      'Estimated borrowing capacity: ' + formatCurrency(borrow);
  }

  const borrowForm = document.getElementById('borrow-form');
  if (borrowForm) {
    borrowForm.addEventListener('submit', (e) => {
      e.preventDefault();
      calcBorrow();
    });
    ['income', 'expenses', 'bc-rate', 'bc-term'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', calcBorrow);
    });
    ['bc-rate', 'bc-term'].forEach(bindRange);
  }

  function calcRepay() {
    const amount = parseFloat(document.getElementById('loan-amount').value) || 0;
    const rate = parseFloat(document.getElementById('repay-rate').value) || 0;
    const term = parseInt(document.getElementById('repay-term').value) || 0;
    const payment = loanPayment(amount, rate, term);
    document.getElementById('repay-result').textContent =
      'Estimated monthly repayment: ' + formatCurrency(payment);
  }

  const repayForm = document.getElementById('repay-form');
  if (repayForm) {
    repayForm.addEventListener('submit', (e) => {
      e.preventDefault();
      calcRepay();
    });
    ['loan-amount', 'repay-rate', 'repay-term'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', calcRepay);
    });
    ['repay-rate', 'repay-term'].forEach(bindRange);
  }

  function calcRefi() {
    const amount = parseFloat(document.getElementById('refi-amount').value) || 0;
    const currentRate = parseFloat(document.getElementById('current-rate').value) || 0;
    const newRate = parseFloat(document.getElementById('new-rate').value) || 0;
    const term = parseInt(document.getElementById('refi-term').value) || 0;
    const currentPayment = loanPayment(amount, currentRate, term);
    const newPayment = loanPayment(amount, newRate, term);
    const monthlySaving = currentPayment - newPayment;
    const totalSaving = monthlySaving * term * 12;
    document.getElementById('refi-result').textContent =
      'Monthly saving: ' + formatCurrency(monthlySaving) + ' | Total saving: ' + formatCurrency(totalSaving);
  }

  const refiForm = document.getElementById('refi-form');
  if (refiForm) {
    refiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      calcRefi();
    });
    ['refi-amount', 'current-rate', 'new-rate', 'refi-term'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', calcRefi);
    });
    ['current-rate', 'new-rate', 'refi-term'].forEach(bindRange);
  }

  function calcInvest() {
    const price = parseFloat(document.getElementById('property-price').value) || 0;
    const rent = parseFloat(document.getElementById('rent').value) || 0;
    const expenses = parseFloat(document.getElementById('invest-expenses').value) || 0;
    const annualNet = (rent - expenses) * 12;
    const roi = price > 0 ? (annualNet / price) * 100 : 0;
    document.getElementById('invest-result').textContent =
      'Annual cash flow: ' + formatCurrency(annualNet) + ' | ROI: ' + roi.toFixed(2) + '%';
  }

  const investForm = document.getElementById('invest-form');
  if (investForm) {
    investForm.addEventListener('submit', (e) => {
      e.preventDefault();
      calcInvest();
    });
    ['property-price', 'rent', 'invest-expenses'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', calcInvest);
    });
  }

  function calcDeposit() {
    const target = parseFloat(document.getElementById('target').value) || 0;
    const current = parseFloat(document.getElementById('current').value) || 0;
    const years = parseInt(document.getElementById('deposit-years').value) || 0;
    const rate = parseFloat(document.getElementById('deposit-rate').value) || 0;
    const n = years * 12;
    const r = rate / 100 / 12;
    let monthlySaving = 0;
    if (r > 0) {
      monthlySaving = (target - current * Math.pow(1 + r, n)) * r / (Math.pow(1 + r, n) - 1);
    } else {
      monthlySaving = (target - current) / n;
    }
    document.getElementById('deposit-result').textContent =
      'Required monthly saving: ' + formatCurrency(monthlySaving);
  }

  const depositForm = document.getElementById('deposit-form');
  if (depositForm) {
    depositForm.addEventListener('submit', (e) => {
      e.preventDefault();
      calcDeposit();
    });
    ['target', 'current', 'deposit-years', 'deposit-rate'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', calcDeposit);
    });
    ['deposit-years', 'deposit-rate'].forEach(bindRange);
  }
});
