const { createApp } = Vue;

createApp({
  data() {
    return {
      amount: '',
      currentRate: '',
      newRate: '',
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
      const currentRate = parseFloat(this.currentRate) || 0;
      const newRate = parseFloat(this.newRate) || 0;
      const term = parseInt(this.term) || 0;
      const currentPayment = this.loanPayment(amount, currentRate, term);
      const newPayment = this.loanPayment(amount, newRate, term);
      const monthlySaving = currentPayment - newPayment;
      const totalSaving = monthlySaving * term * 12;
      this.result = `Monthly saving: ${this.formatCurrency(monthlySaving)} | Total saving: ${this.formatCurrency(totalSaving)}`;
    }
  }
}).mount('#refi-form');

