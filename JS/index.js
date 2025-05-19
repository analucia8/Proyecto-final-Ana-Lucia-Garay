const currencies = [
    { code: "USD", name: "Dólar Estadounidense" },
    { code: "EUR", name: "Euro" },
    { code: "UYU", name: "Peso Uruguayo" }
  ];
  
  const conversionHistory = [];
  
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
  
  async function convertCurrency() {
    const amountInput = document.getElementById('amount');
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const resultDiv = document.getElementById('result');
  
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
      const amountInBase = amount / exchangeData.rates[fromCurrency];
      convertedAmount = amountInBase * exchangeData.rates[toCurrency];
    }
  
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
  
    conversionHistory.push({
      from: fromCurrency,
      to: toCurrency,
      amount,
      result: convertedAmount,
      date: new Date().toLocaleString()
    });
    localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
    updateHistory();
  }
  
  function updateHistory() {
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = '<h3>Historial de conversiones</h3>';
    conversionHistory.slice().reverse().forEach(entry => {
      const item = document.createElement('p');
      item.textContent = `${entry.date}: ${entry.amount} ${entry.from} → ${entry.result} ${entry.to}`;
      historyDiv.appendChild(item);
    });
  }
  
  function clearHistory() {
    conversionHistory.length = 0;
    localStorage.removeItem('conversionHistory');
    updateHistory();
    Toastify({
      text: "Historial eliminado",
      duration: 3000,
      style: { background: "linear-gradient(to right, #ff416c, #ff4b2b)" }
    }).showToast();
  }
  
  function showSection(section) {
    document.getElementById('cotizador-section').style.display = (section === 'cotizador') ? 'block' : 'none';
    document.getElementById('quienes-section').style.display = (section === 'quienes') ? 'block' : 'none';
    document.getElementById('uso-section').style.display = (section === 'uso') ? 'block' : 'none';
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    generateForm();
    const savedHistory = localStorage.getItem('conversionHistory');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      parsed.forEach(entry => conversionHistory.push(entry));
      updateHistory();
    }
  });
  