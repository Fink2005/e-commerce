import { Truck } from 'lucide-react';
import Image from 'next/image';
import SectionBadge from './SectionBadge';

const FeatureBrowser = () => {
  return (
    <div>
      <SectionBadge name="Featured" />
      <h2 className="text-lg font-bold text-gray-900 mt-1">New Arrival</h2>
      <Image
        src="https://i.pinimg.com/736x/f2/3a/38/f23a38384fb8ba462c37e87281bffbd0.jpg"
        alt="Featured Product"
        width={500}
        height={300}
        className="w-full h-auto rounded-lg shadow-md mt-2"
      />
      <div className="flex flex-col items-center justify-center bg-white p-6">
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
              <Truck className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
          FREE AND FAST DELIVERY
        </h2>

        <p className="text-sm text-gray-600 text-center">
          Free delivery for all orders over $140
        </p>
      </div>
      <Image
        src="https://shopflix.co.tz/public/uploads/all/WdQAdls0De2TefCYY3vLZWTaJH9Jm7LMDhEbPkTl.jpg"
        alt="Featured Product"
        width={500}
        height={300}
        className="w-full h-auto rounded-lg shadow-md mt-2"
      />
    </div>
  );
};

export default FeatureBrowser;
