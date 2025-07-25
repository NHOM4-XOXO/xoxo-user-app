"use client";

import React from "react";
import StoreCard from "../../components/StoreCard";
import marketPlaceData from "../../data/dataMarketPlace";

export default function MarketPlacePage() {
  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-black py-10 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Cửa hàng nổi bật tại Xo Social
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
          {marketPlaceData.map((store) => (
            <StoreCard
              key={store.id}
              name={store.store}
              avatar="/image/macbook.webp"
              cover="/image/local-store.png"
              follower={12345}
              isVerified={true}
            />
          ))}
        </div>
      </div>
    </>
  );
}
