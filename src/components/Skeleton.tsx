import React from 'react';

const Skeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 mb-4 md:mb-0 md:mr-4">
          <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
        </div>
        <div className="md:w-1/2">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="flex flex-wrap gap-2 mb-4">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="h-6 bg-gray-200 rounded-full w-16"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
