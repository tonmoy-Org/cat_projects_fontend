import CartPage from '../pages/cart/Cartpage';
import { useCart } from '../context/CartContext';


const CartRoute = () => {
  const { cartItems, removeFromCart, updateQty, clearCart } = useCart();
  return (
    <CartPage
      cartItems={cartItems}
      onRemove={removeFromCart}
      onUpdateQty={updateQty}
      onClearCart={clearCart}
    />
  );
};

export default CartRoute;
