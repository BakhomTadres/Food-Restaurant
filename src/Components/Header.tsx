import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type Dish = {
  id: number;
  name: string;
  src: string;
  alt: string;
  desc: string;
  price: number;
};

type CartItem = Dish & { quantity: number };

export default function Header({
  location: pageLoc,
  elementsnum,
  elements,
  setElements,
  setElementsNum,
}: {
  location?: string;
  elementsnum?: number;
  elements?: Dish[];
  setElements?: React.Dispatch<React.SetStateAction<Dish[]>>;
  setElementsNum?: React.Dispatch<React.SetStateAction<number>>;
}) {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLogined, setIsLogined] = useState(
    localStorage.getItem("isLogin") || false,
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentPath = routerLocation.pathname;

  const cartItems: CartItem[] = elements
    ? elements.reduce((acc: CartItem[], dish) => {
        const existing = acc.find((item) => item.id === dish.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          acc.push({ ...dish, quantity: 1 });
        }
        return acc;
      }, [])
    : [];

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleIncrease = (dish: Dish) => {
    if (!setElements || !setElementsNum) return;
    const updated = [...(elements || []), dish];
    setElements(updated);
    setElementsNum(updated.length);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    localStorage.setItem("cartItemsNum", updated.length.toString());
  };

  const handleDecrease = (dish: Dish) => {
    if (!setElements || !setElementsNum) return;
    const idx = (elements || []).findLastIndex((e) => e.id === dish.id);
    if (idx === -1) return;
    const updated = [
      ...(elements || []).slice(0, idx),
      ...(elements || []).slice(idx + 1),
    ];
    setElements(updated);
    setElementsNum(updated.length);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    localStorage.setItem("cartItemsNum", updated.length.toString());
  };

  const handleRemove = (dish: Dish) => {
    if (!setElements || !setElementsNum) return;
    const updated = (elements || []).filter((e) => e.id !== dish.id);
    setElements(updated);
    setElementsNum(updated.length);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    localStorage.setItem("cartItemsNum", updated.length.toString());
  };

  const navLinks = ["Home", "About", "Menu", "Contact"];

  const isOpaque =
    pageLoc === "menu" ||
    pageLoc === "contact" ||
    pageLoc === "about" ||
    scrolled;

  return (
    <>
      <header
        className={`fixed w-full top-0 z-30 transition-all duration-500 ${
          isOpaque
            ? "bg-gray-900/95 backdrop-blur-md shadow-lg shadow-black/30 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer flex items-center gap-2 group"
          >
            <div className="w-9 h-9 bg-amber-400 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <i className="fa-solid fa-utensils text-gray-900 text-sm"></i>
            </div>
            <span className="text-2xl font-black text-amber-50 tracking-tight">
              Food<span className="text-amber-400">.</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const href = item === "Home" ? "/" : `/${item.toLowerCase()}`;
              const isActive = currentPath === href;
              return (
                <a
                  key={item}
                  onClick={() => navigate(href)}
                  className={`relative px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "text-amber-400 bg-amber-400/10"
                      : "text-amber-50/80 hover:text-amber-50 hover:bg-white/10"
                  }`}
                >
                  {item}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full"></span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={() => setShowCart(true)}
              className="relative flex items-center gap-2 bg-white/10 hover:bg-white/20 text-amber-50 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <i className="fa-solid fa-cart-shopping text-sm"></i>
              {elementsnum !== undefined && elementsnum > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 text-gray-900 text-xs font-black flex items-center justify-center">
                  {elementsnum > 99 ? "99+" : elementsnum}
                </span>
              )}
              <span className="hidden sm:inline text-sm font-semibold">
                Cart
              </span>
            </button>

            <button
              onClick={() => {
                if (isLogined) {
                  localStorage.removeItem("isLogin");
                  setIsLogined(false);
                  navigate("/login");
                } else {
                  navigate("/register");
                }
              }}
              className="hidden sm:flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold text-sm px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <i
                className={`fa-solid ${isLogined ? "fa-right-from-bracket" : "fa-user-plus"} text-xs`}
              ></i>
              {isLogined ? "Log out" : "Sign Up"}
            </button>

            <button
              onClick={() => setShowMenu(true)}
              className="md:hidden flex items-center justify-center w-9 h-9 bg-white/10 hover:bg-white/20 text-amber-50 rounded-lg transition cursor-pointer"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </div>
      </header>

      {showMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowMenu(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-gray-900 z-50 md:hidden flex flex-col transition-transform duration-400 ${
          showMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <span className="text-xl font-black text-amber-50">
            Food<span className="text-amber-400">.</span>
          </span>
          <button
            onClick={() => setShowMenu(false)}
            className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 text-amber-50 rounded-lg transition cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-1 flex-1">
          {navLinks.map((item) => {
            const href = item === "Home" ? "/" : `/${item.toLowerCase()}`;
            const isActive = currentPath === href;
            return (
              <a
                key={item}
                onClick={() => {
                  navigate(href);
                  setShowMenu(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-amber-400/20 text-amber-400"
                    : "text-amber-50/70 hover:text-amber-50 hover:bg-white/10"
                }`}
              >
                <i
                  className={`fa-solid ${
                    item === "Home"
                      ? "fa-house"
                      : item === "About"
                        ? "fa-circle-info"
                        : item === "Menu"
                          ? "fa-utensils"
                          : "fa-envelope"
                  } w-4 text-sm`}
                ></i>
                {item}
              </a>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => {
              if (isLogined) {
                localStorage.removeItem("isLogin");
                setIsLogined(false);
                navigate("/login");
              } else {
                navigate("/register");
              }
              setShowMenu(false);
            }}
            className="w-full bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold py-3 rounded-xl transition cursor-pointer"
          >
            {isLogined ? "Log out" : "Sign Up"}
          </button>
        </div>
      </div>

      {showCart && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowCart(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-80 bg-amber-50 z-50 flex flex-col transition-transform duration-400 shadow-2xl ${
          showCart ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="bg-gray-900 text-amber-50 px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-black flex items-center gap-2">
            <i className="fa-solid fa-cart-shopping text-amber-400"></i>
            Your Cart
            {cartItems.length > 0 && (
              <span className="bg-amber-400 text-gray-900 text-xs font-black px-2 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </h2>
          <button
            onClick={() => setShowCart(false)}
            className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-amber-50 rounded-lg transition cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-cart-shopping text-3xl text-gray-400"></i>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-lg">Cart is empty</p>
                <p className="text-gray-400 text-sm mt-1">
                  Add dishes from the menu!
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCart(false);
                  navigate("/menu");
                }}
                className="bg-gray-900 text-amber-50 px-6 py-2 rounded-xl font-semibold text-sm hover:bg-gray-700 transition cursor-pointer"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 bg-white rounded-2xl p-3 shadow-sm border border-gray-100"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-18 h-18 object-cover rounded-xl shrink-0"
                    style={{ width: "72px", height: "72px" }}
                  />
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-gray-900 text-sm leading-tight">
                        {item.name}
                      </p>
                      <button
                        onClick={() => handleRemove(item)}
                        className="text-gray-300 hover:text-red-400 transition text-xs shrink-0 cursor-pointer"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                    <p className="text-amber-500 font-black text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecrease(item)}
                        className="w-6 h-6 rounded-full bg-gray-900 text-amber-50 flex items-center justify-center hover:bg-amber-500 transition font-bold text-sm cursor-pointer"
                      >
                        −
                      </button>
                      <span className="font-bold text-gray-900 w-5 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrease(item)}
                        className="w-6 h-6 rounded-full bg-gray-900 text-amber-50 flex items-center justify-center hover:bg-amber-500 transition font-bold text-sm cursor-pointer"
                      >
                        +
                      </button>
                      <span className="text-gray-400 text-xs ml-1">
                        × ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 bg-white px-5 py-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-500 text-sm">
                Subtotal ({elementsnum} items)
              </span>
              <span className="font-black text-xl text-gray-900">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <p className="text-gray-400 text-xs mb-4">
              Taxes and delivery calculated at checkout
            </p>
            <button
              onClick={() => {
                isLogined ? navigate("/checkout") : navigate("/register");
              }}
              className="w-full bg-gray-900 hover:bg-gray-700 text-amber-50 py-3.5 rounded-xl font-bold text-base transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-lock text-amber-400 text-sm"></i>
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
