const { createApp } = Vue;

createApp({
  data() {
    return {
      target: '',
      current: 0,
      years: '',
      rate: 0,
      result: ''
    };
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(value);
    },
    calculate() {
      const target = parseFloat(this.target) || 0;
      const current = parseFloat(this.current) || 0;
      const years = parseInt(this.years) || 0;
      const rate = parseFloat(this.rate) || 0;
      const n = years * 12;
      const r = rate / 100 / 12;
      let monthlySaving = 0;
      if (r > 0) {
        monthlySaving = (target - current * Math.pow(1 + r, n)) * r / (Math.pow(1 + r, n) - 1);
      } else {
        monthlySaving = (target - current) / n;
      }
      this.result = `Required monthly saving: ${this.formatCurrency(monthlySaving)}`;
    }
  }
}).mount('#deposit-form');

