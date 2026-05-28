import Footer from "./Components/Footer";
import Header from "./Components/Header";
import { useState } from "react";
import Notification from "./Components/Notification";

export default function Menu() {
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

  let [showNotification, setShowNotification] = useState<boolean>(false);
  let [statusNotification, setStatusNotification] = useState<
    "success" | "error"
  >("success");

  let dishes: {
    id: number;
    name: string;
    src: string;
    alt: string;
    desc: string;
    price: number;
  }[] = [
    {
      id: 1,
      name: "Beef Burger",
      src: "/images/burger.jpg",
      alt: "Menu",
      desc: "A delicious sandwich with fresh ingredients and a perfect blend of flavors.",
      price: 8.0,
    },
    {
      id: 2,
      name: "Pizza",
      src: "/images/pizza.jpg",
      alt: "Menu",
      desc: "Our pizza is made with freshly prepared dough, premium cheese, and delicious.",
      price: 10.0,
    },
    {
      id: 3,
      name: "Sandwich",
      src: "/images/sandwich.jpg",
      alt: "Menu",
      desc: "A delicious Sandwich with fresh ingredients and a perfect blend of flavors.",
      price: 7.0,
    },
    {
      id: 4,
      name: "Red Pasta Sauce",
      src: "/images/red-sauce-pasta.webp",
      alt: "Menu",
      desc: "A delicious and flavorful pasta dish with a rich and flavorful red sauce.",
      price: 9.0,
    },
    {
      id: 5,
      name: "spaghetti",
      src: "/images/spaghetti.jpg",
      alt: "Menu",
      desc: "A delicious spaghetti dish with a rich and flavorful sauce.",
      price: 6.0,
    },
    {
      id: 6,
      name: "Grilled Chicken",
      src: "/images/Grilled-Chicken.jpg",
      alt: "Menu",
      desc: "A delicious grilled chicken dish with a rich and flavorful sauce.",
      price: 12.0,
    },
    {
      id: 7,
      name: "Fried Chicken",
      src: "/images/fried-chicken.jpg",
      alt: "Menu",
      desc: "A delicious fried chicken dish with a rich and flavorful sauce.",
      price: 15.0,
    },
    {
      id: 8,
      name: "Dessert",
      src: "/images/dessert.jpg",
      alt: "Menu",
      desc: "A delicious dessert dish with a rich and flavorful taste.",
      price: 5.0,
    },
    {
      id: 9,
      name: "Mango Juice",
      src: "/images/mango-juice.jpg",
      alt: "Menu",
      desc: "A delicious mango juice with a rich and flavorful taste.",
      price: 3.0,
    },
  ];

  const handleAddToCart = (dish: (typeof dishes)[0]) => {
    const updated = [...elementsInCart, dish];
    setElementsInCart(updated);
    setElementsInCartNum(updated.length);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    localStorage.setItem("cartItemsNum", updated.length.toString());
    setShowNotification(true);
    setStatusNotification("success");
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

  return (
    <>
      <Header
        location="menu"
        elements={elementsInCart}
        setElements={setElementsInCart}
        setElementsNum={setElementsInCartNum}
        elementsnum={elementsInCartNum}
        setStatusNotification={setStatusNotification}
        setShowNotification={setShowNotification}
      />
      {showNotification && <Notification type={statusNotification} />}
      <div className="min-h-screen bg-gray-900 pt-10">
        <h1 className="text-2xl font-bold text-center mt-20 mb-10 text-amber-50">
          Menu
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 w-[90%] md:w-3/4 mx-auto pb-20">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="overflow-hidden bg-amber-50 rounded-md w-full h-110 md:h-auto rounded-tl-4xl rounded-br-4xl"
            >
              <img
                className="w-full rounded-tl-4xl h-60 md:h-auto object-cover  hover:scale-105 transition duration-300"
                src={dish.src}
                alt={dish.alt}
              />
              <h1 className="text-xl font-bold text-center mt-2 text-gray-900">
                {dish.name}
              </h1>
              <div className="relative h-20 ">
                <p className="text-gray-900 text-md mt-1 px-4">{dish.desc}</p>
                <span className="font-bold absolute right-4 top-12 md:text-xl text-gray-900">
                  ${dish.price.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => handleAddToCart(dish)}
                className="bg-gray-900 shadow-lg shadow-black text-gray-50 hover:scale-110 duration-300 p-2 rounded-md my-4 relative left-1/2 -translate-x-1/2 cursor-pointer transition hover:text-amber-50 border-gray-900 border-3 md:text-lg"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
        <Footer />
      </div>
    </>
  );
}
