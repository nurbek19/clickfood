import { Minus, Plus, Utensils } from "lucide-react";

export const CutleryCounter = ({ count, setCount }) => {
  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <div className="cutlery-count">
      <div className="field-label">Количество приборов</div>

      <div className="cutlery-container">
        <Utensils className="cutlery-svg" />

        <div className="cutlery-buttons">
          <button onClick={decrement}>
            <Minus />
          </button>
          <span>{count}</span>
          <button onClick={increment}>
            <Plus />
          </button>
        </div>
      </div>
    </div>
  );
};
