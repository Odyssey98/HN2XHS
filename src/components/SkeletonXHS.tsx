import React from 'react';

const SkeletonXHS = () => {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-2">
      <main className="w-full max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
        <div className="p-3 lg:p-4 flex flex-col">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full mr-2 bg-gray-200"></div>
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-3 w-20 bg-gray-200 rounded mt-1"></div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 mb-2 lg:mb-0 lg:mr-3 flex-shrink-0">
              <div className="relative w-full h-0 pb-[75%]">
                <div className="absolute inset-0 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
            <div className="lg:w-1/2 flex flex-col">
              <div className="overflow-y-auto max-h-[250px]">
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2 mb-2">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="h-6 w-16 bg-gray-200 rounded-full"></div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-1">
            <div className="flex items-center">
              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              <div className="h-4 w-16 bg-gray-200 rounded ml-3"></div>
            </div>
            <div className="flex gap-3">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="h-4 w-8 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SkeletonXHS;

