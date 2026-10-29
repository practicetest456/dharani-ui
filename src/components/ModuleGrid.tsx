import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Module } from '../config/modules';

export default function ModuleGrid({ items }: { items: Module[] }) {
  const nav = useNavigate();
  return (
    <div className="grid">
      {items.map((m) => (
        <button key={m.title} className="card" style={{ '--c': m.color } as CSSProperties}
          disabled={!m.to} onClick={() => m.to && nav(m.to)}>
          <span className="ic" aria-hidden="true">{m.icon}</span>
          <span><b>{m.title}</b><small>{m.desc}</small></span>
          {m.soon && <span className="uc">Under construction</span>}
        </button>
      ))}
    </div>
  );
}
