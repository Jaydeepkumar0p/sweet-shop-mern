import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      {/* Top wave */}
      <div className="h-1 bg-gradient-to-r from-pink-300 via-pink-500 to-pink-300" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍬</span>
              <span className="font-display font-bold text-xl text-white">
                Sweet<span className="text-pink-400">Shop</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              India's most loved online sweet shop. Premium quality mithai, chocolates & more delivered fresh to your door.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-500 hover:text-white text-gray-400 transition-all duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {[['Home','/'],[' Sweets','/products'],['Login','/login'],['Register','/register']].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-1.5">
                    <span className="text-pink-500 text-xs">›</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2.5">
              {['Chocolates','Mithai','Cakes','Cookies','Candies','Gift Boxes'].map(cat => (
                <li key={cat}>
                  <Link to={`/products?category=${cat}`} className="text-sm text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-1.5">
                    <span className="text-pink-500 text-xs">›</span> {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <FiMapPin size={15} className="text-pink-400 mt-0.5 shrink-0" />
                <span>123 Sweet Lane, Darpan green, chandigarh karhar – 140301</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FiPhone size={15} className="text-pink-400 shrink-0" />
                <span>+91 9142803194</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FiMail size={15} className="text-pink-400 shrink-0" />
                <span>jaydeepkumar9310@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} SweetShop. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Payments secured by</span>
            <span className="text-pink-400 font-semibold">Stripe</span>
            <span>&amp;</span>
            <span className="text-pink-400 font-semibold">COD</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
