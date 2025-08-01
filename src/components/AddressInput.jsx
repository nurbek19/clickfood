import { useEffect, useState, useRef } from "react";
import distance from '@turf/distance';
// import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import '../App.css';

function isInRadius(centerCoords, radiusMeters, targetCoords) {
    const from = point(centerCoords)
    const to = point(targetCoords)

    const dist = distance(from, to, { units: 'meters' }) // можно указать "kilometers", "miles" и т.д.

    return dist <= radiusMeters
}

// function isInPolygon(pointCoords, polygons) {
//     return polygons.find(zone => {
//         const poly = polygon(zone.geometry.coordinates);
//         return booleanPointInPolygon(point(pointCoords), poly);
//     });
// }

// function checkDeliveryZones(userCoords, deliveryZones) {
//     const inRadius = deliveryZones.radiusZones.find(zone =>
//         isInRadius(zone.center, zone.radius, userCoords)
//     );
//     if (inRadius) return { inZone: true, price: inRadius.price };

//     const inPolygon = isInPolygon(userCoords, deliveryZones.polygons);
//     if (inPolygon) return { inZone: true, price: inPolygon.price };

//     return { inZone: false };
// }


const API_KEY = 'f595981b-5f26-4a88-9cc1-b6ffb2f9884d';

export const AddressInput = ({ address, setAddress }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!query.length) {
            setSuggestions([]);
        }
    }, [query]);

    useEffect(() => {
        if (address) {
            setQuery(address.address_name);
        }
    }, [address]);

    const fetchSuggestions = async (text) => {
        if (!text) return;
        try {
            const res = await fetch(
                `https://catalog.api.2gis.com/3.0/suggests?q=${encodeURIComponent(text)}&region_id=112&suggest_type=address&type=building,street&fields=items.point,items.city_alias,items.adm_div&key=${API_KEY}`
            );
            const data = await res.json();
            setSuggestions(data.result?.items.filter((item) => item.city_alias === 'bishkek') || []);
        } catch (err) {
            console.error('Ошибка при получении подсказок:', err);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            fetchSuggestions(value);
        }, 500); // кастомный debounce 500 мс
    };

    const handleSelect = async (item) => {
        setQuery(item.name);
        setAddress({
            city_alias: item?.city_alias,
            full_name: item?.full_name,
            point: item?.point,
            address_name: item?.address_name,
            region_name: item?.adm_div?.[1]?.name,
            city_name: item?.adm_div?.[2]?.name,
        })
    };

    return (
        <div className="address-input">
            <div className="field-wrapper">
                <div className="field-label">Адрес</div>
                <input
                    type="text"
                    className="text-field"
                    value={query}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => {
                        setTimeout(() => {
                            setIsOpen(false);
                        }, 150);
                    }}
                    onChange={handleInputChange}
                />

                {Boolean(query.length) && (
                    <button className="clear-button" onClick={() => {
                        setQuery('');
                        setSuggestions([]);
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
                        </svg>
                    </button>
                )}
            </div>

            {isOpen && suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((s) => (
                        <li key={s.id} onClick={() => handleSelect(s)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 371.9 391.8 514.9 341.6 569.4C329.8 582.2 310.1 582.2 298.3 569.4C248.1 514.9 127.9 371.9 127.9 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z" />
                            </svg>
                            {s.full_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}


// {
//     "radiusZones": [
//       {
//         "center": [42.8746, 74.6122],
//         "radius": 2000,
//         "price": 0
//       },
//       {
//         "center": [42.8746, 74.6122],
//         "radius": 4000,
//         "price": 200
//       },
//       {
//         "center": [42.8746, 74.6122],
//         "radius": 10000,
//         "price": 300
//       }
//     ],
//     "polygons": [
//       {
//         "geometry": { "type": "Polygon", "coordinates": [
//             [
//                 [
//                   74.59852990557695,
//                   42.893238999655864
//                 ],
//                 [
//                   74.58775080915464,
//                   42.8836438553777
//                 ],
//                 [
//                   74.59543138999928,
//                   42.86898815571891
//                 ],
//                 [
//                   74.62194176692086,
//                   42.87025500318151
//                 ],
//                 [
//                   74.62258267914214,
//                   42.888301305784694
//                 ],
//                 [
//                   74.59852990557695,
//                   42.893238999655864
//                 ]
//               ]
//         ] },
//         "price": 300
//       },
//       {
//         "geometry": { "type": "Polygon", "coordinates": [
//             [
//                 [
//                   74.59852990557695,
//                   42.893238999655864
//                 ],
//                 [
//                   74.58775080915464,
//                   42.8836438553777
//                 ],
//                 [
//                   74.59543138999928,
//                   42.86898815571891
//                 ],
//                 [
//                   74.62194176692086,
//                   42.87025500318151
//                 ],
//                 [
//                   74.62258267914214,
//                   42.888301305784694
//                 ],
//                 [
//                   74.59852990557695,
//                   42.893238999655864
//                 ]
//               ]
//         ] },
//         "price": 500
//       }
//     ]
//   }