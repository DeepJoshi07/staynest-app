import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSubmitForm = async (data) => {
    const result = await login(data.email, data.password);
    if (result.status === 200) {
      navigate("/");
    }
  };

  return (
    <section className="container-base py-12">
      <Helmet>
        <title>Login | Staynest</title>
      </Helmet>
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-soft">
        <h1 className="mb-5 text-2xl font-semibold">Login</h1>
        <form className="space-y-4" onSubmit={handleSubmit(handleSubmitForm)}>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
            className="w-full rounded-xl border px-4 py-3"
          />
          {errors.email ? (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          ) : null}
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            placeholder="Password"
            className="w-full rounded-xl border px-4 py-3"
          />
          {errors.password ? (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          ) : null}

          <button className="w-full rounded-xl bg-brand-primary py-3 font-medium text-white hover:bg-brand-dark">
            Login
          </button>
        </form>
        <p className="flex justify-center items-center gap-1 mt-4 text-sm">
          No account?{" "}
          <Link to="/signup" className="text-brand-primary">
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
}
