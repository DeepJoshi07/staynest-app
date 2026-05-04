import { useEffect, useMemo, useState } from "react";
import { mockListings } from "../utils/mockData";

export default function useListings(filters = {}, page = 1, perPage = 6) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setData(mockListings);
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const locationOk = filters.location
        ? item.location.toLowerCase().includes(filters.location.toLowerCase())
        : true;
      const priceOk = filters.maxPrice ? item.price <= Number(filters.maxPrice) : true;
      const guestsOk = filters.guests ? item.guests >= Number(filters.guests) : true;
      return locationOk && priceOk && guestsOk;
    });
  }, [data, filters]);

  const start = (page - 1) * perPage;
  return {
    loading,
    listings: filtered.slice(start, start + perPage),
    total: filtered.length,
    pages: Math.ceil(filtered.length / perPage),
  };
}
