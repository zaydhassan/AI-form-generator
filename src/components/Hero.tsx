import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden py-20 px-4 sm:px-8 flex flex-col items-center justify-center min-h-[600px] max-w-7xl mx-auto">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 w-[60%] h-[440px] bg-gradient-to-tr from-indigo-50 via-purple-100 to-transparent blur-2xl rounded-3xl"></div>
        <div className="absolute right-0 bottom-0 w-[50%] h-[400px] bg-gradient-to-br from-[#6d28d9]/20 via-[#7429f5]/10 to-transparent blur-2xl rounded-full"></div>
      </div>

      <div className="glass-card w-full max-w-3xl mx-auto p-8 rounded-3xl shadow-2xl border border-gray-100 backdrop-blur-md text-center z-10">
        <span className="inline-block mb-5">
          <Image src="/ai.png" alt="AI" width={48} height={48} />
        </span>
        <h1 className="text-5xl font-extrabold mb-6 text-[#7429f5] tracking-tight leading-tight font-sora">
          Generate Dynamic AI-Powered Forms Instantly
        </h1>
        <p className="text-lg sm:text-xl mb-8 text-gray-700 font-inter max-w-2xl mx-auto">
          Create, share, and manage fully responsive forms with AI-driven schema generation, image uploads, and powerful analytics—all presented in a sleek dashboard.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-[#7429f5] to-[#6d28d9] text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:scale-[1.04] hover:opacity-90 active:scale-[.98] transition"
        >
          <span className="text-2xl">✨</span>
          Generate your first AI form
        </Link>
      </div>

      <div className="mt-16 flex justify-center w-full">
        <div className="overflow-hidden rounded-2xl shadow-xl border border-gray-100 bg-white/80 backdrop-blur-lg p-2">
          <Image
            src="/hero.jpg"
            alt="App mockup"
            width={1040}
            height={420}
            priority
            className="rounded-xl border object-cover"
          />
        </div>
      </div>
    </section>
  )
}
