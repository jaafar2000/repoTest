const fetchTrending = async () => {
  try {
    const res = await fetch("https://api.first.org/data/v1/news");
    if (!res.ok) throw new Error("Failed to fetch trending news");
    const json = await res.json();
    const newArr = json.data.slice(54, 57).map((item) => ({
      title: item.title,
      url: item.link,
      subreddit: "news",
    }));
    return newArr;
  } catch (err) {
    console.error("Failed to fetch trending:", err);
    return [];
  }
};


export default fetchTrending