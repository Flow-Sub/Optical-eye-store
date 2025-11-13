import { Eye } from 'lucide-react';

interface VTOButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * VTO Button Component - Presentational component for the Try On button
 */
export function VTOButton({ onClick, disabled = false, className = '' }: VTOButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-lg transition-all hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl ${className}`}
      aria-label="Try on virtually"
    >
      <Eye className="h-6 w-6" />
      <span>Try On Now</span>
    </button>
  );
}


