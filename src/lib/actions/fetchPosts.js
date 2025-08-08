export const fetchPosts = async () => {
  try {
    const response = await fetch("/api/posts");
    if (!response.ok) throw new Error("Failed to fetch posts ");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching posts:", err.message);
  }
};

