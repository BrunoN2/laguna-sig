// ==========================================
// 1. INICIALIZAÇÃO
// ==========================================
const lagunaCoords = [-28.4700, -48.7800];
const map = L.map('map', { zoomControl: false }).setView(lagunaCoords, 13);
L.control.zoom({ position: 'topright' }).addTo(map);

const apiKey = '502a8610-7b80-4b15-93a8-6f0ef2b8e539';
L.tileLayer(`https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${apiKey}`, {
    maxZoom: 19, attribution: '© Stadia Maps'
}).addTo(map);

// ==========================================
// 2. BAIRROS (Incluindo Magalhães e Esperança)
// ==========================================
const regioes = [
    { name: 'Cabeçuda', type: 'polygon', color: '#a855f7', coords: [[-28.4469002, -48.8181153], [-28.4430825, -48.8147667], [-28.4389570, -48.8291326], [-28.4403296, -48.8293277]] },
    { name: 'Mato Alto', type: 'polygon', color: '#06b6d4', coords: [[-28.4491270, -48.8151603], [-28.4442418, -48.8098761], [-28.4497523, -48.8036494], [-28.4530322, -48.8053974]] },
    { name: 'Portinho', type: 'polygon', color: '#3b82f6', coords: [[-28.4625765, -48.7923378], [-28.4596114, -48.7903596], [-28.4544144, -48.7976633], [-28.4575538, -48.8008789]] },
    { name: 'Bairro Esperança', type: 'circle', radius: 350, color: '#ec4899', coords: [-28.4715487, -48.7866861] },
    { name: 'Centro Histórico', type: 'polygon', color: '#22c55e', coords: [[-28.4837694, -48.7849926], [-28.4812911, -48.7794070], [-28.4841276, -48.7784816], [-28.4859703, -48.7828565]] },
    { name: 'Magalhães', type: 'polygon', color: '#f97316', coords: [[-28.4890237, -48.7846844], [-28.4934716, -48.7728296], [-28.4960137, -48.7740044], [-28.4902396, -48.7853488]] },
    { name: 'Mar Grosso', type: 'polygon', color: '#eab308', coords: [[-28.4943984, -48.7622976], [-28.4909434, -48.7753714], [-28.4799455, -48.7723734], [-28.4735566, -48.7678569]] }
];

regioes.forEach(regiao => {
    let layer;
    const style = { color: regiao.color, weight: 2, opacity: 0.8, fillColor: regiao.color, fillOpacity: 0.15, dashArray: '5, 8' };
    if (regiao.type === 'circle') layer = L.circle(regiao.coords, { ...style, radius: regiao.radius });
    else layer = L.polygon(regiao.coords, style);
    layer.bindPopup(`<strong style="color:${regiao.color}">${regiao.name}</strong>`).addTo(map);
});

// ==========================================
// 3. ROTA LUMINOSA (LAGUNA CONNECT)
// ==========================================
const rotaCoords = [
    [-28.4417196,-48.8115997], [-28.4437643,-48.8110453], [-28.4622097,-48.7866441], [-28.4629176,-48.7860623],
    [-28.4754427,-48.7836189], [-28.4776958,-48.7855049], [-28.4787058,-48.7842227], [-28.4792418,-48.7844562],
    [-28.4795161,-48.7842219], [-28.4808052,-48.7851597], [-28.4813697,-48.7851866], [-28.4841474,-48.7827504],
    [-28.4844718,-48.7826445], [-28.4854308,-48.7827536], [-28.4876293,-48.7834441], [-28.4895281,-48.7852404],
    [-28.4901505,-48.7853597], [-28.4904081,-48.7852688], [-28.4927081,-48.7830844], [-28.4928825,-48.7828324],
    [-28.493332,-48.7814424], [-28.493332,-48.7814424], [-28.4960137,-48.7740044], [-28.4954112,-48.7735696],
    [-28.4951797,-48.7735986], [-28.4847716,-48.7688925], [-28.4758733,-48.768997], [-28.4756854,-48.7689811],
    [-28.4750181,-48.7680008], [-28.4748054,-48.7677885], [-28.4722613,-48.7679167], [-28.4707051,-48.7675682],
    [-28.4694718,-48.7666848], [-28.469288,-48.7666241], [-28.4686589,-48.7667961], [-28.4680143,-48.7668061],
    [-28.4672817,-48.7669361], [-28.4651103,-48.7675729], [-28.4650415,-48.76766], [-28.4650325,-48.767797],
    [-28.4651074,-48.7680955], [-28.4651051,-48.7683088], [-28.4618529,-48.7852405], [-28.4620735,-48.7854082],
    [-28.4625191,-48.7861136]
];

L.polyline(rotaCoords, { color: '#22d3ee', weight: 8, opacity: 0.3, className: 'route-glow' }).addTo(map);
const luz = L.polyline(rotaCoords, { color: '#ffffff', weight: 4, opacity: 0.9, dashArray: '20 60', className: 'light-route' }).addTo(map);

let offset = 0;
setInterval(() => {
    offset = (offset - 2) % 1000;
    if (luz._path) luz._path.style.strokeDashoffset = offset;
}, 30);

// ==========================================
// 4. PONTOS DE INTERESSE
// ==========================================
const pois = [
    { name: 'Panificadora Pão do Dia', type: 'service', coords: [-28.4598939, -48.789965], description: 'Padaria tradicional no Portinho.' },
    { name: 'Gelateria Dolce Freddo', type: 'service', coords: [-28.482862, -48.7689043], description: 'Gelatos italianos no Mar Grosso.' },
    { name: 'Sorveteria Gelato (Centro)', type: 'service', coords: [-28.4840245, -48.7814714], description: 'Unidade Centro Histórico.' },
    { name: 'Lider Atacado', type: 'service', coords: [-28.4399548, -48.8131079], description: 'Supermercado atacadista em Cabeçuda.' },
    { name: 'Destak Lanches', type: 'service', coords: [-28.4848608, -48.7689363], description: 'Lanches no Mar Grosso.' },
    { name: 'Marmita Shalom', type: 'service', coords: [-28.464103, -48.7857871], description: 'Refeições caseiras.' },
    { name: 'Barbeiro', type: 'service', coords: [-28.4600326, -48.7907474], description: 'Barbearia e cortes masculinos.' },
    { name: 'Ravena Hotel', type: 'service', coords: [-28.4887271, -48.7656185], description: 'Hospedagem no Mar Grosso.' },

    // Marcos
    { name: 'Mercado Público', type: 'landmark', coords: [-28.4833035, -48.7834667], description: 'Centro comercial histórico.', image: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Mercado_p%C3%BAblico_%281%29.jpg' },
    { name: 'Museu Anita Garibaldi', type: 'landmark', coords: [-28.4814632, -48.7835862], description: 'Museu histórico.', image: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Museu_Anita_Garibaldi%2C_em_Laguna%2C_Santa_Catarina%2C_Brasil.jpg' },
    { name: 'Estátua dos Pelados', type: 'landmark', coords: [-28.4953902, -48.7739623], description: 'Monumento aos Botos.', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Molhes_da_barra_de_Laguna_SC.jpg/640px-Molhes_da_barra_de_Laguna_SC.jpg' },
    { name: 'Pedra do Frade', type: 'landmark', coords: [-28.4232483, -48.7434464], description: 'Monumento megalítico.', image: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Pedra_do_Frade_Laguna.jpg' },
    { name: 'Praça do Vila', type: 'landmark', coords: [-28.4853933, -48.7662399], description: 'Praça de lazer.' },
    { name: 'Saul Ulyssea', type: 'landmark', coords: [-28.4413548, -48.8216315], description: 'Referência em Cabeçuda.' },
    { name: 'Stella Maris', type: 'landmark', coords: [-28.4892529, -48.7849918], description: 'Instituição tradicional.' }
];

const markers = [];
pois.forEach(poi => {
    const color = poi.type === 'landmark' ? '#f97316' : '#ec4899';
    const marker = L.circleMarker(poi.coords, { radius: 6, fillColor: color, color: '#fff', weight: 2, opacity: 1, fillOpacity: 1 });

    let content = `<strong>${poi.name}</strong><br><span style="color:#ccc; font-size:12px">${poi.description}</span>`;
    if(poi.image) content += `<div style="margin-top:5px; border-radius:4px; overflow:hidden"><img src="${poi.image}" style="width:100%; height:100px; object-fit:cover"></div>`;

    marker.bindPopup(content);
    marker.data = poi;
    markers.push(marker);
    marker.addTo(map);
});

// ==========================================
// 5. SISTEMA (UI e Filtros)
// ==========================================
function renderList(filter) {
    const list = document.getElementById('poiList');
    list.innerHTML = '';
    const filtered = filter === 'all' ? pois : pois.filter(p => p.type === filter);

    filtered.forEach(poi => {
        const item = document.createElement('div');
        item.className = 'poi-item';
        item.innerHTML = `<div class="poi-name">${poi.name}</div><div class="poi-desc">${poi.description}</div>`;
        item.onclick = () => {
            map.flyTo(poi.coords, 16);
            const m = markers.find(mark => mark.data === poi);
            if(m) setTimeout(() => m.openPopup(), 1500);
        };
        list.appendChild(item);
    });

    markers.forEach(m => {
        if(filter === 'all' || m.data.type === filter) { if(!map.hasLayer(m)) m.addTo(map); }
        else { if(map.hasLayer(m)) map.removeLayer(m); }
    });
}

document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.onclick = () => {
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        renderList(pill.dataset.filter);
    }
});

document.getElementById('searchInput').oninput = (e) => {
    const val = e.target.value.toLowerCase();
    document.querySelectorAll('.poi-item').forEach(item => {
        item.style.display = item.innerText.toLowerCase().includes(val) ? 'block' : 'none';
    });
};

renderList('all');
window.onresize = () => map.invalidateSize();

// ==========================================
// 6. ALERTA POLICIAL (LOCAL)
// ==========================================
const starIcon = L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Star_icon_stylized.svg/512px-Star_icon_stylized.svg.png',
    iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -20], className: 'star-pulse'
});

let reporting = false;
const btnReport = document.getElementById('btnReport');

btnReport.onclick = () => {
    reporting = !reporting;
    if(reporting) {
        btnReport.innerText = "Cancelar";
        btnReport.style.background = "#475569";
        document.getElementById('map').style.cursor = "crosshair";
        alert("Clique no mapa onde viu a polícia!");
    } else {
        resetReport();
    }
};

map.on('click', (e) => {
    if(!reporting) return;
    const alertMarker = L.marker(e.latlng, { icon: starIcon }).addTo(map);
    alertMarker.bindPopup(`<strong>🚔 Polícia Reportada</strong><br>Expira em 1h`).openPopup();
    setTimeout(() => map.removeLayer(alertMarker), 3600000); // 1 hora
    resetReport();
});

function resetReport() {
    reporting = false;
    btnReport.innerText = "🚨 Reportar Polícia";
    btnReport.style.background = "#dc2626";
    document.getElementById('map').style.cursor = "";
}