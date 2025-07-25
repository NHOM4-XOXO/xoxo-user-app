"use client";
import Image from "next/image";

const MarketPlaceCard = ({ product }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden w-full sm:w-64">
      <Image
        src={product.image}
        alt={product.title}
        width={400}
        height={300}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-md font-semibold dark:text-white">
          {product.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          {product.store}
        </p>
        <p className="text-red-500 font-bold mt-1">{product.price}</p>
        <p className="text-xs text-gray-400 dark:text-gray-400">
          {product.location}
        </p>
      </div>
    </div>
  );
};

export default MarketPlaceCard;
