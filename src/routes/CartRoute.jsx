import CartPage from '../pages/cart/Cartpage';
import { useCart } from '../context/CartContext';

const CartRoute = () => {
  const { cartItems, removeFromCart, updateQty, clearCart, syncCart } = useCart();

  // Called when user clicks "Update cart" — syncs full cart to server
  const handleUpdateQty = async (id, qty) => {
    await updateQty(id, qty);
    // Optionally full-sync after all updates:
    // await syncCart(cartItems);
  };

  return (
    <CartPage
      cartItems={cartItems}
      onRemove={removeFromCart}
      onUpdateQty={handleUpdateQty}
      onClearCart={clearCart}
    />
  );
};

export default CartRoute;