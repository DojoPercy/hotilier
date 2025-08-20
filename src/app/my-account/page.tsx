import { auth0 } from "@/lib/auth0";


export default async function Home() {
  // Fetch the user session
  const session = await auth0.getSession();

  // If no session, show sign-up and login buttons
  if (!session) {
    return (
      <main>
        <a href="/auth/login?screen_hint=signup">
          <button>Sign up</button>
        </a>
        <a href="/auth/login">
          <button>Log in</button>
        </a>
      </main>
    );
  }

  // If session exists, show a welcome message and logout button
  return (
    <main>
      {!session ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#1E212A] mb-8">
            Welcome to Energy Nexus
          </h1>
          <p className="text-lg text-[#65676E] mb-8">
            Your premier source for energy industry insights and analysis
          </p>
          <div className="space-x-4">
            <a href="/auth/login?screen_hint=signup">
              <button className="bg-[#635DFF] text-white px-6 py-3 rounded-md font-medium hover:bg-[#262262] transition-colors duration-200">
                Sign up
              </button>
            </a>
            <a href="/auth/login">
              <button className="bg-white text-[#635DFF] border border-[#635DFF] px-6 py-3 rounded-md font-medium hover:bg-[#F4F4F7] transition-colors duration-200">
                Log in
              </button>
            </a>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#1E212A] mb-4">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-lg text-[#65676E] mb-8">
            Explore the latest energy industry insights and analysis
          </p>
          <div className="space-x-4">
            <a href="/articles">
              <button className="bg-[#635DFF] text-white px-6 py-3 rounded-md font-medium hover:bg-[#262262] transition-colors duration-200">
                Browse Articles
              </button>
            </a>
            <a href="/auth/logout">
              <button className="bg-white text-[#D03C38] border border-[#D03C38] px-6 py-3 rounded-md font-medium hover:bg-[#F4F4F7] transition-colors duration-200">
                Log out
              </button>
            </a>
          </div>
        </div>
      )}
    </main>
  );
}