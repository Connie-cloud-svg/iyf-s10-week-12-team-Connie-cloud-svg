const Button = ({
  label,
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  className = '',
  icon = null,
  iconPosition = 'left',
  ...props
}) => {
  const sizeClass = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
    icon: 'btn-icon',
  }[size] || '';

  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
    outlineYellow: 'btn-outline-yellow',
  }[variant] || 'btn-primary';

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="btn-icon-left">{icon}</span>}
      {label || children}
      {icon && iconPosition === 'right' && <span className="btn-icon-right">{icon}</span>}
    </button>
  );
};

export default Button;