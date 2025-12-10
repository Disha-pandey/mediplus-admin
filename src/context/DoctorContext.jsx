import { useState, useEffect, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") || ""
  );
  const [appointments, setAppointments] = useState([]);
  const [dashData,setDashData]=useState(false)
  const [profileData,setProfileData]=useState(false)

  useEffect(() => {
    if (dToken) {
      localStorage.setItem("dToken", dToken);
    }
  }, [dToken]);

  const getAppointments = async () => {
    if (!dToken) {
      toast.error("Please login again. Token missing.");
      return;
    }

    console.log("Sending token:", dToken);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/appointments`,
        { headers: { Authorization: `Bearer ${dToken}` } }
      );
      console.log("Fetched Appointments:", data);
      if (data.success) {
        setAppointments([...data.appointments]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("API error:", error);
      toast.error("Failed to fetch appointments");
    }
  };

  const logoutDoctor = () => {
    setDToken("");
    localStorage.removeItem("dToken");
    toast.success("Logged out successfully");
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${dToken}` } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${dToken}` } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const getDashData=async (params) => {
    console.log("Requesting dashboard:", backendUrl + '/api/doctor/dashboard');

    try{
        const {data}=await axios.get(backendUrl+'/api/doctor/dashboard', { headers: { Authorization: `Bearer ${dToken}` } })
   if(data.success){
    setDashData(data.dashData)
    console.log(data.dashData)
   }
   else{
    toast.error(data.message)
   }
    }
    catch(error){
          console.log(error);
      toast.error(error.message);
    }
  }
   const getProfileData =async (params) => {
    try{
        const {data}=await axios.get(backendUrl+'/api/doctor/profile', { headers: { Authorization: `Bearer ${dToken}` } })
        if(data.success){
            setProfileData(data.profileData)
            console.log(data.profileData)
        }
    }
    catch(error){
          console.log(error);
      toast.error(error.message);
    }
   }




  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    setAppointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,setDashData,getDashData,
    profileData,setProfileData,getProfileData,
    logoutDoctor,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
