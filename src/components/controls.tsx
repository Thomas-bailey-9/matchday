import { useId, type ReactNode } from 'react';

interface Option<T extends string> { value: T; label: string }

/** A row of pill-shaped radio buttons. Arrow keys move between options. */
export function Choice<T extends string>(props: {
  legend: string;
  name: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  wrap?: boolean;
  hint?: string;
}) {
  return (
    <fieldset className="field">
      <legend className="label">{props.legend}</legend>
      {props.hint && <p className="hint">{props.hint}</p>}
      <div className={props.wrap ? 'choice choice-wrap' : 'choice'}>
        {props.options.map((o) => (
          <label key={o.value} className="choice-option">
            <input
              type="radio"
              name={props.name}
              value={o.value}
              checked={props.value === o.value}
              onChange={() => props.onChange(o.value)}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function TextField(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  optional?: boolean;
  type?: 'text' | 'datetime-local' | 'number';
  autoComplete?: string;
  hint?: string;
  inputMode?: 'numeric' | 'text';
  min?: number;
  max?: number;
  children?: ReactNode;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  return (
    <div className="field">
      <label className="label" htmlFor={id}>
        {props.label}
        {props.optional && <span className="optional"> (optional)</span>}
      </label>
      {props.hint && <p className="hint" id={hintId}>{props.hint}</p>}
      <input
        id={id}
        className="input"
        type={props.type ?? 'text'}
        value={props.value}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete ?? 'off'}
        inputMode={props.inputMode}
        min={props.min}
        max={props.max}
        aria-describedby={props.hint ? hintId : undefined}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
}
