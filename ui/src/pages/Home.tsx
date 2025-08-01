import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import HeroBanner from "../components/common/HeroBanner";
import HomeSummary from "../components/features/HomeSummary";
import BlogCard from "../components/features/blog/BlogCard";
import TypewriterCode from "../components/features/TypewriterCode";
import { fetchPosts } from "../components/features/sanity/sanityClient";
import { BlogPost } from "../components/features/sanity/types";

export default function Home(): React.ReactElement {
  const [firstPost, setFirstPost] = useState<BlogPost | null>(null);
  const codeText = `// Welcome, curious coder!\nfunction greet(name) {\n  console.log(\`👋 Hi \${name},\nglad you're here!\`);\n}\n// Let's see who's visiting...\nconst visitor = 'awesome guest';\n// Say hello!\ngreet(visitor);\n// Output:\n// 👋 Hi awesome guest, glad you're here!\n// Want to learn, build, and explore?\n// Click the blog card on the left! <-`;

  useEffect(() => {
    fetchPosts().then((posts) => {
      if (posts && posts.length > 0) {
        const sorted = posts.sort(
          (a: BlogPost, b: BlogPost) =>
            new Date(b.publishedAt || b._createdAt || "").getTime() -
            new Date(a.publishedAt || a._createdAt || "").getTime(),
        );
        setFirstPost(sorted[0]);
      }
    });
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <HeroBanner />
      <div
        style={{
          display: "flex",
          gap: 32,
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          minHeight: 400,
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 320,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {firstPost && <BlogCard post={firstPost} />}
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 320,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TypewriterCode code={codeText} />
        </div>
      </div>
      <HomeSummary />
    </Container>
  );
}
