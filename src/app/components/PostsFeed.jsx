"use client";
import Post from "./Post";
const PostsFeed = ({ posts = [], onPostDeleted }) => {
  return (
    <div className="">
      {posts.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">No posts found.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id + post.createdAt}
            className=" relative border-b border-[#2e3235] p-4 hover:bg-[#20232756] transition duration-200"
          >
            {/* User Info */}
  
              <Post post={post} onPostDeleted={onPostDeleted} />
            
          </div>
        ))
      )}
    </div>
  );
};

export default PostsFeed;
