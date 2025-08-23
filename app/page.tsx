// This function fetches the data from your WordPress backend.
async function getPosts() {
  // This uses the environment variable we'll set up in Vercel.
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  if (!apiUrl) {
    throw new Error("WordPress API URL is not configured.");
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query GetPostsWithSubtitle {
          posts {
            nodes {
              title
              postFields {
                subtitle
              }
            }
          }
        }
      `,
    }),
    // This tells Next.js to get fresh data every 10 seconds
    next: { revalidate: 10 }, 
  });

  if (!response.ok) {
    throw new Error('Failed to fetch posts from WordPress.');
  }

  const json = await response.json();
  return json.data.posts.nodes;
}

// This is your main page component.
export default async function HomePage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">My Headless Blog</h1>
        <p className="text-gray-600 mb-8">This content is being pulled live from WordPress!</p>
        
        {/* We loop through the posts and display each one. */}
        {posts.map((post: any) => (
          <article key={post.title} className="border-t py-6">
            <h2 className="text-2xl font-semibold text-gray-800">{post.title}</h2>
            <p className="text-gray-500 italic mt-1">{post.postFields?.subtitle || 'No subtitle provided.'}</p>
          </article>
        ))}
      </div>
    </main>
  );
}