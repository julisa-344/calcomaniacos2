import './style/CartPage.scss';
function CartPage() {
  return (
   <>
    <main className="bg-color mt-h">
    <h2 className="title pt-8 text-center">Carrito</h2>
    <div className="item-product">
      <img src="" alt="" />
      <p>Producto</p>
      <p>S/. 12</p>
      <div>
        <button>-</button>
        <span>1</span>
        <button>+</button>
      </div>
    </div>
   </main>
   </>
  );
}
export default CartPage;