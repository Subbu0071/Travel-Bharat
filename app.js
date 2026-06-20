const seedDestinations = [
  {
    id: "taj-mahal",
    name: "Taj Mahal",
    state: "Uttar Pradesh",
    city: "Agra",
    category: "Heritage",
    description:
      "A UNESCO World Heritage monument and one of India's most recognized landmarks, the Taj Mahal is celebrated for Mughal architecture, marble craftsmanship, and its historical association with Shah Jahan and Mumtaz Mahal.",
    bestTime: "October to March",
    fees: "Open sunrise to sunset, closed Fridays; entry fee varies by visitor category.",
    map: "https://www.google.com/maps/search/?api=1&query=Taj+Mahal+Agra",
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=82",
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=82"
    ],
    nearby: ["Agra Fort", "Mehtab Bagh", "Fatehpur Sikri"]
  },
  {
    id: "jaipur-city-palace",
    name: "City Palace",
    state: "Rajasthan",
    city: "Jaipur",
    category: "Heritage",
    description:
      "The City Palace complex reflects Jaipur's royal history through courtyards, museums, gateways, and Rajput-Mughal design traditions in the heart of the Pink City.",
    bestTime: "November to February",
    fees: "Open daily during daytime hours; museum tickets available on site.",
    map: "https://www.google.com/maps/search/?api=1&query=City+Palace+Jaipur",
    images: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=82",
      "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=1200&q=82"
    ],
    nearby: ["Hawa Mahal", "Jantar Mantar", "Nahargarh Fort"]
  },
  {
    id: "munnar-tea-gardens",
    name: "Munnar Tea Gardens",
    state: "Kerala",
    city: "Munnar",
    category: "Nature",
    description:
      "Munnar's rolling tea estates, misty hills, and biodiversity-rich valleys make it a major nature destination in the Western Ghats.",
    bestTime: "September to March",
    fees: "Open access varies by estate; museums and viewpoints may charge separately.",
    map: "https://www.google.com/maps/search/?api=1&query=Munnar+Tea+Gardens",
    images: [
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=82",
      "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=1200&q=82"
    ],
    nearby: ["Eravikulam National Park", "Mattupetty Dam", "Top Station"]
  },
  {
    id: "varanasi-ghats",
    name: "Varanasi Ghats",
    state: "Uttar Pradesh",
    city: "Varanasi",
    category: "Religious",
    description:
      "The ghats of Varanasi form a living spiritual and cultural landscape along the Ganga, known for rituals, heritage walks, temples, and evening aarti ceremonies.",
    bestTime: "October to March",
    fees: "Open public riverfront; boat rides and guided walks are paid services.",
    map: "https://www.google.com/maps/search/?api=1&query=Varanasi+Ghats",
    images: [
      "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1200&q=82",
      "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=82"
    ],
    nearby: ["Kashi Vishwanath Temple", "Sarnath", "Ramnagar Fort"]
  },
  {
    id: "rishikesh-rafting",
    name: "Rishikesh River Rafting",
    state: "Uttarakhand",
    city: "Rishikesh",
    category: "Adventure",
    description:
      "Rishikesh is a major adventure and wellness hub, known for Ganga rafting stretches, yoga centers, suspension bridges, and Himalayan foothill scenery.",
    bestTime: "September to June, depending on river conditions",
    fees: "Activity prices vary by operator; rafting depends on seasonal safety permissions.",
    map: "https://www.google.com/maps/search/?api=1&query=Rishikesh+River+Rafting",
    images: [
      "https://images.unsplash.com/photo-1626621331169-5f34be280ed9?auto=format&fit=crop&w=1200&q=82",
      "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=82"
    ],
    nearby: ["Laxman Jhula", "Triveni Ghat", "Neer Garh Waterfall"]
  },
  {
    id: "kaziranga",
    name: "Kaziranga National Park",
    state: "Assam",
    city: "Golaghat",
    category: "Nature",
    description:
      "Kaziranga is a UNESCO-listed wildlife landscape known for floodplain grasslands, wetlands, and conservation of the one-horned rhinoceros.",
    bestTime: "November to April",
    fees: "Safari permits, guide charges, and entry fees apply; park access is seasonal.",
    map: "https://www.google.com/maps/search/?api=1&query=Kaziranga+National+Park",
    images: [
      "https://images.unsplash.com/photo-1528277342758-f1d7613953a2?auto=format&fit=crop&w=1200&q=82",
      "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=82"
    ],
    nearby: ["Orchid Park", "Kakochang Waterfall", "Majuli"]
  }
];

const categories = ["All categories", "Heritage", "Nature", "Adventure", "Religious"];
const storageKey = "travelbharat-destinations";
let destinations = loadDestinations();

const els = {
  search: document.querySelector("#searchInput"),
  state: document.querySelector("#stateFilter"),
  city: document.querySelector("#cityFilter"),
  category: document.querySelector("#categoryFilter"),
  grid: document.querySelector("#destinationGrid"),
  states: document.querySelector("#stateGrid"),
  resultSummary: document.querySelector("#resultSummary"),
  reset: document.querySelector("#resetFilters"),
  form: document.querySelector("#destinationForm"),
  adminStatus: document.querySelector("#adminStatus"),
  clearLocalData: document.querySelector("#clearLocalData"),
  detail: document.querySelector("#placeDetail")
};

function loadDestinations() {
  const stored = localStorage.getItem(storageKey);
  if (!stored) return seedDestinations;

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : seedDestinations;
  } catch {
    return seedDestinations;
  }
}

function saveDestinations() {
  localStorage.setItem(storageKey, JSON.stringify(destinations));
}

function uniqueValues(key) {
  return [...new Set(destinations.map((item) => item[key]))].sort((a, b) => a.localeCompare(b));
}

function fillSelect(select, values, defaultLabel) {
  select.innerHTML = "";
  [defaultLabel, ...values].forEach((value) => {
    const option = document.createElement("option");
    option.value = value === defaultLabel ? "" : value;
    option.textContent = value;
    select.append(option);
  });
}

function initializeFilters() {
  fillSelect(els.state, uniqueValues("state"), "All states and UTs");
  fillSelect(els.city, uniqueValues("city"), "All cities");
  fillSelect(els.category, categories.slice(1), categories[0]);
}

function getFilteredDestinations() {
  const term = els.search.value.trim().toLowerCase();
  return destinations.filter((place) => {
    const haystack = [place.name, place.state, place.city, place.category, place.description].join(" ").toLowerCase();
    return (
      (!term || haystack.includes(term)) &&
      (!els.state.value || place.state === els.state.value) &&
      (!els.city.value || place.city === els.city.value) &&
      (!els.category.value || place.category === els.category.value)
    );
  });
}

function renderDestinations() {
  const filtered = getFilteredDestinations();
  els.grid.innerHTML = "";
  els.resultSummary.textContent = `${filtered.length} destination${filtered.length === 1 ? "" : "s"} found`;

  filtered.forEach((place) => {
    const card = document.createElement("article");
    card.className = "destination-card";
    card.innerHTML = `
      <img src="${place.images[0]}" alt="${place.name}" loading="lazy">
      <div class="card-body">
        <span class="tag">${place.category}</span>
        <h3>${place.name}</h3>
        <div class="card-meta">
          <span>${place.city}</span>
          <span>${place.state}</span>
        </div>
        <p>${place.description}</p>
        <button class="button compact" type="button" data-detail="${place.id}">View details</button>
      </div>
    `;
    els.grid.append(card);
  });

  if (!filtered.length) {
    els.grid.innerHTML = `<article class="state-card"><h3>No destinations found</h3><p>Try a broader search or add a new destination from the admin panel.</p></article>`;
  }
}

function renderStates() {
  const grouped = destinations.reduce((acc, place) => {
    acc[place.state] ||= { count: 0, cities: new Set(), categories: new Set() };
    acc[place.state].count += 1;
    acc[place.state].cities.add(place.city);
    acc[place.state].categories.add(place.category);
    return acc;
  }, {});

  els.states.innerHTML = "";
  Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([state, data]) => {
      const card = document.createElement("button");
      card.className = "state-card";
      card.type = "button";
      card.innerHTML = `
        <h3>${state}</h3>
        <p><strong>${data.count}</strong> destinations across ${data.cities.size} city/cities.</p>
        <p>${[...data.categories].join(", ")}</p>
      `;
      card.addEventListener("click", () => {
        els.state.value = state;
        els.city.value = "";
        els.category.value = "";
        els.search.value = "";
        renderDestinations();
        document.querySelector("#destinations").scrollIntoView({ behavior: "smooth" });
      });
      els.states.append(card);
    });

  document.querySelector("#stateCount").textContent = Object.keys(grouped).length;
  document.querySelector("#destinationCount").textContent = destinations.length;
}

function showDetail(id) {
  const place = destinations.find((item) => item.id === id);
  if (!place) return;

  document.querySelector("#detailCategory").textContent = place.category;
  document.querySelector("#detailName").textContent = place.name;
  document.querySelector("#detailDescription").textContent = place.description;
  document.querySelector("#detailState").textContent = place.state;
  document.querySelector("#detailCity").textContent = place.city;
  document.querySelector("#detailBestTime").textContent = place.bestTime;
  document.querySelector("#detailFees").textContent = place.fees;
  document.querySelector("#detailMap").href = place.map;
  document.querySelector("#detailNearby").innerHTML = place.nearby.map((item) => `<li>${item}</li>`).join("");
  document.querySelector("#detailGallery").innerHTML = place.images
    .map((image) => `<img src="${image}" alt="${place.name} travel view" loading="lazy">`)
    .join("");

  els.detail.hidden = false;
  els.detail.scrollIntoView({ behavior: "smooth", block: "start" });
}

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function addDestination(event) {
  event.preventDefault();
  const formData = new FormData(els.form);
  const name = formData.get("name").trim();
  const place = {
    id: `${slugify(name)}-${Date.now()}`,
    name,
    state: formData.get("state").trim(),
    city: formData.get("city").trim(),
    category: formData.get("category"),
    description: formData.get("description").trim(),
    bestTime: formData.get("bestTime").trim(),
    fees: formData.get("fees").trim(),
    map: formData.get("map").trim(),
    images: [formData.get("image").trim()],
    nearby: formData
      .get("nearby")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  };

  destinations = [place, ...destinations];
  saveDestinations();
  els.form.reset();
  els.adminStatus.textContent = `${place.name} added. Content is stored in this browser for the demo admin workflow.`;
  initializeFilters();
  renderDestinations();
  renderStates();
}

["input", "change"].forEach((eventName) => {
  [els.search, els.state, els.city, els.category].forEach((control) => {
    control.addEventListener(eventName, renderDestinations);
  });
});

els.grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-detail]");
  if (button) showDetail(button.dataset.detail);
});

els.reset.addEventListener("click", () => {
  els.search.value = "";
  els.state.value = "";
  els.city.value = "";
  els.category.value = "";
  renderDestinations();
});

els.form.addEventListener("submit", addDestination);
els.clearLocalData.addEventListener("click", () => {
  localStorage.removeItem(storageKey);
  destinations = seedDestinations;
  els.adminStatus.textContent = "Demo data restored.";
  initializeFilters();
  renderDestinations();
  renderStates();
});

initializeFilters();
renderDestinations();
renderStates();
