"use client";
import Head from "next/head";


export default function Home() {

  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
  };
  return (
    <div className="">
      <div>
        <Head>
          <title>Comments Page</title>
        </Head>

        <div className="p-12">
          <h1 className="text-2xl font-bold">Comments!</h1>
          <form onSubmit={handleSubmit} className="mt-8 flex gap-8">
            <input
              type="text"
              placeholder="Add a comment"
              className="p-2 border-b focus:border-b-gray-700 w-full outline-none"
            />
            <button className="px-4 py-2 bg-green-500 rounded-lg text-white">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
