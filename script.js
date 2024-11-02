
let selectedCurrency = 'USD'; // Default currency
let currencySymbol = '$'; // Default symbol

let donations = JSON.parse(localStorage.getItem('donations')) || [];

// Update the currency symbol when the user changes the selection
function updateCurrency() {
  selectedCurrency = document.getElementById('currency').value;
  switch (selectedCurrency) {
    case 'EUR':
      currencySymbol = '€';
      break;
    case 'GBP':
      currencySymbol = '£';
      break;
    case 'AUD':
      currencySymbol = 'A$';
      break;
    case 'IDR':
      currencySymbol = 'Rp';
      break;
    case 'INR':
      currencySymbol = '₹';
      break;
    case 'PKR':
      currencySymbol = '₨';
      break;
    case 'AFN':
      currencySymbol = '؋';
      break;
    case 'BDT':
      currencySymbol = '৳';
      break;
    case 'SAR':
      currencySymbol = '﷼';
      break;
    case 'AED':
      currencySymbol = 'د.إ';
      break;
    case 'TRY':
      currencySymbol = '₺';
      break;
    case 'EGP':
      currencySymbol = '£';
      break;
    case 'MYR':
      currencySymbol = 'RM';
      break;
    case 'QAR':
      currencySymbol = '﷼';
      break;
    case 'KWD':
      currencySymbol = 'د.ك';
      break;
    case 'OMR':
      currencySymbol = '﷼';
      break;
    case 'BHD':
      currencySymbol = 'ب.د';
      break;
    default:
      currencySymbol = '$'; // Default to USD
  }

  calculateZakat(); // Recalculate Zakat based on the new currency
  displayDonations(); // Update displayed donations with the new currency symbol
}

// Calculate Zakat based on user inputs
function calculateZakat() {
  const cash = parseFloat(document.getElementById('cashSavings').value) || 0;
  const gold = parseFloat(document.getElementById('goldSilver').value) || 0;
  const investments = parseFloat(document.getElementById('investments').value) || 0;
  const otherWealth = parseFloat(document.getElementById('otherWealth').value) || 0;

  const totalWealth = cash + gold + investments + otherWealth;
  const zakat = (totalWealth >= 85 * 4.25) ? totalWealth * 0.025 : 0;

  document.getElementById('zakatResult').innerText = `Your Zakat payable is ${currencySymbol}${zakat.toFixed(2)}.`;
}

// Add a new donation to the charity tracker
function addDonation() {
  const amount = parseFloat(document.getElementById('donationAmount').value) || 0;
  const type = document.getElementById('donationType').value;
  const donation = {
    amount,
    type,
    date: new Date().toLocaleDateString(),
    currency: selectedCurrency
  };
  
  donations.push(donation);
  localStorage.setItem('donations', JSON.stringify(donations));
  
  displayDonations();
  updateChart();
}

// Clear all donations
function clearDonations() {
  donations = [];
  localStorage.removeItem('donations');
  displayDonations();
  updateChart();
}

// Display the list of donations
function displayDonations() {
  const history = document.getElementById('donationHistory');
  history.innerHTML = '';

  donations.forEach(donation => {
    const li = document.createElement('li');
    li.textContent = `${donation.date} - ${currencySymbol}${donation.amount.toFixed(2)} (${donation.type})`;
    history.appendChild(li);
  });
}

// Update the charity progress chart
function updateChart() {
  const ctx = document.getElementById('charityChart').getContext('2d');
  const zakatAmount = donations.filter(d => d.type === 'Zakat').reduce((sum, d) => sum + d.amount, 0);
  const sadaqahAmount = donations.filter(d => d.type === 'Sadaqah').reduce((sum, d) => sum + d.amount, 0);
  const otherAmount = donations.filter(d => d.type === 'Other').reduce((sum, d) => sum + d.amount, 0);

  if (window.donationChart) {
    window.donationChart.destroy(); // Destroy the old chart before creating a new one
  }

  window.donationChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Zakat', 'Sadaqah', 'Other'],
      datasets: [{
        label: 'Charity Donations',
        data: [zakatAmount, sadaqahAmount, otherAmount],
        backgroundColor: ['#66bb6a', '#29b6f6', '#ff7043'],
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              return `${tooltipItem.label}: ${currencySymbol}${tooltipItem.raw.toFixed(2)}`;
            }
          }
        }
      }
    }
  });
}

// Load a random Sadaqah tip
function loadSadaqahTip() {
  const tips = [
    "Be kind to your neighbors. Helping them is an act of charity.",
    "A smile to your brother is Sadaqah.",
    "Feeding the poor is one of the most beloved deeds to Allah.",
    "Donate regularly, even if it's a small amount.",
    "Help a person in need, whether financially or by giving your time."
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  document.getElementById('charityTip').innerText = randomTip;
}

// Initialize the app by loading stored data and setting default values
function initializeApp() {
  updateCurrency();
  displayDonations();
  updateChart();
  loadSadaqahTip();
}

// Run the app when the page loads
window.onload = initializeApp;
