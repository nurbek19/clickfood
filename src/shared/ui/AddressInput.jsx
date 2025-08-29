import { useEffect, useState, useRef } from "react";
import distance from "@turf/distance";
// import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import "./../../app/App.css";
import { MapPin, X } from "lucide-react";

function isInRadius(centerCoords, radiusMeters, targetCoords) {
  const from = point(centerCoords);
  const to = point(targetCoords);

  const dist = distance(from, to, { units: "meters" }); // можно указать "kilometers", "miles" и т.д.

  console.log(dist);

  return dist <= radiusMeters;
}

// function isInPolygon(pointCoords, polygons) {
//     return polygons.find(zone => {
//         const poly = polygon(zone.geometry.coordinates);
//         return booleanPointInPolygon(point(pointCoords), poly);
//     });
// }

export function checkDeliveryZones(userCoords, deliveryZones, center) {
  const inRadius = deliveryZones.find((zone) =>
    isInRadius(center, zone.radius, userCoords)
  );
  if (inRadius) return { inZone: true, price: inRadius.price };

  // const inPolygon = isInPolygon(userCoords, deliveryZones.polygons);
  // if (inPolygon) return { inZone: true, price: inPolygon.price };

  return { inZone: false };
}

const API_KEY = "8b1c812a-28bf-4bf7-97d1-dffeef300b9b";

export const AddressInput = ({ address, setAddress }) => {
  const [query, setQuery] = useState("");
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
      setQuery(address.address_name || address.full_name);
    }
  }, [address]);

  const fetchSuggestions = async (text) => {
    if (!text) return;
    try {
      const res = await fetch(
        `https://catalog.api.2gis.com/3.0/suggests?q=${encodeURIComponent(
          text
        )}&region_id=112&suggest_type=address&type=building,street&fields=items.point,items.city_alias,items.adm_div&key=${API_KEY}`
      );
      const data = await res.json();
      setSuggestions(
        data.result?.items.filter((item) => item.city_alias === "bishkek") || []
      );
    } catch (err) {
      console.error("Ошибка при получении подсказок:", err);
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
    });
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
          <button
            className="clear-button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setAddress(null);
            }}
          >
            <X />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((s) => (
            <li key={s.id} onClick={() => handleSelect(s)}>
              <MapPin />
              {s.full_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

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
