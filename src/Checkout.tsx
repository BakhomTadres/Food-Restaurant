import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Components/Header";

type Dish = {
  id: number;
  name: string;
  src: string;
  alt: string;
  desc: string;
  price: number;
};

type CartItem = Dish & { quantity: number };

type Step = "delivery" | "payment" | "review";

const STEPS: { key: Step; label: string; icon: string }[] = [
  { key: "delivery", label: "Delivery", icon: "fa-location-dot" },
  { key: "payment", label: "Payment", icon: "fa-credit-card" },
  { key: "review", label: "Review", icon: "fa-clipboard-check" },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("delivery");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId] = useState(
    () => "#" + Math.random().toString(36).substring(2, 8).toUpperCase(),
  );

  const [elements, setElements] = useState<Dish[]>(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });
  const [elementsNum, setElementsNum] = useState<number>(
    () => Number(localStorage.getItem("cartItemsNum")) || 0,
  );

  const cartItems: CartItem[] = elements.reduce((acc: CartItem[], dish) => {
    const existing = acc.find((item) => item.id === dish.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ ...dish, quantity: 1 });
    }
    return acc;
  }, []);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = subtotal > 30 ? 0 : 3.5;
  const tax = subtotal * 0.1;
  const total = subtotal + delivery + tax;

  // Delivery form
  const [delivery_form, setDeliveryForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    apartment: "",
    city: "",
    notes: "",
    method: "delivery" as "delivery" | "pickup",
  });
  const [deliveryErrors, setDeliveryErrors] = useState<Record<string, string>>(
    {},
  );

  // Payment form
  const [paymentForm, setPaymentForm] = useState({
    method: "card" as "card" | "cash" | "wallet",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    saveCard: false,
  });
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>(
    {},
  );

  const handleDeliveryChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setDeliveryForm({ ...delivery_form, [name]: value });
    if (deliveryErrors[name])
      setDeliveryErrors({ ...deliveryErrors, [name]: "" });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let formatted = value;
    if (name === "cardNumber")
      formatted = value
        .replace(/\D/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
    if (name === "expiry")
      formatted = value
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);
    if (name === "cvv") formatted = value.replace(/\D/g, "").slice(0, 3);
    setPaymentForm({
      ...paymentForm,
      [name]: type === "checkbox" ? checked : formatted,
    });
    if (paymentErrors[name]) setPaymentErrors({ ...paymentErrors, [name]: "" });
  };

  const validateDelivery = () => {
    const e: Record<string, string> = {};
    if (!delivery_form.firstName.trim()) e.firstName = "Required";
    if (!delivery_form.lastName.trim()) e.lastName = "Required";
    if (!delivery_form.phone.trim()) e.phone = "Required";
    else if (delivery_form.phone.replace(/\D/g, "").length < 10)
      e.phone = "Enter a valid phone number";
    if (!delivery_form.email.trim()) e.email = "Required";
    else if (!delivery_form.email.includes("@"))
      e.email = "Enter a valid email";
    if (delivery_form.method === "delivery") {
      if (!delivery_form.address.trim()) e.address = "Required";
      if (!delivery_form.city.trim()) e.city = "Required";
    }
    return e;
  };

  const validatePayment = () => {
    const e: Record<string, string> = {};
    if (paymentForm.method === "card") {
      if (!paymentForm.cardName.trim()) e.cardName = "Required";
      if (paymentForm.cardNumber.replace(/\s/g, "").length < 16)
        e.cardNumber = "Enter a valid 16-digit card number";
      if (!paymentForm.expiry || paymentForm.expiry.length < 5)
        e.expiry = "Required";
      if (!paymentForm.cvv || paymentForm.cvv.length < 3) e.cvv = "Required";
    }
    return e;
  };

  const goNext = () => {
    if (currentStep === "delivery") {
      const errors = validateDelivery();
      if (Object.keys(errors).length > 0) {
        setDeliveryErrors(errors);
        return;
      }
      setCurrentStep("payment");
    } else if (currentStep === "payment") {
      const errors = validatePayment();
      if (Object.keys(errors).length > 0) {
        setPaymentErrors(errors);
        return;
      }
      setCurrentStep("review");
    }
  };

  const placeOrder = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("cartItems");
      localStorage.removeItem("cartItemsNum");
      setElements([]);
      setElementsNum(0);
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  const stepIndex = STEPS.findIndex((s) => s.key === currentStep);

  if (cartItems.length === 0 && !submitted) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-6 px-4">
        <Header
          location="menu"
          elements={elements}
          setElements={setElements}
          setElementsNum={setElementsNum}
          elementsnum={elementsNum}
        />
        <div className="text-center mt-20">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-cart-shopping text-4xl text-gray-600"></i>
          </div>
          <h2 className="text-2xl font-black text-amber-50 mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-400 mb-8">
            Add some dishes before checking out.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-amber-400 hover:bg-amber-300 text-gray-900 font-black px-8 py-3 rounded-xl transition cursor-pointer"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen py-4 bg-gray-900 flex flex-col items-center justify-center px-4">
        <Header
          location="menu"
          elements={[]}
          setElements={setElements}
          setElementsNum={setElementsNum}
          elementsnum={0}
        />
        <div className="max-w-md w-full text-center mt-20">
          {/* Animated checkmark */}
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 bg-green-400/10 rounded-full animate-ping"></div>
            <div className="relative w-28 h-28 bg-green-400/20 border-2 border-green-400/40 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-check text-green-400 text-4xl"></i>
            </div>
          </div>

          <h1 className="text-4xl font-black text-amber-50 mb-3">
            Order Placed!
          </h1>
          <p className="text-gray-400 text-lg mb-2">
            Thank you for your order 🎉
          </p>
          <div className="inline-block bg-amber-400/10 border border-amber-400/20 text-amber-400 font-bold px-4 py-2 rounded-full text-sm mb-8">
            Order {orderId}
          </div>

          <div className="bg-gray-800 border border-white/5 rounded-2xl p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Delivery to</span>
              <span className="text-amber-50 font-semibold">
                {delivery_form.firstName} {delivery_form.lastName}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Estimated time</span>
              <span className="text-amber-50 font-semibold">
                30 – 45 minutes
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total paid</span>
              <span className="text-amber-400 font-black text-base">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Progress tracker */}
          <div className="flex items-center justify-between bg-gray-800 border border-white/5 rounded-2xl p-5 mb-8">
            {[
              { icon: "fa-receipt", label: "Confirmed", done: true },
              { icon: "fa-fire-flame-curved", label: "Preparing", done: false },
              { icon: "fa-motorcycle", label: "On the way", done: false },
              { icon: "fa-house", label: "Delivered", done: false },
            ].map(({ icon, label, done }, i, arr) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm ${done ? "bg-amber-400 text-gray-900" : "bg-gray-700 text-gray-500"}`}
                  >
                    <i className={`fa-solid ${icon}`}></i>
                  </div>
                  <span
                    className={`text-xs font-semibold ${done ? "text-amber-400" : "text-gray-600"}`}
                  >
                    {label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div
                    className={`h-0.5 w-8 mx-1 mb-4 ${done ? "bg-amber-400" : "bg-gray-700"}`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex-1 border-2 border-white/10 hover:border-white/20 text-amber-50 font-bold py-3 rounded-xl transition cursor-pointer"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate("/menu")}
              className="flex-1 bg-amber-400 hover:bg-amber-300 text-gray-900 font-black py-3 rounded-xl transition cursor-pointer"
            >
              Order Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header
        location="menu"
        elements={elements}
        setElements={setElements}
        setElementsNum={setElementsNum}
        elementsnum={elementsNum}
      />

      <div className="max-w-7xl mx-auto px-4 pt-28 pb-20">
        {/* Page Title */}
        <div className="mb-10">
          <button
            onClick={() => navigate("/menu")}
            className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition text-sm cursor-pointer mb-4"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Back to Menu
          </button>
          <h1 className="text-3xl md:text-4xl font-black text-amber-50">
            Checkout
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center mb-10 max-w-lg">
          {STEPS.map(({ key, label, icon }, i) => {
            const isActive = key === currentStep;
            const isDone = i < stepIndex;
            return (
              <div
                key={key}
                className="flex items-center flex-1 last:flex-none"
              >
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      isDone
                        ? "bg-green-500 text-white"
                        : isActive
                          ? "bg-amber-400 text-gray-900"
                          : "bg-gray-800 border border-white/10 text-gray-500"
                    }`}
                  >
                    {isDone ? (
                      <i className="fa-solid fa-check text-xs"></i>
                    ) : (
                      <i className={`fa-solid ${icon} text-xs`}></i>
                    )}
                  </div>
                  <span
                    className={`text-xs font-semibold ${isActive ? "text-amber-400" : isDone ? "text-green-400" : "text-gray-500"}`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-3 mb-5 transition-all duration-500 ${isDone ? "bg-green-500" : "bg-gray-700"}`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-white/5 rounded-3xl p-6 sticky top-28">
              <h3 className="font-black text-amber-50 text-lg mb-5 flex items-center gap-2">
                <i className="fa-solid fa-receipt text-amber-400 text-sm"></i>
                Order Summary
              </h3>

              {/* Items */}
              <ul className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex gap-3 items-center">
                    <div className="relative shrink-0">
                      <img
                        src={item.src}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-xl"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 text-gray-900 text-xs font-black rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-amber-50 text-xs font-semibold truncate">
                        {item.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <p className="text-amber-50 text-sm font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/10 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-amber-50">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Delivery fee</span>
                  <span
                    className={
                      delivery === 0
                        ? "text-green-400 font-semibold"
                        : "text-amber-50"
                    }
                  >
                    {delivery === 0 ? "FREE" : `$${delivery.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax (10%)</span>
                  <span className="text-amber-50">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                  <span className="text-amber-50 font-black text-lg">
                    Total
                  </span>
                  <span className="text-amber-400 font-black text-xl">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {delivery > 0 && (
                <div className="mt-4 bg-amber-400/5 border border-amber-400/10 rounded-xl px-4 py-3">
                  <p className="text-amber-400/80 text-xs">
                    <i className="fa-solid fa-truck-fast mr-1.5"></i>
                    Add{" "}
                    <span className="font-bold">
                      ${(30 - subtotal).toFixed(2)}
                    </span>{" "}
                    more for free delivery!
                  </p>
                </div>
              )}

              <div className="mt-5 flex items-center justify-center gap-4 text-gray-600">
                <i className="fa-solid fa-lock text-sm"></i>
                <p className="text-xs">Secured by SSL encryption</p>
              </div>
            </div>
          </div>
          {/* Right: Steps */}
          <div className="lg:col-span-2">
            {/* ── STEP 1: DELIVERY ── */}
            {currentStep === "delivery" && (
              <div className="bg-gray-800 border border-white/5 rounded-3xl p-6 md:p-8">
                <h2 className="text-xl font-black text-amber-50 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-400/10 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-location-dot text-amber-400 text-sm"></i>
                  </div>
                  Delivery Information
                </h2>

                {/* Delivery Method Toggle */}
                <div className="flex gap-3 mb-6">
                  {(["delivery", "pickup"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() =>
                        setDeliveryForm({ ...delivery_form, method: m })
                      }
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border-2 transition cursor-pointer ${
                        delivery_form.method === m
                          ? "bg-amber-400/10 border-amber-400 text-amber-400"
                          : "border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      <i
                        className={`fa-solid ${m === "delivery" ? "fa-motorcycle" : "fa-store"}`}
                      ></i>
                      {m === "delivery" ? "Home Delivery" : "Store Pickup"}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        name: "firstName",
                        label: "First Name",
                        placeholder: "Ahmed",
                      },
                      {
                        name: "lastName",
                        label: "Last Name",
                        placeholder: "Mohamed",
                      },
                    ].map(({ name, label, placeholder }) => (
                      <div key={name}>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                          {label} <span className="text-amber-400">*</span>
                        </label>
                        <input
                          name={name}
                          value={(delivery_form as any)[name]}
                          onChange={handleDeliveryChange}
                          placeholder={placeholder}
                          className={`w-full bg-gray-700 border ${deliveryErrors[name] ? "border-red-500" : "border-white/10 focus:border-amber-400"} text-amber-50 placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition`}
                        />
                        {deliveryErrors[name] && (
                          <p className="text-red-400 text-xs mt-1">
                            {deliveryErrors[name]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        name: "phone",
                        label: "Phone",
                        placeholder: "+20 100 000 0000",
                        type: "tel",
                      },
                      {
                        name: "email",
                        label: "Email",
                        placeholder: "your@email.com",
                        type: "email",
                      },
                    ].map(({ name, label, placeholder, type }) => (
                      <div key={name}>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                          {label} <span className="text-amber-400">*</span>
                        </label>
                        <input
                          name={name}
                          type={type}
                          value={(delivery_form as any)[name]}
                          onChange={handleDeliveryChange}
                          placeholder={placeholder}
                          className={`w-full bg-gray-700 border ${deliveryErrors[name] ? "border-red-500" : "border-white/10 focus:border-amber-400"} text-amber-50 placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition`}
                        />
                        {deliveryErrors[name] && (
                          <p className="text-red-400 text-xs mt-1">
                            {deliveryErrors[name]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {delivery_form.method === "delivery" && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                          Street Address{" "}
                          <span className="text-amber-400">*</span>
                        </label>
                        <input
                          name="address"
                          value={delivery_form.address}
                          onChange={handleDeliveryChange}
                          placeholder="123 Main Street"
                          className={`w-full bg-gray-700 border ${deliveryErrors.address ? "border-red-500" : "border-white/10 focus:border-amber-400"} text-amber-50 placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition`}
                        />
                        {deliveryErrors.address && (
                          <p className="text-red-400 text-xs mt-1">
                            {deliveryErrors.address}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                            Apartment / Floor
                          </label>
                          <input
                            name="apartment"
                            value={delivery_form.apartment}
                            onChange={handleDeliveryChange}
                            placeholder="Apt 4B"
                            className="w-full bg-gray-700 border border-white/10 focus:border-amber-400 text-amber-50 placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                            City <span className="text-amber-400">*</span>
                          </label>
                          <input
                            name="city"
                            value={delivery_form.city}
                            onChange={handleDeliveryChange}
                            placeholder="Cairo"
                            className={`w-full bg-gray-700 border ${deliveryErrors.city ? "border-red-500" : "border-white/10 focus:border-amber-400"} text-amber-50 placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition`}
                          />
                          {deliveryErrors.city && (
                            <p className="text-red-400 text-xs mt-1">
                              {deliveryErrors.city}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                      Order Notes
                    </label>
                    <textarea
                      name="notes"
                      value={delivery_form.notes}
                      onChange={handleDeliveryChange}
                      rows={3}
                      placeholder="Any special instructions? e.g. ring the bell twice, extra napkins..."
                      className="w-full bg-gray-700 border border-white/10 focus:border-amber-400 text-amber-50 placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition resize-none"
                    />
                  </div>
                </div>

                <button
                  onClick={goNext}
                  className="w-full mt-8 bg-amber-400 hover:bg-amber-300 text-gray-900 font-black py-4 rounded-xl transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer text-base"
                >
                  Continue to Payment
                  <i className="fa-solid fa-arrow-right text-sm"></i>
                </button>
              </div>
            )}

            {/* ── STEP 2: PAYMENT ── */}
            {currentStep === "payment" && (
              <div className="bg-gray-800 border border-white/5 rounded-3xl p-6 md:p-8">
                <h2 className="text-xl font-black text-amber-50 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-400/10 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-credit-card text-amber-400 text-sm"></i>
                  </div>
                  Payment Method
                </h2>

                {/* Payment method selector */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    {
                      key: "card",
                      icon: "fa-credit-card",
                      label: "Credit Card",
                    },
                    {
                      key: "cash",
                      icon: "fa-money-bill-wave",
                      label: "Cash on Delivery",
                    },
                    {
                      key: "wallet",
                      icon: "fa-wallet",
                      label: "Digital Wallet",
                    },
                  ].map(({ key, icon, label }) => (
                    <button
                      key={key}
                      onClick={() =>
                        setPaymentForm({ ...paymentForm, method: key as any })
                      }
                      className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition cursor-pointer text-center ${
                        paymentForm.method === key
                          ? "bg-amber-400/10 border-amber-400 text-amber-400"
                          : "border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      <i className={`fa-solid ${icon} text-lg`}></i>
                      <span className="text-xs font-bold leading-tight">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Card Form */}
                {paymentForm.method === "card" && (
                  <div className="space-y-4">
                    {/* Card preview */}
                    <div className="relative bg-linear-to-br from-gray-700 to-gray-900 border border-white/10 rounded-2xl p-5 h-40 overflow-hidden">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
                      <div className="relative">
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-10 h-7 bg-amber-400/80 rounded-md"></div>
                          <i className="fa-brands fa-cc-visa text-2xl text-white/40"></i>
                        </div>
                        <p className="text-white/60 text-sm font-mono tracking-widest mb-2">
                          {paymentForm.cardNumber || "•••• •••• •••• ••••"}
                        </p>
                        <div className="flex justify-between">
                          <p className="text-white/50 text-xs">
                            {paymentForm.cardName || "CARDHOLDER NAME"}
                          </p>
                          <p className="text-white/50 text-xs">
                            {paymentForm.expiry || "MM/YY"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                        Cardholder Name{" "}
                        <span className="text-amber-400">*</span>
                      </label>
                      <input
                        name="cardName"
                        value={paymentForm.cardName}
                        onChange={handlePaymentChange}
                        placeholder="Ahmed Mohamed"
                        className={`w-full bg-gray-700 border ${paymentErrors.cardName ? "border-red-500" : "border-white/10 focus:border-amber-400"} text-amber-50 placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition`}
                      />
                      {paymentErrors.cardName && (
                        <p className="text-red-400 text-xs mt-1">
                          {paymentErrors.cardName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                        Card Number <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          name="cardNumber"
                          value={paymentForm.cardNumber}
                          onChange={handlePaymentChange}
                          placeholder="0000 0000 0000 0000"
                          className={`w-full bg-gray-700 border ${paymentErrors.cardNumber ? "border-red-500" : "border-white/10 focus:border-amber-400"} text-amber-50 placeholder-gray-600 rounded-xl px-4 py-3 pr-14 text-sm outline-none transition font-mono`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                          <i className="fa-brands fa-cc-visa text-gray-500 text-lg"></i>
                          <i className="fa-brands fa-cc-mastercard text-gray-500 text-lg"></i>
                        </div>
                      </div>
                      {paymentErrors.cardNumber && (
                        <p className="text-red-400 text-xs mt-1">
                          {paymentErrors.cardNumber}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                          Expiry Date <span className="text-amber-400">*</span>
                        </label>
                        <input
                          name="expiry"
                          value={paymentForm.expiry}
                          onChange={handlePaymentChange}
                          placeholder="MM/YY"
                          className={`w-full bg-gray-700 border ${paymentErrors.expiry ? "border-red-500" : "border-white/10 focus:border-amber-400"} text-amber-50 placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition font-mono`}
                        />
                        {paymentErrors.expiry && (
                          <p className="text-red-400 text-xs mt-1">
                            {paymentErrors.expiry}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                          CVV <span className="text-amber-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            name="cvv"
                            value={paymentForm.cvv}
                            onChange={handlePaymentChange}
                            placeholder="•••"
                            type="password"
                            className={`w-full bg-gray-700 border ${paymentErrors.cvv ? "border-red-500" : "border-white/10 focus:border-amber-400"} text-amber-50 placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition font-mono`}
                          />
                          <i className="fa-solid fa-circle-question absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm"></i>
                        </div>
                        {paymentErrors.cvv && (
                          <p className="text-red-400 text-xs mt-1">
                            {paymentErrors.cvv}
                          </p>
                        )}
                      </div>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${paymentForm.saveCard ? "bg-amber-400 border-amber-400" : "border-white/20 group-hover:border-amber-400/50"}`}
                        onClick={() =>
                          setPaymentForm({
                            ...paymentForm,
                            saveCard: !paymentForm.saveCard,
                          })
                        }
                      >
                        {paymentForm.saveCard && (
                          <i className="fa-solid fa-check text-gray-900 text-xs"></i>
                        )}
                      </div>
                      <span className="text-gray-400 text-sm group-hover:text-gray-300 transition">
                        Save card for future orders
                      </span>
                    </label>
                  </div>
                )}

                {/* Cash on Delivery */}
                {paymentForm.method === "cash" && (
                  <div className="bg-green-400/5 border border-green-400/20 rounded-2xl p-6 text-center">
                    <i className="fa-solid fa-money-bill-wave text-green-400 text-3xl mb-3 block"></i>
                    <p className="text-amber-50 font-bold mb-1">
                      Pay when you receive your order
                    </p>
                    <p className="text-gray-400 text-sm">
                      Please have the exact amount ready:{" "}
                      <span className="text-amber-400 font-black">
                        ${total.toFixed(2)}
                      </span>
                    </p>
                  </div>
                )}

                {/* Wallet */}
                {paymentForm.method === "wallet" && (
                  <div className="space-y-3">
                    {[
                      {
                        icon: "fa-brands fa-paypal",
                        name: "PayPal",
                        color: "text-blue-400",
                      },
                      {
                        icon: "fa-brands fa-google-pay",
                        name: "Google Pay",
                        color: "text-white",
                      },
                      {
                        icon: "fa-brands fa-apple-pay",
                        name: "Apple Pay",
                        color: "text-white",
                      },
                    ].map(({ icon, name, color }) => (
                      <div
                        key={name}
                        className="flex items-center gap-4 bg-gray-700 border border-white/10 hover:border-amber-400/30 rounded-xl px-5 py-4 cursor-pointer transition"
                      >
                        <i className={`${icon} text-2xl ${color}`}></i>
                        <span className="text-amber-50 font-semibold">
                          {name}
                        </span>
                        <i className="fa-solid fa-arrow-right text-gray-500 text-sm ml-auto"></i>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setCurrentStep("delivery")}
                    className="flex-1 border-2 border-white/10 hover:border-white/20 text-amber-50 font-bold py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-arrow-left text-sm"></i>
                    Back
                  </button>
                  <button
                    onClick={goNext}
                    className="flex-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-black py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Review Order
                    <i className="fa-solid fa-arrow-right text-sm"></i>
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: REVIEW ── */}
            {currentStep === "review" && (
              <div className="space-y-5">
                {/* Delivery summary */}
                <div className="bg-gray-800 border border-white/5 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-amber-50 flex items-center gap-2">
                      <i className="fa-solid fa-location-dot text-amber-400 text-sm"></i>
                      Delivery Details
                    </h3>
                    <button
                      onClick={() => setCurrentStep("delivery")}
                      className="text-amber-400 text-xs font-bold hover:text-amber-300 cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-amber-50 font-semibold">
                      {delivery_form.firstName} {delivery_form.lastName}
                    </p>
                    {delivery_form.method === "delivery" ? (
                      <p className="text-gray-400">
                        {delivery_form.address}
                        {delivery_form.apartment
                          ? `, ${delivery_form.apartment}`
                          : ""}
                        , {delivery_form.city}
                      </p>
                    ) : (
                      <p className="text-gray-400">
                        Store Pickup — 123 Food Street, Cairo
                      </p>
                    )}
                    <p className="text-gray-400">
                      {delivery_form.phone} · {delivery_form.email}
                    </p>
                    {delivery_form.notes && (
                      <p className="text-amber-50/60 italic text-xs mt-1">
                        "{delivery_form.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment summary */}
                <div className="bg-gray-800 border border-white/5 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-amber-50 flex items-center gap-2">
                      <i className="fa-solid fa-credit-card text-amber-400 text-sm"></i>
                      Payment Method
                    </h3>
                    <button
                      onClick={() => setCurrentStep("payment")}
                      className="text-amber-400 text-xs font-bold hover:text-amber-300 cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  {paymentForm.method === "card" && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 bg-gray-700 border border-white/10 rounded-md flex items-center justify-center">
                        <i className="fa-brands fa-cc-visa text-white/50"></i>
                      </div>
                      <div>
                        <p className="text-amber-50 text-sm font-semibold">
                          •••• •••• ••••{" "}
                          {paymentForm.cardNumber.slice(-4) || "0000"}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {paymentForm.cardName}
                        </p>
                      </div>
                    </div>
                  )}
                  {paymentForm.method === "cash" && (
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-money-bill-wave text-green-400 text-xl"></i>
                      <p className="text-amber-50 text-sm font-semibold">
                        Cash on Delivery
                      </p>
                    </div>
                  )}
                  {paymentForm.method === "wallet" && (
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-wallet text-amber-400 text-xl"></i>
                      <p className="text-amber-50 text-sm font-semibold">
                        Digital Wallet
                      </p>
                    </div>
                  )}
                </div>

                {/* Items summary */}
                <div className="bg-gray-800 border border-white/5 rounded-3xl p-6">
                  <h3 className="font-black text-amber-50 mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-utensils text-amber-400 text-sm"></i>
                    Order Items ({cartItems.length})
                  </h3>
                  <ul className="space-y-3">
                    {cartItems.map((item) => (
                      <li key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.src}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-xl shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-amber-50 text-sm font-semibold truncate">
                            {item.name}
                          </p>
                          <p className="text-gray-400 text-xs">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-amber-400 font-bold text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep("payment")}
                    className="flex-1 border-2 border-white/10 hover:border-white/20 text-amber-50 font-bold py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-arrow-left text-sm"></i>
                    Back
                  </button>
                  <button
                    onClick={placeOrder}
                    disabled={loading}
                    className="flex-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-gray-900 font-black py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer text-base"
                  >
                    {loading ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin"></i>
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-lock text-sm"></i>Place Order
                        · ${total.toFixed(2)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
