// Centro aproximado de Laguna/SC
const lagunaCoords = [-28.4833, -48.7835];

// Inicializar mapa
const map = L.map('map').setView(lagunaCoords, 14);

// API Key do Stadia Maps
const apiKey = '502a8610-7b80-4b15-93a8-6f0ef2b8e539';

// Camada base escura
const osmLayer = L.tileLayer(
    `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${apiKey}`,
    {
        maxZoom: 19,
        attribution: '© OpenMapTiles © OpenStreetMap contributors'
    }
).addTo(map);

// ---------- BAIRROS (CÍRCULOS COM CORES) ----------

const bairros = [
    {
        name: 'Centro',
        color: '#22c55e',
        coords: [-28.4828401, -48.7819155],
        raio: 200
    },
    {
        name: 'Portinho',
        color: '#3b82f6',
        coords: [-28.4590431, -48.7947914],
        raio: 200
    },
    {
        name: 'Cabeçuda',
        color: '#a855f7',
        coords: [-28.4433443, -48.8168984],
        raio: 200
    },
    {
        name: 'Mar Grosso',
        color: '#eab308',
        coords: [-28.4851592, -48.7691257],
        raio: 200
    }
];

// Desenhar bairros no mapa (como círculos)
bairros.forEach(bairro => {
    L.circle(bairro.coords, {
        radius: bairro.raio,
        color: bairro.color,
        weight: 2,
        opacity: 0.8,
        fillColor: bairro.color,
        fillOpacity: 0.25
    })
        .bindPopup(`<strong>Bairro: ${bairro.name}</strong>`)
        .addTo(map);
});

// ---------- ROTAS PRINCIPAIS ----------

const routes = [
    {
        name: 'Av. Calistrato Muller Salles',
        type: 'main',
        coords: [
            [-28.4628352,-48.7860931],
            [-28.4754427, -48.7836189]
        ],
        description: 'Avenida principal conectando diferentes regiões'
    },
    {
        name: 'Av. João Marronzinho',
        type: 'main',
        coords: [
            [-28.4622781, -48.7855986],
            [-28.4653019, -48.7678452]
        ],
        description: 'Via de conexão urbana'
    },
    {
        name: 'Av. João Pinho',
        type: 'main',
        coords: [
            [-28.4952613, -48.7736066],
            [-28.4849439, -48.7689722]
        ],
        description: 'Avenida de acesso às praias'
    }
];

// ---------- ROTA DE LUZ ANIMADA ----------

let animatedRoute = null;

function createAnimatedLightRoute(coords) {
    if (animatedRoute) {
        map.removeLayer(animatedRoute);
        clearInterval(animatedRoute._anim);
        animatedRoute = null;
    }

    const line = L.polyline(coords, {
        color: '#f9fafb',
        weight: 5,
        opacity: 0.95,
        dashArray: '12 24',
        className: 'light-route'
    }).addTo(map);

    let offset = 0;
    const speed = 3;

    const anim = setInterval(() => {
        offset = (offset + speed) % 1000;
        const path = line._path;
        if (path) {
            path.style.strokeDashoffset = offset;
        }
    }, 30);

    line._anim = anim;
    animatedRoute = line;

    return line;
}

// ---------- DESENHAR ROTAS BASE ----------

routes.forEach(route => {
    const baseColor = route.type === 'main' ? '#22d3ee' : '#6366f1';
    const weight = route.type === 'main' ? 4 : 3;

    const baseLine = L.polyline(route.coords, {
        color: baseColor,
        weight,
        opacity: 0.5,
        className: 'route-base'
    }).addTo(map);

    baseLine.routeData = route;

    baseLine.on('click', () => {
        const light = createAnimatedLightRoute(route.coords);
        map.fitBounds(light.getBounds(), { padding: [40, 40] });
        light
            .bindPopup(
                `<strong>Rota: ${route.name}</strong><br>${route.description}`
            )
            .openPopup();
    });
});

// ---------- PONTOS DE INTERESSE ----------

const pois = [
    {
        name: 'Mercado Público',
        type: 'service',
        coords: [-28.4833035, -48.7834667],
        description: 'Centro comercial tradicional de Laguna',
        liveUrl: 'https://www.youtube.com/embed/b7yAIWP_s0c?autoplay=1&mute=1'
    },
    {
        name: 'Museu de Anita Garibaldi',
        type: 'landmark',
        coords: [-28.4814632, -48.7835862],
        description: 'Praça histórica com acervo de Anita Garibaldi',
        liveUrl: 'https://www.youtube.com/embed/rdAAp-PF35M?autoplay=1&mute=1'
    },
    {
        name: 'UDESC',
        type: 'service',
        coords: [-28.4773808, -48.7851998],
        description: 'Universidade Estadual de Santa Catarina'
    },
    {
        name: 'Komprao',
        type: 'service',
        coords: [-28.4679317, -48.7849871],
        description: 'Centro comercial'
    },
    {
        name: 'Destak',
        type: 'service',
        coords: [-28.4849439, -48.7689722],
        description: 'Lojas e comércio'
    },
    {
        name: 'Mirante Morro da Glória',
        type: 'landmark',
        coords: [-28.4884323, -48.7783975],
        description: 'Ponto de vista panorâmico da cidade'
    }
];

// ---------- DESENHAR POIs ----------

const markers = [];
pois.forEach(poi => {
    let content = `<strong>${poi.name}</strong><br><small>${poi.description}</small>`;

    if (poi.liveUrl) {
        content += `
      <div style="margin-top:8px; width:260px; max-width:100%;">
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;">
          <iframe 
            src="${poi.liveUrl}"
            style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    `;
    }

    const marker = L.circleMarker(poi.coords, {
        radius: 7,
        fillColor: '#ec4899',
        color: '#f97316',
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.9
    }).bindPopup(content);

    marker.data = poi;
    markers.push(marker);
    marker.addTo(map);
});

// ---------- FILTROS ----------

const filterPills = document.querySelectorAll('.filter-pill');
filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.dataset.filter;
        updatePOIList(filter);
        updateMarkers(filter);
    });
});

function updatePOIList(filter) {
    const poiList = document.getElementById('poiList');
    poiList.innerHTML = '';

    let filtered = pois;
    if (filter !== 'all') {
        filtered = pois.filter(p => p.type === filter);
    }

    filtered.forEach(poi => {
        const item = document.createElement('div');
        item.className = 'poi-item';
        item.innerHTML = `
      <div class="poi-name">${poi.name}</div>
      <div class="poi-type">${poi.description}</div>
      <div class="poi-distance">📍 ${(Math.random() * 3 + 0.5).toFixed(1)} km</div>
    `;

        item.addEventListener('click', () => {
            map.flyTo(poi.coords, 15);
            markers.find(m => m.data === poi)?.openPopup();
        });

        poiList.appendChild(item);
    });
}

function updateMarkers(filter) {
    markers.forEach(marker => {
        if (filter === 'all' || marker.data.type === filter) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
}

// ---------- BUSCAS ----------

document.getElementById('searchInput').addEventListener('input', e => {
    const query = e.target.value.toLowerCase();
    const results = pois.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );

    const poiList = document.getElementById('poiList');
    poiList.innerHTML = '';

    results.forEach(poi => {
        const item = document.createElement('div');
        item.className = 'poi-item';
        item.innerHTML = `
      <div class="poi-name">${poi.name}</div>
      <div class="poi-type">${poi.description}</div>
      <div class="poi-distance">📍 ${(Math.random() * 3 + 0.5).toFixed(1)} km</div>
    `;
        item.addEventListener('click', () => {
            map.flyTo(poi.coords, 15);
            markers.find(m => m.data === poi)?.openPopup();
        });
        poiList.appendChild(item);
    });
});

document.getElementById('bottomSearch').addEventListener('input', e => {
    document.getElementById('searchInput').value = e.target.value;
    const event = new Event('input');
    document.getElementById('searchInput').dispatchEvent(event);
});

// Inicializar lista
updatePOIList('all');

// Log coordenadas ao clicar no mapa
map.on('click', e => {
    console.log('Coordenadas:', e.latlng);
});
