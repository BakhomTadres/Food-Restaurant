import Footer from "./Components/Footer";
import Header from "./Components/Header";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Notification from "./Components/Notification";

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "fa-leaf",
      title: "Fresh Ingredients",
      desc: "Sourced daily from local farms",
    },
    {
      icon: "fa-fire-flame-curved",
      title: "Made to Order",
      desc: "Every dish cooked fresh for you",
    },
    {
      icon: "fa-truck-fast",
      title: "Fast Delivery",
      desc: "Hot food at your door in 30 min",
    },
  ];
  let [elementsInCartNum, setElementsInCartNum] = useState<number>(
    () => Number(localStorage.getItem("cartItemsNum")) || 0,
  );
  let [showNotification, setShowNotification] = useState<boolean>(false);
  let [statusNotification, setStatusNotification] = useState<
    "success" | "error"
  >("success");

  let [elementsInCart, setElementsInCart] = useState<
    {
      id: number;
      name: string;
      src: string;
      alt: string;
      desc: string;
      price: number;
    }[]
  >(() => {
    const cartItems = localStorage.getItem("cartItems");
    return cartItems ? JSON.parse(cartItems) : [];
  });

  return (
    <>
      <Header
        elements={elementsInCart}
        setElements={setElementsInCart}
        setElementsNum={setElementsInCartNum}
        elementsnum={elementsInCartNum}
        setStatusNotification={setStatusNotification}
        setShowNotification={setShowNotification}
      />

      {showNotification && <Notification type={statusNotification} />}

      {/* Hero Section */}
      <div className="relative bg-[url(/images/background.avif)] bg-right md:bg-center bg-cover min-h-screen flex items-center">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-gray-900/85 via-gray-900/60 to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              Now Accepting Orders
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl text-amber-50 font-black leading-none mb-6">
              Fresh Food,
              <br />
              <span className="text-amber-400">Great Taste.</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-lg leading-relaxed">
              Experience delicious meals made with fresh ingredients and served
              with love — every bite feels special.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/menu")}
                className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-black text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-amber-400/30 cursor-pointer"
              >
                <i className="fa-solid fa-utensils"></i>
                Order Now
              </button>
              <button
                onClick={() => navigate("/menu")}
                className="flex items-center gap-2 border-2 border-amber-50/30 hover:border-amber-50 text-amber-50 font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm cursor-pointer"
              >
                View Menu
                <i className="fa-solid fa-arrow-right text-sm"></i>
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-14">
              {[
                { num: "500+", label: "Happy Customers" },
                { num: "50+", label: "Menu Items" },
                { num: "4.9★", label: "Average Rating" },
              ].map(({ num, label }) => (
                <div key={label}>
                  <p className="text-2xl md:text-3xl font-black text-amber-400">
                    {num}
                  </p>
                  <p className="text-gray-400 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-amber-50/40 animate-bounce">
          <i className="fa-solid fa-chevron-down text-lg"></i>
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-gray-900 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-amber-50 mb-3">
              Why Choose <span className="text-amber-400">Us?</span>
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              We go above and beyond to make your dining experience
              unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="group bg-gray-800 hover:bg-gray-700 border border-white/5 hover:border-amber-400/20 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-amber-400/10 group-hover:bg-amber-400/20 rounded-xl flex items-center justify-center mb-5 transition">
                  <i className={`fa-solid ${icon} text-amber-400 text-xl`}></i>
                </div>
                <h3 className="text-amber-50 font-bold text-xl mb-2">
                  {title}
                </h3>
                <p className="text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-amber-400 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Ready to Order?
          </h2>
          <p className="text-gray-700 text-lg mb-8">
            Explore our full menu and find your next favorite meal.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-gray-900 hover:bg-gray-800 text-amber-50 font-black text-lg px-10 py-4 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer shadow-xl shadow-gray-900/30"
          >
            Browse the Menu
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
}
