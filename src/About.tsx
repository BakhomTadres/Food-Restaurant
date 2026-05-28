import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { useState } from "react";
export default function About() {
  const values = [
    {
      icon: "fa-heart",
      title: "Made with Love",
      desc: "Every dish is prepared with care and passion.",
    },
    {
      icon: "fa-seedling",
      title: "Fresh & Local",
      desc: "We source ingredients from trusted local farms.",
    },
    {
      icon: "fa-users",
      title: "Family Friendly",
      desc: "A welcoming space for everyone to enjoy.",
    },
    {
      icon: "fa-award",
      title: "Quality First",
      desc: "Uncompromising standards in every meal we serve.",
    },
  ];

  const team = [
    { name: "Chef Ahmed", role: "Head Chef", emoji: "👨‍🍳" },
    { name: "Sara Hassan", role: "Pastry Chef", emoji: "👩‍🍳" },
    { name: "Omar Khalid", role: "Sous Chef", emoji: "👨‍🍳" },
  ];
  let [elementsInCartNum, setElementsInCartNum] = useState<number>(
    () => Number(localStorage.getItem("cartItemsNum")) || 0,
  );
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
    <div className="bg-gray-900 min-h-screen">
      <Header
        location="about"
        elements={elementsInCart}
        setElements={setElementsInCart}
        setElementsNum={setElementsInCartNum}
        elementsnum={elementsInCartNum}
      />

      {/* Hero */}
      <div className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block bg-amber-400/10 border border-amber-400/20 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            Our Story
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-amber-50 mb-6">
            About <span className="text-amber-400">Us</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            A place where flavor meets comfort, and every meal brings people
            together.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="bg-gray-800 border border-white/5 rounded-3xl p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-black text-amber-50 mb-5">
              Who We Are
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-5">
              Welcome to our restaurant, where flavor meets comfort. We believe
              good food brings people together, so we prepare every dish with
              passion and quality ingredients to give you the best dining
              experience.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Founded in 2018, we've been serving our community with love and
              dedication. Our kitchen is built on the belief that great food
              starts with great ingredients and even greater care.
            </p>
            <div className="flex gap-6 mt-8">
              {[
                ["6+", "Years Open"],
                ["10K+", "Meals Served"],
                ["4.9", "Star Rating"],
              ].map(([num, label]) => (
                <div key={label}>
                  <p className="text-2xl font-black text-amber-400">{num}</p>
                  <p className="text-gray-500 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <img
              src="/images/about.jpg"
              alt="About Us"
              className="w-full h-72 md:h-96 object-cover rounded-3xl shadow-2xl shadow-black/40"
            />
            <div className="absolute -bottom-4 -left-4 bg-amber-400 text-gray-900 font-black text-lg px-6 py-3 rounded-2xl shadow-lg">
              Est. 2018 🍽️
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-800/50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-amber-50 mb-3">
              Our <span className="text-amber-400">Values</span>
            </h2>
            <p className="text-gray-400">
              The principles that guide everything we do.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-gray-800 hover:bg-gray-700 border border-white/5 hover:border-amber-400/20 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className={`fa-solid ${icon} text-amber-400 text-lg`}></i>
                </div>
                <h3 className="text-amber-50 font-bold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-amber-50 mb-3">
              Meet the <span className="text-amber-400">Team</span>
            </h2>
            <p className="text-gray-400">
              The talented people behind every delicious dish.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {team.map(({ name, role, emoji }) => (
              <div
                key={name}
                className="bg-gray-800 border border-white/5 rounded-2xl p-6 text-center"
              >
                <div className="w-16 h-16 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  {emoji}
                </div>
                <p className="text-amber-50 font-bold">{name}</p>
                <p className="text-amber-400 text-sm mt-1">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
