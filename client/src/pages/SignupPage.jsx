import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSubmitForm = async (data) => {
    const {name,email,password} = data
    signup(name,email,password);
    navigate("/");
  };

  return (
    <section className="container-base py-12">
      <Helmet>
        <title>Sign Up | Staynest</title>
      </Helmet>
      <div className="mx-auto mb-4 max-w-md">
        <BackButton />
      </div>
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-soft">
        <h1 className="mb-5 text-2xl font-semibold">Create account</h1>
        <form className="space-y-4" onSubmit={handleSubmit(handleSubmitForm)}>
          <input
            {...register("name", { required: "Name is required" })}
            placeholder="Name"
            className="w-full rounded-xl border px-4 py-3"
          />
          {errors.name ? (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          ) : null}
          <input
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
            className="w-full rounded-xl border px-4 py-3"
          />
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Min 6 characters" },
            })}
            placeholder="Password"
            className="w-full rounded-xl border px-4 py-3"
          />
          <input
            type="password"
            {...register("confirmPassword", {
              validate: (v) =>
                v === watch("password") || "Passwords do not match",
            })}
            placeholder="Confirm Password"
            className="w-full rounded-xl border px-4 py-3"
          />
          {errors.confirmPassword ? (
            <p className="text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          ) : null}

          <button className="w-full rounded-xl bg-brand-primary py-3 font-medium text-white hover:bg-brand-dark">
            Sign Up
          </button>
        </form>
        <p className="flex justify-center items-center gap-1 mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-primary">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
