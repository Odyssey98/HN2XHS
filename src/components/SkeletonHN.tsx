import React from 'react';

const SkeletonHN: React.FC = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
      <div className="animate-pulse">
        {/* 图片占位符 */}
        <div className="h-48 bg-gray-300"></div>

        <div className="p-5">
          {/* 标题占位符 */}
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>

          {/* 作者信息占位符 */}
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>

          {/* 标签和点赞占位符 */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <div className="h-6 bg-gray-300 rounded-full w-12"></div>
              <div className="h-6 bg-gray-300 rounded-full w-12"></div>
            </div>
            <div className="h-4 bg-gray-300 rounded w-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonHN;
