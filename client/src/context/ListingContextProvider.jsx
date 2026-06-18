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
      const { data } = await api.get("/listing/all-listings");

      if (data) {
        setListings(data);
      }
    } catch (error) {
      toast.error("fetching listing error");
      console.log("fetching listing Error", error);
    }
  }, []);

  const getListingDetail = useCallback(async (id) => {
    try {
      const { data } = await api.get("/listing/detail", { params: { id } });

      if (data.listing) {
        return data.listing || {};
      } 
    } catch (error) {
      toast.error("fetching listing detail error");
      console.log("fetching listing detail Error", error);
    }
  }, []);

  const addNewListing = useCallback(async (formData) => {
    try {
      const { data } = await api.post("/listing/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data) {
        setListings((prev) => [...prev, data.listing]);
        getAllListings();
      }
    } catch (error) {}
  }, [getAllListings]);

  const editListing = useCallback(async (formData) => {
    try {
      const { data } = await api.post("/listing/edit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.listing) {
        setListings((prev) =>
          prev.map((l) => (l._id === data.listing._id ? data.listing : l)),
        );
        getAllListings();
      }
    } catch (error) {}
  }, [getAllListings]);

  const deleteListing = useCallback(async (listingId) => {
    try {
      await api.delete("/listing/delete", { params: { id: listingId } });
      setListings((prev) => prev.filter((l) => l._id !== listingId));
      toast.success("Listing deleted successfully!");
      return true;
    } catch (error) {
      toast.error("Failed to delete listing.");
      console.log("delete listing error", error);
      return false;
    }
  }, []);

  const bookListing = useCallback(async (formData) => {
    try {
      const result = await api.post("/listing/booked", formData);
      if (result) {
        return result.data;
      } else {
        return {};
      }
    } catch (error) {}
  }, []);

  const getMyBookings = useCallback(async () => {
    try {
      const { data } = await api.get("/listing/my-bookings");
      if (data.bookings.length > 0) {
        return data.bookings;
      } else {
        return [];
      }
    } catch (error) {
      toast.error("fetching booking error");
      console.log("fetching booking Error", error);
    }
  }, []);

  const bookedListing = useCallback(async(id) => {
    try {
      const { data } = await api.post("/listing/booked-listing",{listingId:id});
      if (data.bookings.length > 0) {
        return data.bookings;
      } else {
        return [];
      }
    } catch (error) {
      toast.error("fetching booking error");
      console.log("fetching booking Error", error);
    }
  },[])

  //--------------------- stripe checkout ---------------------
  const createCheckoutSession = useCallback(async (bookingId) => {
    try {
      const { data } = await api.post("/payment/create-checkout-session", {
        bookingId,
      });
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error("Failed to start payment. Please try again.");
      console.log("Checkout session error", error);
    }
  }, []);

  // ── Reviews ──────────────────────────────────────────────
  const getReviews = useCallback(async (listingId) => {
    try {
      const { data } = await api.get("/review/get-all", {
        params: { id: listingId },
      });
      return data.reviews || [];
    } catch (error) {
      console.log("get reviews error", error);
      return [];
    }
  }, []);

  const addReview = useCallback(async (payload) => {
    try {
      const { data } = await api.post("/review/add", payload);
      toast.success("Review added!");
      return data.review;
    } catch (error) {
      toast.error("Failed to add review.");
      console.log("add review error", error);
      return null;
    }
  }, []);

  const editReview = useCallback(async (payload) => {
    try {
      const { data } = await api.put("/review/edit", payload);
      toast.success("Review updated!");
      return data.review;
    } catch (error) {
      toast.error("Failed to update review.");
      console.log("edit review error", error);
      return null;
    }
  }, []);

  const deleteReview = useCallback(async (reviewId) => {
    try {
      await api.delete("/review/delete", { params: { id: reviewId } });
      toast.success("Review deleted.");
      return true;
    } catch (error) {
      toast.error("Failed to delete review.");
      console.log("delete review error", error);
      return false;
    }
  }, []);

  useEffect(() => {
    getAllListings();
  }, [getAllListings]);

  const values = useMemo(
    () => ({
      getAllListings,
      getListingDetail,
      listings,
      addNewListing,
      editListing,
      deleteListing,
      bookListing,
      getMyBookings,
      createCheckoutSession,
      getReviews,
      addReview,
      editReview,
      deleteReview,
    }),
    [
      getAllListings,
      getListingDetail,
      listings,
      getMyBookings,
      addNewListing,
      editListing,
      deleteListing,
      bookListing,
      createCheckoutSession,
      getReviews,
      addReview,
      editReview,
      deleteReview,
    ],
  );

  return (
    <ListingContext.Provider value={values}>{children}</ListingContext.Provider>
  );
};

export default ListingContextProvider;
