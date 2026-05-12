const Badge = ({
  children,
  variant = 'yellow',
  className = '',
  ...props
}) => {
  const variantClass = {
    yellow: 'badge-yellow',
    green: 'badge-green',
    red: 'badge-red',
    blue: 'badge-blue',
    outline: 'badge-outline',
  }[variant] || 'badge-yellow';

  return (
    <span className={`badge ${variantClass} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;