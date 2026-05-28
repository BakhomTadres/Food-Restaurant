import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-amber-400 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-utensils text-gray-900 text-sm"></i>
              </div>
              <span className="text-2xl font-black text-amber-50">
                Food<span className="text-amber-400">.</span>
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-xs mb-6">
              Fresh ingredients, great taste, and love in every dish. Serving our community since 2018.
            </p>
            <div className="flex gap-3">
              {[
                { icon: "fa-brands fa-instagram", href: "#" },
                { icon: "fa-brands fa-facebook", href: "#" },
                { icon: "fa-brands fa-tiktok", href: "#" },
                { icon: "fa-brands fa-whatsapp", href: "#" },
              ].map(({ icon, href }) => (
                <a
                  key={icon}
                  href={href}
                  className="w-9 h-9 bg-gray-800 hover:bg-amber-400 border border-white/5 hover:border-transparent text-gray-400 hover:text-gray-900 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer"
                >
                  <i className={`${icon} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-amber-50 font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "Menu", "About", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    onClick={() => navigate(item === "Home" ? "/" : `/${item.toLowerCase()}`)}
                    className="text-gray-400 hover:text-amber-400 text-sm cursor-pointer transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-amber-50 font-bold mb-4">Contact</h4>
            <ul className="space-y-3">
              {[
                { icon: "fa-location-dot", text: "123 Food Street, Cairo" },
                { icon: "fa-phone", text: "+20 100 000 0000" },
                { icon: "fa-envelope", text: "hello@food.com" },
                { icon: "fa-clock", text: "Daily 9am – 11pm" },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-2 text-gray-400 text-sm">
                  <i className={`fa-solid ${icon} text-amber-400 mt-0.5 w-4 shrink-0`}></i>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {year} Food Restaurant. All rights reserved.
          </p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <a key={item} href="#" className="text-gray-500 hover:text-amber-400 text-sm transition cursor-pointer">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}