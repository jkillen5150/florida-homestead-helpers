// The magic brain! 🧠
let allHelpers = [];

const trades = ["All", "Landscaping", "Livestock Care", "Mobile Repair", "Irrigation", "Home Improvements"];

async function loadHelpers() {
  try {
    const res = await fetch('data/tradesmen.json');
    allHelpers = await res.json();
    renderFilters();
    renderHelpers(allHelpers);
    initMap();  // Fire up the map once helpers are loaded
  } catch (err) {
    console.error("Couldn't load tradesmen.json:", err);
    document.getElementById('helpersGrid').innerHTML = '<p class="col-span-3 text-center py-12 text-xl text-red-500">Error loading helpers... check the console, boss.</p>';
  }
}

function renderFilters() {
  const container = document.getElementById('filterButtons');
  container.innerHTML = '';

  trades.forEach(trade => {
    const btn = document.createElement('button');
    btn.textContent = trade;
    btn.className = `px-6 py-3 rounded-2xl font-medium transition-all ${trade === 'All' ? 'bg-emerald-700 text-white' : 'bg-white border-2 border-emerald-200 hover:border-emerald-600'}`;
    btn.onclick = () => filterByTrade(trade, btn);
    container.appendChild(btn);
  });
}

function filterByTrade(selectedTrade, clickedBtn) {
  // Highlight the clicked button
  document.querySelectorAll('#filterButtons button').forEach(b => {
    if (b === clickedBtn) {
      b.classList.add('bg-emerald-700', 'text-white');
      b.classList.remove('bg-white', 'border-emerald-200');
    } else {
      b.classList.remove('bg-emerald-700', 'text-white');
      b.classList.add('bg-white', 'border-emerald-200');
    }
  });

  let filtered = allHelpers;
  if (selectedTrade !== 'All') {
    filtered = allHelpers.filter(h => h.trade === selectedTrade);
  }
  renderHelpers(filtered);
}

function renderHelpers(helpers) {
  const container = document.getElementById('helpersGrid');
  container.innerHTML = '';

  helpers.forEach(helper => {
    const card = document.createElement('div');
    card.className = "bg-white border-2 border-emerald-100 rounded-3xl overflow-hidden hover:border-emerald-600 transition-all";
    card.innerHTML = `
      <div class="h-2 bg-emerald-600"></div>
      <div class="p-8">
        <h3 class="text-2xl font-bold mb-1">${helper.name}</h3>
        <p class="text-emerald-600 font-semibold mb-4">${helper.trade} • ${helper.city}</p>
        <p class="text-stone-600 mb-6 leading-relaxed">${helper.bio}</p>
        <div class="flex justify-between items-center">
          <a href="tel:${helper.contact}" class="text-emerald-700 font-semibold hover:underline">📞 ${helper.contact}</a>
          <span class="text-xs bg-amber-100 text-amber-700 px-4 py-1.5 rounded-2xl">Homestead Values ✅</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  if (helpers.length === 0) {
    container.innerHTML = `<p class="col-span-3 text-center py-12 text-xl text-stone-500">No helpers found... try different filters!</p>`;
  }
}

// Florida map – because every good homestead directory needs to know where the gators are
function initMap() {
  const map = L.map('florida-map').setView([28.0, -81.5], 7);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Test markers from our JSON data (lat/lng grabbed from quick lookups)
  // Bob 'Grass Whisperer' Johnson - Ocala
  L.marker([29.1872, -82.1401]).addTo(map)
    .bindPopup("<b>Bob 'Grass Whisperer' Johnson</b><br>Landscaping • Ocala<br>Native plants, food forests, chicken yards.");

  // Maria Rivera - Brooksville
  L.marker([28.5553, -82.3879]).addTo(map)
    .bindPopup("<b>Maria Rivera</b><br>Livestock Care • Brooksville<br>Goats, chickens, mini cows – homestead starter specialist.");

  // Tyler 'Fix-It' McCoy - Tampa
  L.marker([27.9506, -82.4572]).addTo(map)
    .bindPopup("<b>Tyler 'Fix-It' McCoy</b><br>Mobile Repair • Tampa<br>Phone/laptop/small engine – I come to your homestead!");

  // Carlos Mendoza - Orlando (Irrigation)
  L.marker([28.5383, -81.3792]).addTo(map)
    .bindPopup("<b>Carlos Mendoza</b><br>Irrigation • Orlando<br>Smart water systems, rain harvesting, drip lines.");

  // Sarah Thompson - Gainesville (Home Improvements)
  L.marker([29.6516, -82.3248]).addTo(map)
    .bindPopup("<b>Sarah Thompson</b><br>Home Improvements • Gainesville<br>Tiny homes, barns, off-grid solar.");
}

// Live search as you type
document.addEventListener('DOMContentLoaded', () => {
  loadHelpers();

  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    const filtered = allHelpers.filter(h => 
      h.name.toLowerCase().includes(term) || 
      h.city.toLowerCase().includes(term) ||
      h.bio.toLowerCase().includes(term)
    );
    renderHelpers(filtered);
  });
});