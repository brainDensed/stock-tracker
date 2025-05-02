"use client";

import Navbar from "@/components/layout/navbar";
import { useFetchNews } from "@/hooks/queries";
import { format } from "date-fns";
import Image from "next/image";

export default function Home() {
  const { data: news, isLoading, isError } = useFetchNews();
  if (isLoading) return <p className="text-center mt-10">Loading news...</p>;
  if (isError) return <p className="text-center mt-10 text-red-500">Failed to load news.</p>;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-10">
        <section className="max-w-5xl mx-auto px-4 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {news?.data?.map((article) => (
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
                <h3 className="text-lg font-semibold text-indigo-700">{article.title}</h3>
                <p className="text-gray-700 mt-2 text-sm line-clamp-3">{article.description}</p>
                <p className="text-xs text-gray-500 mt-auto pt-4">
                  {format(new Date(article.published_at), "d MMMM yyyy, h:mm a")}
                </p>
              </div>
            </a>
          ))}
        </section>
      </main>
    </>
  );
}
