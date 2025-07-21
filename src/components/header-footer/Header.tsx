import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';

const Header = () => {
  return (
    <header
      className=" bg-white border-b border-gray-300 px-3 py-1 flex items-center justify-end gap-3 fixed top-0 w-[450px] z-10"
    >
      <Button
        variant="ghost"
        size="icon"
        className="hover:text-red-500 transition-colors duration-200 cursor-pointer"
        aria-label="Favorites"
      >
        <Heart className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="hover:text-blue-500 transition-colors duration-200 cursor-pointer"
        aria-label="Shopping cart"
      >
        <ShoppingCart className="w-5 h-5" />
      </Button>
    </header>
  );
};

export default Header;
