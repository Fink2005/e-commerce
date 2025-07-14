import SectionBadge from '@/components/home/SectionBadge';
import { Button } from '@/components/ui/button';
import { Eye, Heart } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const ProductList = () => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-xl ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
		<div className="mt-4">
			<SectionBadge name="Our Products" />
      <h2 className="text-lg font-bold text-gray-900 mt-1 mb-3">Explore Our Products</h2>
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
						<Card className="overflow-hidden transition-shadow duration-200 h-fit max-w-sm mx-auto pb-4 pt-0">
						{/* Product Image Section */}
						<div className="relative bg-gray-50">
							<div className="absolute top-4 right-4 flex flex-col gap-2">
								<Button
									variant="ghost"
									size="icon"
									className="h-10 w-10 rounded-full bg-white hover:bg-gray-100 shadow-sm"
								>
									<Heart className="h-5 w-5 text-gray-600" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="h-10 w-10 rounded-full bg-white hover:bg-gray-100 shadow-sm"
								>
									<Eye className="h-5 w-5 text-gray-600" />
								</Button>
							</div>
							<div className="px-10">
								<img
									src={product.image}
									alt={product.name}
									className="max-w-auto h-36 m-auto object-contain"
								/>
							</div>
						</div>

						{/* Product Info Section */}
						<CardContent className="px-2">
							<Button className="w-full bg-black text-white hover:bg-gray-800 mb-4">
								Add To Cart
							</Button>
							<h3 className="text-md text-gray-900">{product.name}</h3>
							<div className="flex items-center gap-2 mb-1">
								<div className="flex">{renderStars(product.rating)}</div>
								<span className="text-gray-500 text-lg">({product.reviewCount})</span>
							</div>
							<div className="text-xl text-red-500">${product.price}</div>
						</CardContent>
						</Card>
          ))}
        </div>
      </div>
    
  );
};

const products = [
  {
    id: 1,
    name: 'CANON EOS DSLR Camera',
    image: '/product.png',
    rating: 4,
    reviewCount: 95,
    price: 360,
  },
  {
    id: 2,
    name: 'CANON EOS DSLR Camera',
    image: '/product.png',
    rating: 4,
    reviewCount: 95,
    price: 360,
  },
  {
    id: 3,
    name: 'CANON EOS DSLR Camera',
    image: '/product.png',
    rating: 4,
    reviewCount: 95,
    price: 360,
  },
  {
    id: 4,
    name: 'CANON EOS DSLR Camera',
    image: '/product.png',
    rating: 4,
    reviewCount: 95,
    price: 360,
  },
];
export default ProductList
