interface Props {
  name: string;
  quantity: number;
  max: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function QuantityStepper({ name, quantity, max, onIncrement, onDecrement }: Props) {
  return (
    <div className="stepper" role="group" aria-label={`Quantidade de ${name}`}>
      <button type="button" onClick={onDecrement} aria-label={`Diminuir ${name}`}>−</button>
      <span aria-live="polite">{quantity}</span>
      <button type="button" onClick={onIncrement} disabled={quantity >= max} aria-label={`Aumentar ${name}`}>+</button>
    </div>
  );
}
