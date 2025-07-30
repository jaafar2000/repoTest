export default function Home() {
  return (
    <div className="px-4 py-12 max-w-4xl mx-auto text-gray-200">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-white">
        Welcome to the Full-Stack Blog Template
      </h1>
      <div className="bg-gray-900 p-6 rounded-lg flex flex-col items-center">
        <img
          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80"
          alt="Blog Illustration"
          className="rounded-lg h-96 w-full object-cover mb-6"
        />
        <div>
          <p className="mb-4">
            This project is a powerful full-stack blog template built with
            Next.js 15 and the App Router for maximum performance and
            scalability.
          </p>
          <p className="mb-4">
            We've integrated Clerk for secure user authentication and MongoDB
            for flexible, schema-less data storage.
          </p>
          <p className="mb-4">
            Posts are managed through a dynamic API, and TailwindCSS is used for
            rapid UI development in dark mode.
          </p>
          <p className="mb-4">
            This starter is ideal for building personal blogs, developer
            portfolios, or content platforms.
          </p>
          <p className="mb-4">
            Check out the official docs for each technology to dive deeper:
          </p>
          <ul className="mb-4 space-y-2">
            <li>
              <a
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-400 hover:underline"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
                </svg>
                Next.js Documentation
              </a>
            </li>
            <li>
              <a
                href="https://clerk.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-400 hover:underline"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
                </svg>
                Clerk Authentication
              </a>
            </li>
            <li>
              <a
                href="https://www.mongodb.com/docs/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-400 hover:underline"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
                </svg>
                MongoDB Documentation
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
