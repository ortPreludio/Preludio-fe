import { useState } from 'react';
import './PasswordInput.css';

export function PasswordInput({
    value,
    onChange,
    required = false,
    minLength = 8,
    autoComplete = "current-password",
    ariaInvalid,
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="password-input-wrapper">
            <input
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                required={required}
                minLength={minLength}
                autoComplete={autoComplete}
                className="password-input-field"
                aria-invalid={ariaInvalid}
                {...props}
            />
            <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
                <span className="password-toggle-icon">
                    {showPassword ? '🙈' : '👁️'}
                </span>
                <span className="password-toggle-text">
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                </span>
            </button>
        </div>
    );
}
