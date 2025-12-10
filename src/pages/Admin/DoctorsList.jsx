import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold text-indigo-700 mb-6 text-center">All Doctors</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {doctors
          .filter((item) => item && item._id) // ✅ Only render valid doctors
          .map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm text-center p-4 cursor-pointer group hover:shadow-md hover:border-indigo-500 transition-all duration-300"
            >
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-100 group-hover:bg-blue-500 transition-all duration-300 flex items-center justify-center">
                <img
                  src={item?.image || "/default-doctor.png"}
                  alt={item?.name || "Doctor"}
                  className="w-20 h-20 object-cover rounded-full"
                />
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mt-4">
                {item?.name || "Unnamed Doctor"}
              </h3>
              <p className="text-sm text-gray-500">{item?.speciality || "Unknown speciality"}</p>

              <div className="mt-3 flex items-center justify-center gap-2">
               <input
  type="checkbox"
  checked={item?.available || false}
  onChange={() => changeAvailability(item._id, !item.available)}
  className="accent-blue-500 w-4 h-4"
/>

                <label className="text-sm text-gray-700">Available</label>
              </div>

              <button className="mt-3 px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-all">
                View Profile
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DoctorsList;
