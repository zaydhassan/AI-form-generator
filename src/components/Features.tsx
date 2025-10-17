const features = [
  {
    title: 'AI-Powered Form Generation',
    description:
      'Simply describe your form in natural language, and AI creates a structured form schema instantly.',
    icon: (
      <svg
        className="w-10 h-10 text-primary"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 20v-6M16 20v-4M8 20v-2M12 4a8 8 0 0 1 8 8v0M4 12a8 8 0 0 1 8-8v0" />
      </svg>
    ),
  },
  {
    title: 'Cloudinary Image Uploads',
    description:
      'Effortlessly upload and store images securely using Cloudinary integration.',
    icon: (
      <svg
        className="w-10 h-10 text-primary"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M4 16v-4M20 8v4M8 12h8" />
      </svg>
    ),
  },
  {
    title: 'Dynamic Public Links',
    description:
      'Share forms easily with dynamic, public URLs for fast and responsive user submissions.',
    icon: (
      <svg
        className="w-10 h-10 text-primary"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M18 8v8M6 8v8" />
      </svg>
    ),
  },
  {
    title: 'User Dashboard & Analytics',
    description:
      'Monitor submissions and manage forms from a clean, modern dashboard interface.',
    icon: (
      <svg
        className="w-10 h-10 text-primary"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
]

export default function Features() {
  return (
    <section className="max-w-6xl mx-auto my-20 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      {features.map(({ title, description, icon }, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-6 shadow-md flex flex-col items-center text-center space-y-4"
        >
          {icon}
          <h3 className="text-xl font-semibold text-primary font-poppins">
            {title}
          </h3>
          <p className="text-gray-600 font-inter">{description}</p>
        </div>
      ))}
    </section>
  )
}