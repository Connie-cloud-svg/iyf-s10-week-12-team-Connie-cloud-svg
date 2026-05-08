const Card = ({
  title,
  subtitle,
  children,
  footer,
  className = '',
  variant = 'default',
  onClick,
  headerAction = null,
  ...props
}) => {
  const variantClass = {
    default: '',
    elevated: 'card-elevated',
    interactive: 'card-interactive',
    yellowGlow: 'card-yellow-glow',
  }[variant] || '';

  return (
    <div
      className={`card ${variantClass} ${className}`}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      <div className="card-body">
        {children}
      </div>

      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;