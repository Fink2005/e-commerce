import type { AnimatingItem } from '@/types/product';
import { ShoppingCart } from 'lucide-react';

interface FlyingCartItemProps {
  item: AnimatingItem;
}

const FlyingCartItem = ({ item }: FlyingCartItemProps) => {
  const cartIcon = document.querySelector('[aria-label="Shopping cart"]');
  const cartRect = cartIcon?.getBoundingClientRect();

  if (!cartRect) {
    return null;
  }

  const targetX = cartRect.left + cartRect.width / 2;
  const targetY = cartRect.top + cartRect.height / 2;

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        'left': item.x,
        'top': item.y,
        'transform': 'translate(-50%, -50%)',
        'animation': `flyToCart 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
        '--target-x': `${targetX - item.x}px`,
        '--target-y': `${targetY - item.y}px`,
      } as React.CSSProperties & { '--target-x': string; '--target-y': string }}
    >
      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
        <ShoppingCart className="w-4 h-4 text-white" />
      </div>

      <style jsx>
        {`
        @keyframes flyToCart {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          70% {
            transform: translate(calc(-50% + var(--target-x)), calc(-50% + var(--target-y))) scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: translate(calc(-50% + var(--target-x)), calc(-50% + var(--target-y))) scale(0.3);
            opacity: 0;
          }
        }
      `}
      </style>
    </div>
  );
};

export default FlyingCartItem;
