"use client";

import Navbar from "@/components/layout/navbar";
import { useFetchNews } from "@/hooks/queries";
import { format } from "date-fns";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Home() {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const {
    data: news,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useFetchNews();

  useEffect(() => {
    const target = loaderRef.current;
  
    if (!target) return;
  
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );
  
    observer.observe(target);
  
    return () => {
      observer.unobserve(target);
    };
  }, [fetchNextPage, hasNextPage]);
  

  if (isLoading) return <p className="text-center mt-10">Loading news...</p>;
  if (isError) return <p className="text-center mt-10 text-red-500">Failed to load news.</p>;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-10 pt-24">
        <section className="max-w-5xl mx-auto px-4 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {news?.pages.map((page) =>
            page.data.map((article) => (
              <a
                key={article.uuid}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative w-full aspect-video">
                  <Image
                    src={article.image_url}
                    alt={article.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-indigo-700">
                    {article.title}
                  </h3>
                  <p className="text-gray-700 mt-2 text-sm line-clamp-3">
                    {article.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-auto pt-4">
                    {format(new Date(article.published_at), "d MMMM yyyy, h:mm a")}
                  </p>
                </div>
              </a>
            ))
          )}
        </section>
        <div ref={loaderRef} className="mt-10 text-center">
          {isFetchingNextPage && <p>Loading more...</p>}
          {!hasNextPage && <p>No more news available.</p>}
        </div>

      </main>
    </>
  );
}
