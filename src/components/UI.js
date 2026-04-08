import React from 'react';
import { STATUS_COLORS, STATUS_LABELS } from '../constants';

export function Btn({ children, onClick, disabled, variant = 'primary', style = {} }) {
  const base = {
    padding: '12px 24px', borderRadius: 10, fontWeight: 500, fontSize: 15,
    cursor: disabled ? 'not-allowed' : 'pointer', border: 'none',
    transition: 'opacity .15s', opacity: disabled ? 0.5 : 1, ...style,
  };
  const variants = {
    primary:  { ...base, background: '#ff385c', color: '#fff' },
    secondary:{ ...base, background: '#f0f0f0', color: '#222' },
    outline:  { ...base, background: '#fff', color: '#222', border: '1.5px solid #ddd' },
  };
  return (
    <button style={variants[variant] || variants.primary} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function Badge({ status }) {
  return (
    <span style={{
      background: STATUS_COLORS[status] + '22', color: STATUS_COLORS[status],
      padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500,
    }}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export function PlatformIcon({ p, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 4, background: p.color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: size * 0.32, flexShrink: 0,
    }}>
      {p.icon}
    </div>
  );
}

export function Input({ value, onChange, placeholder, type = 'text', style = {} }) {
  return (
    <input
      value={value} onChange={onChange} placeholder={placeholder} type={type}
      style={{
        width: '100%', padding: '12px 14px', border: '1.5px solid #e0e0e0',
        borderRadius: 10, fontSize: 15, marginBottom: 12, outline: 'none', ...style,
      }}
    />
  );
}

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, border: '1px solid #ebebeb',
      marginBottom: 14, overflow: 'hidden', ...style,
    }}>
      {children}
    </div>
  );
}
