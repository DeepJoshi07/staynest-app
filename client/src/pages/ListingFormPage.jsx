import { Helmet } from "react-helmet-async";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ImageUploader from "../components/ImageUploader";
import { amenitiesList } from "../utils/mockData";
import { useEffect, useState } from "react";
import { useListing } from "../context/ListingContextProvider";

export default function ListingFormPage({ mode = "add" }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addNewListing, editListing, getListingDetail } = useListing();
  const { register, handleSubmit, setValue, control, reset } = useForm();

  useEffect(() => {
    if (mode === "edit" && id) {
      const fetchListing = async () => {
        const data = await getListingDetail(id);
        if (data && Object.keys(data).length > 0) {
          reset({
            title: data.title,
            description: data.description,
            location: data.location,
            price: data.price,
            guests: data.guests,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            amenities: data.amenities || [],
          });
        }
      };
      fetchListing();
    }
  }, [mode, id, getListingDetail, reset]);

  const handleSubmitForm = async (data) => {
    const formData = new FormData();
    if (mode === "edit" && id) {
      formData.append("id", id);
    }
    formData.append("title",data.title)
    formData.append("description",data.description)
    formData.append("location",data.location)
    formData.append("price",data.price)
    formData.append("guests",data.guests)
    formData.append("bedrooms",data.bedrooms)
    formData.append("bathrooms",data.bathrooms)

    if (data.amenities) {
      data.amenities.forEach(a => formData.append("amenities",a))
    }

    if (data.images) {
      for(let i = 0;i < data.images.length;i++){
        formData.append("images",data.images[i]);
      }
    }
    
    if (mode === "edit") {
      await editListing(formData);
    } else {
      await addNewListing(formData);
    }
    toast.success(`Listing ${mode === "add" ? "created" : "updated"}`);
    navigate("/dashboard/listings");
  };

  return (
    <section className="container-base py-10">
      <Helmet>
        <title>{mode === "add" ? "Add" : "Edit"} Listing | Staynest</title>
      </Helmet>

      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-soft">
        <h1 className="mb-5 text-2xl font-semibold">
          {mode === "add" ? "Add" : "Edit"} Listing
        </h1>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          <input
            {...register("title")}
            placeholder="Title"
            className="rounded-xl border px-4 py-2 sm:col-span-2"
          />
          <textarea
            {...register("description")}
            placeholder="Description"
            rows={4}
            className="rounded-xl border px-4 py-2 sm:col-span-2"
          />
          <input
            {...register("location")}
            placeholder="Location"
            className="rounded-xl border px-4 py-2"
          />
          <input
            {...register("price")}
            placeholder="Price"
            type="number"
            className="rounded-xl border px-4 py-2"
          />
          <input
            {...register("guests")}
            placeholder="Guests"
            type="number"
            className="rounded-xl border px-4 py-2"
          />
          <input
            {...register("bedrooms")}
            placeholder="Bedrooms"
            type="number"
            className="rounded-xl border px-4 py-2"
          />
          <input
            {...register("bathrooms")}
            placeholder="Bathrooms"
            type="number"
            className="rounded-xl border px-4 py-2 sm:col-span-2"
          />
          <div className="sm:col-span-2">
            <p className="mb-2 text-sm font-medium">Amenities</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {amenitiesList.map((a) => (
                <label
                  key={a}
                  className="flex items-center gap-2 rounded-lg border p-2 text-sm"
                >
                  <input type="checkbox" value={a} {...register("amenities")} />{" "}
                  {a}
                </label>
              ))}
            </div>
          </div>
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <ImageUploader
                value={field.value}
                onChange={(files) => field.onChange(files)}
              />
            )}
          />

          <div className="flex gap-3 sm:col-span-2">
            <button className="rounded-xl bg-brand-primary px-5 py-2 text-white hover:bg-brand-dark">
              Submit
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border px-5 py-2 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
