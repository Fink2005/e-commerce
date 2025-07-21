"use client"

import ProductList from "@/components/home/ProductList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { products, type Product } from "@/lib/products"; // Import products and Product type from the shared file
import { Heart, Minus, Plus, Star } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function GamepadProductPage() {
  const params = useParams()
  const productId = Number.parseInt(params.id as string)

  const [product, setProduct] = useState<Product | null>(null)
  const [selectedColor, setSelectedColor] = useState("black")
  const [selectedSize, setSelectedSize] = useState("M")
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    // Find the product from the imported 'products' array
    const foundProduct = products.find((p) => p.id === productId)
    setProduct(foundProduct || null)
    if (foundProduct && foundProduct.colors && foundProduct.colors.length > 0) {
      setSelectedColor(foundProduct.colors[0]) // Set default color from product data
    }
  }, [productId])

  const colors = [
    { name: "black", color: "bg-slate-900", border: "border-slate-900" },
    { name: "red", color: "bg-red-500", border: "border-red-500" },
  ]
  const sizes = ["XS", "S", "M", "L", "XL"]

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 sm:w-5 sm:h-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">Product not found.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 sm:h-64 md:h-80 object-contain mx-auto"
                />
              </CardContent>
            </Card>
            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[0, 1, 2].map((index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all ${selectedImage === index ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <CardContent className="p-2 sm:p-3">
                    <img
                      src={product.image || "/placeholder.svg"} // Using main product image for thumbnails for simplicity
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-16 sm:h-20 md:h-24 object-contain mx-auto"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          {/* Product Details */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">{product.name}</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
                <div className="flex items-center space-x-1">{renderStars(product.rating)}</div>
                <span className="text-sm sm:text-base text-gray-600">({product.reviewCount} Reviews)</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs sm:text-sm">
                  In Stock
                </Badge>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                ${product.price.toFixed(2)}
                {product.oldPrice && (
                  <span className="text-sm text-gray-400 line-through ml-2">${product.oldPrice.toFixed(2)}</span>
                )}
              </div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install
                & mess free removal. Pressure sensitive.
              </p>
            </div>
            <hr className="border-gray-200" />
            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3">Colours:</h3>
                <div className="flex space-x-3">
                  {product.colors.map((colorName) => {
                    const colorOption = colors.find((c) => c.name === colorName)
                    if (!colorOption) return null // Skip if color not defined in `colors` array
                    return (
                      <button
                        key={colorName}
                        onClick={() => setSelectedColor(colorName)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${colorOption.color} border-2 ${
                          selectedColor === colorName ? colorOption.border : "border-gray-300"
                        } transition-all hover:scale-110`}
                      />
                    )
                  })}
                </div>
              </div>
            )}
            {/* Size Selection */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3">Size:</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 text-sm sm:text-base ${
                      selectedSize === size ? "bg-red-500 hover:bg-red-600" : ""
                    }`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
            {/* Quantity and Actions */}
            <div className="flex flex-row sm:items-center gap-3 sm:gap-4 items-center">
              <div className="flex items-center border border-gray-300 rounded-lg w-full sm:w-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decrementQuantity}
                  className="h-10 w-10 sm:h-12 sm:w-12 hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center font-medium flex-1 sm:flex-initial">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={incrementQuantity}
                  className="h-10 w-10 sm:h-12 sm:w-12 hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4 text-white bg-red-500 rounded" />
                </Button>
              </div>
              <Button size="lg" className="flex-1 bg-red-500 hover:bg-red-600 text-white h-12 text-sm sm:text-base">
                Buy Now
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`h-10 w-10 sm:h-12 sm:w-12 ${isWishlisted ? "bg-red-50 border-red-500" : ""}`}
              >
                <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>
          </div>
					<ProductList products={products} />
        </div>
      </div>
    </div>
  )
}
