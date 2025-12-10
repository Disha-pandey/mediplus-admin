import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem('aToken') ? localStorage.getItem('aToken') : ''
  );
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  console.log("Backend URL:", backendUrl);
  console.log("Admin Token:", aToken);

  const getAllDoctors = async () => {
    try {
      console.log("Calling API to fetch all doctors...");

      const { data } = await axios.post(
        backendUrl + "/api/admin/all-doctors",
        {},
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );

      console.log("API Response:", data);

      if (data.success) {
        setDoctors(data.doctors);
        console.log("Doctors Array:", data.doctors);
      } else {
        toast.error(data.message);
        console.error("API Error Message:", data.message);
      }
    } catch (error) {
      toast.error("API call failed: " + error.message);
      console.error("Catch Error:", error);
    }
  };

  // const changeAvailability = async (docId) => {
  //   try {
  //     const { data } = await axios.post(
  //       backendUrl + '/api/admin/change-availability',
  //       { docId },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${aToken}`,
  //         },
  //       }
  //     );

  //     if (data.success) {
  //       toast.success(data.message);
  //       getAllDoctors();
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };
  const changeAvailability = async (docId, newAvailability) => {
  try {
    const { data } = await axios.post(
      backendUrl + '/api/admin/change-availability',
      { docId, available: newAvailability }, // ✅ send target value
      {
        headers: {
          Authorization: `Bearer ${aToken}`,
        },
      }
    );

    if (data.success) {
      toast.success(data.message);
      getAllDoctors();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};


  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + '/api/admin/appointments',
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );

      if (data.success) {
        setAppointments(data.appointments);
        console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("aToken");
    setAToken("");
    console.log("Logged out, token removed");
    setDashData(false);
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/cancel-appointment`,
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + '/api/admin/dashboard',
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );

      if (data.success) {
        setDashData(data.dashData);
        console.log("dashData returned:", data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch dashboard data");
      console.error("Dashboard Fetch Error:", error);
    }
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData,
    getDashData,
    logout,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
