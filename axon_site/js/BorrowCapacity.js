const { createApp } = Vue;

createApp({
  data() {
    return {
      income: '',
      expenses: '',
      rate: '',
      term: '',
      result: ''
    };
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(value);
    },
    calculate() {
      const income = parseFloat(this.income) || 0;
      const expenses = parseFloat(this.expenses) || 0;
      const rate = parseFloat(this.rate) || 0;
      const term = parseInt(this.term) || 0;
      const monthlyAvailable = Math.max(0, income / 12 - expenses);
      const r = rate / 100 / 12;
      const n = term * 12;
      let borrow = 0;
      if (r > 0) {
        borrow = monthlyAvailable * (1 - Math.pow(1 + r, -n)) / r;
      } else {
        borrow = monthlyAvailable * n;
      }
      this.result = `Estimated borrowing capacity: ${this.formatCurrency(borrow)}`;
    }
  }
}).mount('#borrow-form');

