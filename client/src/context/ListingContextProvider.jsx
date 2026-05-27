import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { UseApi } from "./UseApi";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

export const ListingContext = createContext(null);

export const useListing = () => useContext(ListingContext);

const ListingContextProvider = ({ children }) => {

  const api = UseApi();

  const [listings, setListings] = useState([]);

  const getAllListings = useCallback(async () => {
    try {
      const {data} = await api.get("/listing/all-listings");
      if (data) {
        setListings(data);
        console.log(data)
      }
    } catch (error) {
      toast.error("fetching listing error");
      console.log("fetching listing Error", error);
    }
  }, []);

  const getListingDetail = useCallback(async (id) => {
    try {
      console.log(id)
      const {data} = await api.get("/listing/detail", { params:{id} });
      
      if (data.listing) {
        console.log(data)
        return data.listing;
      } else {
        return {};
      }
    } catch (error) {
      toast.error("fetching listing detail error");
      console.log("fetching listing detail Error", error);
    }
  }, []);

  const addNewListing = useCallback(async (formData) => {
    try {
      const res = await api.post("/listing/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res);
      // if (data) {
      //   setListings((p) => ([...p,data]))
      // }
      // console.log(data)
    } catch (error) {}
  }, []);

  const editListing = useCallback(async (formData) => {
    try {
      const { data } = await api.post("/listing/edit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.listing) {
        setListings(prev => prev.map(l => l._id === data.listing._id?data.listing :l));
      }
    } catch (error) {}
  }, []);

  const bookListing = useCallback(async (formData) => {
    try {
      const result = await api.post("/listing/booked", formData);
      console.log(result)
      if (result) {
        return result.data;
      } else {
        return {};
      }
    } catch (error) {}
  }, []);

  const getMyBookings = useCallback(async () => {
    try {
      const {data} = await api.get("/listing/my-bookings");
      if (data.bookings.length > 0) {
        return data.bookings;
      }else{
        return []
      }
    } catch (error) {
      toast.error("fetching booking error");
      console.log("fetching booking Error", error);
    }
  }, []);

  useEffect(() => {
    getAllListings();
  }, []);
  const values = useMemo(
    () => ({
      getAllListings,
      getListingDetail,
      listings,
      addNewListing,
      editListing,
      bookListing,
      getMyBookings
    }),
    [
      getAllListings,
      getListingDetail,
      listings,
      getMyBookings,
      addNewListing,
      editListing,
      bookListing,
    ],
  );
  return (
    <ListingContext.Provider value={values}>{children}</ListingContext.Provider>
  );
};

export default ListingContextProvider;
