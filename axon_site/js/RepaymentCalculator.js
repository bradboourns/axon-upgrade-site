const { createApp } = Vue;

createApp({
  data() {
    return {
      amount: '',
      rate: '',
      term: '',
      result: ''
    };
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(value);
    },
    loanPayment(amount, annualRate, years) {
      const r = annualRate / 100 / 12;
      const n = years * 12;
      if (r === 0) {
        return amount / n;
      }
      return amount * r / (1 - Math.pow(1 + r, -n));
    },
    calculate() {
      const amount = parseFloat(this.amount) || 0;
      const rate = parseFloat(this.rate) || 0;
      const term = parseInt(this.term) || 0;
      const payment = this.loanPayment(amount, rate, term);
      this.result = `Estimated monthly repayment: ${this.formatCurrency(payment)}`;
    }
  }
}).mount('#repay-form');

