export default function CartSummary({ total, coupon, setCoupon }) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span>Subtotal:</span>
        <span>${total}</span>
      </div>
      <div className="flex justify-between">
        <span>Shipping:</span>
        <span className="text-green-500">Free</span>
      </div>
      <div className="flex justify-between border-t pt-1 font-semibold">
        <span>Total:</span>
        <span>${total}</span>
      </div>
      <div className="flex mt-2 space-x-2">
        <input
          type="text"
          placeholder="Coupon Code"
          value={coupon}
          onChange={e => setCoupon(e.target.value)}
          className="flex-1 border rounded-md px-4 py-2 text-base border-black"
        />
        <button
          type="button"
          className="bg-red-500 text-white px-5 py-2 rounded-md text-base hover:bg-red-600"
        >
          Apply Coupon
        </button>
      </div>
    </div>
  );
}
