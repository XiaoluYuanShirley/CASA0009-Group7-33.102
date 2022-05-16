
const getById = (id) => {
    return document.getElementById(id);
}

const fetchCrimeType = () => {
    let crimeTypes = [];
    for (const ct of crimeData) {
        const crimeType = ct['Crime type'];
        if (crimeTypes.indexOf(crimeType) < 0) {
            crimeTypes.push(crimeType);
        }
    }
    return crimeTypes;
};

const fetchMonthByCrimeType = async (crimeType) => {
    let monthes = [];
    const filterData = crimeData.filter(el => el['Crime type'] === crimeType);
    for (const fd of filterData) {
        const month = fd['Month'];
        if (monthes.indexOf(month) < 0) {
            monthes.push(month);
        }
    }
    return monthes;
}

const fetchData = async (crime, month) => {
    return crimeData.filter(el => el['Crime type'] === crime && el['Month'] === month);
};

const clearMarkers = async () => {
    if (showingMarkers && showingMarkers.length > 0) {
        for (let i = 0; i < showingMarkers.length; ++i) {
            showingMarkers[i].remove();
        }
    }
};

const bindCrimeTypeData = () => {
    const crimeTypes = fetchCrimeType();
    const crimeTypeDom = getById('crime-type-selector');
    const monthSelectorDom = getById('month-selector');
    if (crimeTypes && crimeTypes.length > 0) {
        for (const ct of crimeTypes) {
            crimeTypeDom.options.add(new Option(ct, ct));
        }
    }

    crimeTypeDom.addEventListener("change", async (e) => {
        const monthes = await fetchMonthByCrimeType(e.target.value);
        // console.log(monthes);
        if (monthes && monthes.length > 0) {
            monthSelectorDom.options.length = 1;
            for (const m of monthes) {
                monthSelectorDom.options.add(new Option(m, m));
            }
        }
    });

    monthSelectorDom.addEventListener("change", async (e) => {
        const crime = crimeTypeDom.value;
        const month = e.target.value;
        const results = await fetchData(crime, month);
        // console.log(results);
        // console.log(map);
        if (results && results.length > 0) {
            await clearMarkers();
            for (const marker of results) {
                // console.log(marker);
                let __content = '';
                __content += '<h4>' + marker['Location'] +'</h4>'
                __content += '<p>' + marker['Last outcome category'] +'</p>';
                const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(__content);
                const coordinates = [marker.Longitude, marker.Latitude];
    
                // Add markers to the map.
                const currentMarker = new mapboxgl.Marker()
                                                    .setLngLat(coordinates)
                                                    .setPopup(popup)
                                                    .addTo(map);
                showingMarkers.push(currentMarker);
            }
        }
    });
};

window.onload = async () => {
    bindCrimeTypeData();
};