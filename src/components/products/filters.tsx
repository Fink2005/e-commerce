'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface FiltersProps {
  deviceTypes: string[];
  selectedDeviceTypes: string[];
  onDeviceTypeChangeAction: (deviceType: string, checked: boolean) => void;
  priceRange: [number, number];
  onPriceRangeChangeAction: (range: [number, number]) => void;
  minRating: number;
  onMinRatingChangeAction: (rating: number) => void;
}

export function Filters({
  deviceTypes,
  selectedDeviceTypes,
  onDeviceTypeChangeAction,
  priceRange,
  onPriceRangeChangeAction,
  minRating,
  onMinRatingChangeAction,
}: FiltersProps) {
  // Handle slider value change and convert to tuple
  const handlePriceRangeChange = (value: number[]) => {
    onPriceRangeChangeAction([
      value[0] !== undefined ? value[0] : 0,
      value[1] !== undefined ? value[1] : 0,
    ]);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Device Types */}
      <div>
        <h3 className="font-semibold mb-3">Device Type</h3>
        <div className="space-y-2">
          {deviceTypes.map(type => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={selectedDeviceTypes.includes(type)}
                onCheckedChange={checked => onDeviceTypeChangeAction(type, checked as boolean)}
              />
              <Label htmlFor={type} className="text-sm font-normal">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            max={2500}
            min={0}
            step={50}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>
              $
              {priceRange[0]}
            </span>
            <span>
              $
              {priceRange[1]}
            </span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-3">Minimum Rating</h3>
        <Select value={minRating.toString()} onValueChange={value => onMinRatingChangeAction(Number(value))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Any Rating</SelectItem>
            <SelectItem value="3">3+ Stars</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="5">5 Stars Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
