import React from "react";

const NewsletterSignup = () => {
  return (
    <section className="bg-gray-100 py-6 px-6 rounded-lg w-full md:w-[90%] mx-auto my-20">
      <div className="flex flex-col md:flex-row justify-between items-center">
        {/* Left Section */}
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-semibold text-gray-800">Join Our Newsletter</h3>
          <p className="text-gray-500 text-sm">We’ll send you a nice letter once per week. No spam.</p>
        </div>

        {/* Right Section - Email Input */}
        <form className="flex items-center w-full md:w-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-64"
          />
          <button
            type="submit"
            className="bg-[#19417D] text-white px-4 py-2 ml-2 rounded-md text-sm hover:bg-blue-700 transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSignup;