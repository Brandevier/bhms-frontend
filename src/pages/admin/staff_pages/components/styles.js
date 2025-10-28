// Add this to your main CSS or inject it
export const customStyles = `
  .staff-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }
  
  .stat-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
  }
  
  .stat-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.innerHTML = customStyles;
document.head.appendChild(styleElement);