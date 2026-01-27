
import React, { useEffect, useRef, useState } from 'react';

export const Spinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizes[size]} border-white/10 border-t-[#00f3ff] rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden h-[450px]">
      <div className="skeleton h-[220px] w-full"></div>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="skeleton h-6 w-1/2 rounded-md"></div>
          <div className="skeleton h-6 w-1/4 rounded-md"></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="skeleton h-12 rounded-lg"></div>
          <div className="skeleton h-12 rounded-lg"></div>
          <div className="skeleton h-12 rounded-lg"></div>
        </div>
        <div className="skeleton h-4 w-full rounded-md"></div>
        <div className="skeleton h-4 w-2/3 rounded-md"></div>
      </div>
    </div>
  );
};

export const SkeletonDetails = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
      <div className="skeleton h-6 w-32 rounded mb-8"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="skeleton aspect-video rounded-3xl"></div>
          <div className="flex gap-4 overflow-hidden">
            <div className="skeleton w-24 aspect-square rounded-xl"></div>
            <div className="skeleton w-24 aspect-square rounded-xl"></div>
            <div className="skeleton w-24 aspect-square rounded-xl"></div>
          </div>
        </div>
        <div className="space-y-8">
          <div>
            <div className="skeleton h-4 w-20 rounded mb-4"></div>
            <div className="skeleton h-12 w-3/4 rounded mb-4"></div>
            <div className="skeleton h-8 w-1/3 rounded"></div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="skeleton h-20 rounded-2xl"></div>
            <div className="skeleton h-20 rounded-2xl"></div>
            <div className="skeleton h-20 rounded-2xl"></div>
            <div className="skeleton h-20 rounded-2xl"></div>
          </div>
          <div className="space-y-4">
            <div className="skeleton h-4 w-full rounded"></div>
            <div className="skeleton h-4 w-full rounded"></div>
            <div className="skeleton h-4 w-2/3 rounded"></div>
          </div>
          <div className="flex gap-4">
            <div className="skeleton h-16 flex-1 rounded-2xl"></div>
            <div className="skeleton h-16 flex-1 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
