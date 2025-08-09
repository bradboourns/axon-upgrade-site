const { createApp } = Vue;

createApp({
  data() {
    return {
      price: '',
      rent: '',
      expenses: '',
      result: ''
    };
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(value);
    },
    calculate() {
      const price = parseFloat(this.price) || 0;
      const rent = parseFloat(this.rent) || 0;
      const expenses = parseFloat(this.expenses) || 0;
      const annualNet = (rent - expenses) * 12;
      const roi = price > 0 ? (annualNet / price) * 100 : 0;
      this.result = `Annual cash flow: ${this.formatCurrency(annualNet)} | ROI: ${roi.toFixed(2)}%`;
    }
  }
}).mount('#invest-form');

