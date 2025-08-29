import { Trash } from "lucide-react";
import "../../../app/App.css";

export const RadiusZonesForm = ({ zones = [], setZones }) => {
  const handleChange = (index, field, value) => {
    const updatedZones = [...zones];
    updatedZones[index][field] = value;
    setZones(updatedZones);
  };

  const handleAddZone = () => {
    setZones([...zones, { radius: 0, price: 0 }]);
  };

  const handleRemoveZone = (index) => {
    const updatedZones = zones.filter((_, i) => i !== index);
    setZones(updatedZones);
  };

  return (
    <div className="radius-price-form">
      <div className="field-label">Настройка зон доставки</div>

      {zones.map((zone, index) => (
        <div key={index} className="zone">
          <input
            className="text-field"
            type="number"
            placeholder="Радиус (метр)"
            value={zone.radius}
            onChange={(e) => handleChange(index, "radius", e.target.value)}
          />
          <input
            className="text-field"
            type="number"
            placeholder="Стоимость (сом)"
            value={zone.price}
            onChange={(e) => handleChange(index, "price", e.target.value)}
          />
          <button
            className="remove-zone-button"
            onClick={() => handleRemoveZone(index)}
          >
            <Trash />
          </button>
        </div>
      ))}

      <button className="secondary-button" onClick={handleAddZone}>
        Добавить зону
      </button>
    </div>
  );
};
