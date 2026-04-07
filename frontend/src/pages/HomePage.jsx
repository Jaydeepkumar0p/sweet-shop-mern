import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useProductStore from '../store/productStore'
import ProductCard from '../components/common/ProductCard'
import { ProductSkeleton } from '../components/common/Loader'
import { FiArrowRight, FiStar, FiTruck, FiShield, FiAward } from 'react-icons/fi'

const CATEGORIES = [
  { name: 'Chocolates', emoji: '🍫', bg: 'from-amber-50 to-yellow-50',   border: 'border-amber-200' },
  { name: 'Mithai',     emoji: '🪔', bg: 'from-orange-50 to-red-50',     border: 'border-orange-200' },
  { name: 'Cakes',      emoji: '🎂', bg: 'from-pink-50 to-rose-50',      border: 'border-pink-200' },
  { name: 'Cookies',    emoji: '🍪', bg: 'from-amber-50 to-orange-50',   border: 'border-amber-200' },
  { name: 'Candies',    emoji: '🍭', bg: 'from-purple-50 to-pink-50',    border: 'border-purple-200' },
  { name: 'Ice Cream',  emoji: '🍦', bg: 'from-blue-50 to-cyan-50',      border: 'border-blue-200' },
  { name: 'Dry Fruits', emoji: '🥜', bg: 'from-green-50 to-emerald-50',  border: 'border-green-200' },
  { name: 'Gift Boxes', emoji: '🎁', bg: 'from-pink-50 to-fuchsia-50',   border: 'border-pink-200' },
]

const TESTIMONIALS = [
  { name: 'Priya Sharma', city: 'Delhi',   rating: 5, text: 'The gulab jamuns were divine! Perfectly sweet, delivered fresh.', avatar: '👩' },
  { name: 'Rahul Mehta',  city: 'Mumbai',  rating: 5, text: 'Best online mithai shop! Just like homemade. Will order again!',  avatar: '👨' },
  { name: 'Anjali Verma', city: 'Jaipur',  rating: 5, text: 'Ordered a gift box for Diwali – absolutely stunning!',            avatar: '👩' },
  { name: 'Vikram Singh', city: 'Chennai', rating: 4, text: 'Amazing chocolates. The Belgian box was a hit at the party.',     avatar: '👨' },
]

export default function HomePage() {
  const { featured, bestSellers, fetchFeatured, fetchBestSellers, loading } = useProductStore()

  useEffect(() => {
    fetchFeatured()
    fetchBestSellers()
  }, [])

  return (
    <div className="page-enter">

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-1.5 rounded-full text-sm font-medium">
                🎉 Free delivery on orders above ₹499
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                India's Sweetest<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-700">Online Shop</span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                From classic mithai to artisan chocolates — discover thousands of handcrafted sweets made with love.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/products" className="btn-primary flex items-center gap-2 text-base py-3 px-7">
                  Shop Now <FiArrowRight size={18}/>
                </Link>
                <Link to="/register" className="btn-outline flex items-center gap-2 text-base py-3 px-7">
                  Sell with Us
                </Link>
              </div>
              <div className="flex gap-8 pt-2">
                {[['10k+','Happy Buyers'],['500+','Varieties'],['50+','Sellers']].map(([n,l]) => (
                  <div key={l}>
                    <p className="font-display font-bold text-2xl text-pink-600">{n}</p>
                    <p className="text-xs text-gray-500">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center animate-float">
              <div className="relative">
                <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-pink-200/60 to-pink-300/40 flex items-center justify-center">
                  <span className="text-8xl md:text-9xl filter drop-shadow-lg">🍬</span>
                </div>
                {[{e:'🍫',p:'top-4 right-4',d:'0s'},{e:'🎂',p:'bottom-8 left-4',d:'0.5s'},{e:'🍪',p:'top-16 left-0',d:'1s'},{e:'🍭',p:'bottom-4 right-8',d:'1.5s'}].map(({e,p,d})=>(
                  <div key={e} className={`absolute ${p} text-3xl animate-float bg-white rounded-full p-3 shadow-pink-sm`} style={{animationDelay:d}}>{e}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-y border-pink-100 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4">
            {[{icon:FiTruck,l:'Free Delivery',s:'Orders ₹499+'},{icon:FiShield,l:'100% Secure',s:'Safe payments'},{icon:FiAward,l:'Best Quality',s:'Fresh always'}].map(({icon:I,l,s})=>(
              <div key={l} className="flex items-center gap-3 justify-center">
                <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center shrink-0">
                  <I size={18} className="text-pink-500"/>
                </div>
                <div className="hidden sm:block">
                  <p className="font-semibold text-gray-800 text-sm">{l}</p>
                  <p className="text-gray-500 text-xs">{s}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-soft-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle mb-10">Find your favourite sweet treats</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map(({name,emoji,bg,border})=>(
              <Link key={name} to={`/products?category=${name}`}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br ${bg} border ${border} hover:shadow-pink-sm hover:-translate-y-1 transition-all duration-200 group`}>
                <span className="text-3xl group-hover:scale-110 transition-transform">{emoji}</span>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-gray-800">Featured Sweets</h2>
              <p className="text-gray-500 mt-1">Handpicked by our experts</p>
            </div>
            <Link to="/products" className="btn-ghost flex items-center gap-1 text-sm">View All <FiArrowRight size={14}/></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {loading
              ? Array(8).fill(0).map((_,i) => <ProductSkeleton key={i}/>)
              : featured.length > 0
                ? featured.map(p => <ProductCard key={p._id} product={p}/>)
                : <div className="col-span-4 text-center py-16 text-gray-400">
                    <p className="text-5xl mb-3">🍬</p>
                    <p className="mb-4">No featured sweets yet!</p>
                    <Link to="/products" className="btn-primary inline-flex">Browse All Sweets</Link>
                  </div>
            }
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="py-16 bg-hero-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-display text-3xl font-bold text-gray-800">🏆 Best Sellers</h2>
                <p className="text-gray-500 mt-1">Our most popular sweets</p>
              </div>
              <Link to="/products" className="btn-ghost flex items-center gap-1 text-sm">View All <FiArrowRight size={14}/></Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {bestSellers.map(p => <ProductCard key={p._id} product={p}/>)}
            </div>
          </div>
        </section>
      )}

      {/* Seller CTA Banner */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-pink-600 to-rose-600 p-10 md:p-16 text-white text-center">
            <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/10 rounded-full blur-2xl"/>
            <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-white/10 rounded-full blur-2xl"/>
            <div className="relative z-10">
              <p className="text-4xl mb-4">🎁</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Are you a Sweet Maker?</h2>
              <p className="text-pink-100 text-lg mb-8 max-w-lg mx-auto">Join thousands of sellers and reach millions of sweet lovers across India.</p>
              <Link to="/register" className="inline-flex items-center gap-2 bg-white text-pink-600 font-semibold px-8 py-3.5 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Start Selling Today <FiArrowRight size={18}/>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-soft-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle mb-10">Real reviews from happy sweet lovers 💕</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t,i) => (
              <div key={i} className="card p-6 space-y-3">
                <div className="flex gap-0.5">
                  {Array(t.rating).fill(0).map((_,s) => <FiStar key={s} size={14} className="text-amber-400 fill-amber-400"/>)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-lg">{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
