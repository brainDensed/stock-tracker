"use client"

import Navbar from "@/components/layout/navbar";
import { useFetchNews } from "@/hooks/queries";
import { format } from "date-fns";
import Image from "next/image";

export default function Home() {
  const { data: news, isLoading, isError } = useFetchNews();
  if (isLoading) return <p className="text-center mt-10">Loading news...</p>;
  if (isError) return <p className="text-center mt-10 text-red-500">Failed to load news.</p>;

  console.log("news", news?.data);
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
        <section className="max-w-4xl mx-auto px-4">
          <div className="grid gap-6">
            {news?.data?.map((article) => (
              <a
                key={article.uuid}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition"
              >
                <Image src={article.image_url} alt={article.title} className="w-full h-48 object-cover" unoptimized />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-indigo-600">{article.title}</h3>
                  <p className="text-gray-700 mt-2">{article.description}</p>
                  <p className="text-sm text-gray-400 mt-2">{format(new Date(article.published_at), 'd MMMM yyyy, h:mm a')}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
