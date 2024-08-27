document.addEventListener('DOMContentLoaded', function() {
    const getInfoBtn = document.getElementById('getInfoBtn');

    if (!getInfoBtn) {
        console.error('Button with ID "getInfoBtn" not found.');
        return;
    }

    getInfoBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });

    function success(position) {
        if (position && position.coords) {
            const latitude = position.coords.latitude.toFixed(4);
            const longitude = position.coords.longitude.toFixed(4);

            document.getElementById('coordinates').innerText = `Latitude: ${latitude}, Longitude: ${longitude}`;

            getPostalCodeAndHardinessZone(latitude, longitude);
        } else {
            console.error('Position object is missing coords property.');
        }
    }

    function error() {
        alert('Unable to retrieve your location.');
    }

    async function getPostalCodeAndHardinessZone(lat, lon) {
        const postalCode = await getPostalCode(lat, lon);
        if (postalCode) {
            document.getElementById('postalCode').textContent = `Postal Code: ${postalCode}`;

            const hardinessZone = await getHardinessZone(postalCode);
            if (hardinessZone) {
                document.getElementById('hardinessZone').innerHTML = `📍 Hardiness Zone: <strong>${hardinessZone}</strong>`;
            } else {
                document.getElementById('hardinessZone').textContent = 'Unable to fetch hardiness zone.';
            }
        }
    }

    async function getPostalCode(lat, lon) {
        const apiKey = '9e453a2ef36c47a48e4181219c6a9df2'; // Replace with your actual Geoapify API key
        const geocodeURL = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`;

        try {
            const response = await fetch(geocodeURL);
            const data = await response.json();
            console.log('Geoapify Response:', data); // Debugging line

            if (data.features && data.features.length > 0) {
                return data.features[0].properties.postcode;
            } else {
                return 'Postal code not found';
            }
        } catch (error) {
            console.error('Error fetching the postal code:', error);
            return 'An error occurred while fetching the postal code.';
        }
    }

    async function getHardinessZone(postalCode) {
        const rapidapiUrl = `https://plant-hardiness-zone.p.rapidapi.com/zipcodes/${postalCode}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '1d575289cfmshd3faddc13cf79cbp1dfacejsn8f338e119e0c', // Replace with your actual RapidAPI key
                'x-rapidapi-host': 'plant-hardiness-zone.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(rapidapiUrl, options);
            const data = await response.json();
            console.log('RapidAPI Response:', data); // Debugging line

            return data.hardiness_zone;
        } catch (error) {
            console.error('Error fetching hardiness zone:', error);
            return 'Unable to fetch hardiness zone.';
        }
    }
});
