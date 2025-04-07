export function Button({ children, onClick, variant = "default", className = "" }) {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all";
    
    const variants = {
      default: "bg-blue-500 text-white hover:bg-blue-600",
      outline: "border border-blue-500 text-blue-500 hover:bg-blue-100",
      danger: "bg-red-500 text-white hover:bg-red-600",
    };
  
    return (
      <button 
        onClick={onClick} 
        className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}
      >
        {children}
      </button>
    );
  }
  