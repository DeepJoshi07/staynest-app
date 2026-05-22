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

export const ListingContext = createContext(null);

export const useListing = () => useContext(ListingContext);

const ListingContextProvider = ({ children }) => {
  const api = UseApi();

  const [listings, setListings] = useState([]);

  const getAllListings = useCallback(async () => {
    try {
      const data = await api.get("/listing/all-listings");
      if (data) {
        setListings(data.data);
      }
    } catch (error) {
      toast.error("fetching listing error");
      console.log("fetching listing Error", error);
    }
  }, []);

  const getListingDetail = useCallback(async (id) => {
    try {
      const data = await api.post("/listing/detail", { id });
      if (data) {
        return data.data;
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
      const result = await api.post("/listing/add", formData);
      if (result) {
        return result.data;
      } else {
        return {};
      }
    } catch (error) {}
  }, []);

  const editListing = useCallback(async (formData) => {
    try {
      const data = await api.post("/listing/edit", formData);
      if (result) {
        return result.data;
      } else {
        return {};
      }
    } catch (error) {}
  }, []);

  const bookListing = useCallback(async (formData) => {
    try {
      console.log(formData);
      return;
      const result = await api.post("/listing/booked", formData);
      if (result) {
        return result.data;
      } else {
        return {};
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    getAllListings();
  }, []);
  const values = useMemo(
    () => ({
      getAllListings,
      listings,
      addNewListing,
      editListing,
      bookListing,
    }),
    [getAllListings, listings, addNewListing, editListing, bookListing],
  );
  return (
    <ListingContext.Provider value={values}>{children}</ListingContext.Provider>
  );
};

export default ListingContextProvider;
