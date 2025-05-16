// Objetos para representar las monedas
const currencies = [
    { code: "USD", name: "Dólar Estadounidense" },
    { code: "EUR", name: "Euro" },
    { code: "UYU", name: "Peso Uruguayo" }
  ];
  
  // Función para cargar las tasas de cambio de forma asíncrona
  async function fetchExchangeRates() {
    try {
      const response = await fetch('data.json');
      const data = await response.json();
      return data;
    } catch (error) {
      Toastify({
        text: "Error al cargar las tasas de cambio",
        duration: 3000,
        style: { background: "linear-gradient(to right, #ff416c, #ff4b2b)" }
      }).showToast();
      return null;
    }
  }
  
  function generateForm() {
    const converterDiv = document.getElementById('currency-converter');
    
    const currencyOptions = currencies.map(currency => 
      `<option value="${currency.code}">${currency.name}</option>`
    ).join('');
  
    converterDiv.innerHTML = `
      <div class="form-group">
        <label for="amount">Cantidad:</label>
        <input type="number" id="amount" value="100" min="0" step="0.01">
      </div>
      <div class="form-group">
        <label for="fromCurrency">De:</label>
        <select id="fromCurrency">${currencyOptions}</select>
      </div>
      <div class="form-group">
        <label for="toCurrency">A:</label>
        <select id="toCurrency">${currencyOptions}</select>
      </div>
      <button onclick="convertCurrency()">Cotizar</button>
    `;
  }
  
  // Función para realizar la conversión de monedas
  async function convertCurrency() {
    const amountInput = document.getElementById('amount');
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const resultDiv = document.getElementById('result');
  
    // Validar entrada
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
      Toastify({
        text: "Por favor, ingrese una cantidad válida",
        duration: 3000,
        style: { background: "linear-gradient(to right, #ff416c, #ff4b2b)" }
      }).showToast();
      return;
    }
  
    if (fromCurrency === toCurrency) {
      Toastify({
        text: "Seleccione monedas diferentes",
        duration: 3000,
        style: { background: "linear-gradient(to right, #ff416c, #ff4b2b)" }
      }).showToast();
      return;
    }
  
    const exchangeData = await fetchExchangeRates();
    if (!exchangeData) return;
  
    let convertedAmount;
    if (fromCurrency === exchangeData.base) {
      convertedAmount = amount * exchangeData.rates[toCurrency];
    } else if (toCurrency === exchangeData.base) {
      convertedAmount = amount / exchangeData.rates[fromCurrency];
    } else {
      // Convertir primero a la moneda base (USD) y luego a la moneda objetivo
      const amountInBase = amount / exchangeData.rates[fromCurrency];
      convertedAmount = amountInBase * exchangeData.rates[toCurrency];
    }
  
    // Redondear a 2 decimales
    convertedAmount = convertedAmount.toFixed(2);
  
    resultDiv.innerHTML = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
  
    Swal.fire({
      title: 'Conversión Exitosa',
      html: `Has convertido ${amount} ${fromCurrency} a ${convertedAmount} ${toCurrency}`,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  
    Toastify({
      text: "Conversión realizada con éxito",
      duration: 3000,
      style: { background: "linear-gradient(to right, #00b09b, #96c93d)" }
    }).showToast();
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    generateForm();
  });