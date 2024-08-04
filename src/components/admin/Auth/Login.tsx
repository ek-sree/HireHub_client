import HireHub from '../../../assets/images/HireHub.png';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Toaster, toast } from 'sonner';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { adminAxios } from '../../../constraints/axios/adminAxios';
import { adminEndpoints } from '../../../constraints/endpoints/adminEndpoints';
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/slice/AdminSlice';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required("Email is required"),
  password: Yup.string().required("Password is required")
});

const initialValues = {
  email: '',
  password: ''
}

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const onSubmit = async (values: typeof initialValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
        
      const response = await adminAxios.post(adminEndpoints.adminlogin, values);

      if (response.data.success && response.data.isRecruiter === null) {
        dispatch(login({token:response.data.token, adminData:response.data.admin_data}));
        navigate('/admin/dashboard');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log('Error logging in', error);
      toast.error("An error occurred. Please try again");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2 pt-4">
      <div className="flex justify-center items-center mb-4 md:mb-0">
        <img
          src={HireHub}
          alt="HireHub"
          className="max-w-full h-auto rounded-lg w-32 md:w-auto"
        />
      </div>
      <div className="flex justify-center items-center">
        <div className="mb-16 shadow-xl rounded-lg w-full max-w-sm p-4 ">
          <div className="flex items-center justify-center mt-2 text-center text-xl ">
            Welcome..Admin.
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="pt-5">
                  <Field
                    type="email"
                    name="email"
                    className="border-gray-300 border rounded-md text-sm py-2 px-5 shadow-md w-full"
                    placeholder="Email"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
                </div>
                <div className="pt-5">
                  <Field
                    type="password"
                    name="password"
                    className="border-gray-300 border rounded-md text-sm py-2 px-5 shadow-md w-full"
                    placeholder="Password"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-xs" />
                </div>
                <div className="flex justify-center pt-8 pb-5">
                  <button
                    type="submit"
                    className="border border-black w-64 py-1 flex justify-center items-center rounded-md text-white bg-black hover:cursor-pointer hover:bg-slate-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Login'}
                  </button>
                </div>
                {isSubmitting && (
                  <div className="flex justify-center">
                    <span>Loading...</span>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <Toaster position="top-center" expand={false} richColors />
    </div>
  );
}

export default Login;
