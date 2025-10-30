import React from "react";
import { useMapStore } from "../context/StateContext";

const StoreList: React.FC = () => {
  const { stores, focusStore } = useMapStore();

  return (
    <div className="lg:w-1/3 bg-gray-100 p-4 rounded-xl shadow-lg h-[60vh] lg:h-[70vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2 text-center">
        店舗一覧
      </h2>
      {stores.length === 0 ? (
        <p className="text-gray-500 italic">店舗データがありません。</p>
      ) : (
        stores.map(store => (
          <div
            key={store.id}
            className="p-3 mb-2 border border-gray-100 bg-white rounded-lg hover:bg-blue-50 hover:border-blue-200 cursor-pointer"
            onClick={() => focusStore(store)}
          >
            <h3 className="font-bold text-lg text-blue-600">{store.name}</h3>
            <p className="text-sm text-gray-500">{store.address}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default StoreList;
