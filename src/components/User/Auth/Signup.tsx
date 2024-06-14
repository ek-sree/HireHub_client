import { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import googleLogo from '../../../assets/images/google.png';
import HireHub from '../../../assets/images/HireHub.png';
import { userAxios } from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup'; 
import { SignupFormValues } from '../../../interface/AuthInterfaces/IAuthInterface';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner'
import { recruiterAxios } from '../../../constraints/axios/recruiterAxios';
import { recruiterEndpoints } from '../../../constraints/endpoints/recruiterEndpoints';


const initialValues = {
  name: '',
  email: '',
  phone: '',
  companyName: '',
  companyEmail: '',
  password: '',
  confirmPassword: ''
};

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phone: Yup.number().positive().integer().required('Phone number is required'),
  companyName: Yup.string(),
  companyEmail: Yup.string().email('Invalid email format'),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Passwords must match')
    .required('Confirm password is required')
});






function Signup() {

  const naviagte = useNavigate()

  const onSubmit = async (values: SignupFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      console.log("hekllo",values);

      const axiosInstance = alignment === 'recruiter' ? recruiterAxios : userAxios;
      const endpoint = alignment === 'recruiter' ? recruiterEndpoints : userEndpoints;
      
      const response = await axiosInstance.post(endpoint.register, values);
      console.log("datat send?");
      if(response.data.success){
        naviagte('/otp')
      }else{
        if(response.data.message ==="Email already exists"){
          toast.error('Email already exist.')
        }else{
          toast.error('Registration faild. Please try again later')
        }
      }
      console.log('Data sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending data:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const [alignment, setAlignment] = useState<string | null>('user');

  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
    setAlignment(newAlignment);
  };

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
            Welcome.. Sign up as a&nbsp;<b>{alignment === 'recruiter' ? 'Recruiter' : 'User'}</b>
          </div>
          <div className="pt-2 flex justify-center">
            <ToggleButtonGroup
              color="primary"
              value={alignment}
              exclusive
              onChange={handleChange}
              aria-label="Platform"
              className="flex"
            >
              <ToggleButton value="user">User</ToggleButton>
              <ToggleButton value="recruiter">Recruiter</ToggleButton>
            </ToggleButtonGroup>
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
                    type="text"
                    name='name'
                    className="border-gray-300 border rounded-md text-sm py-2 px-5 shadow-md w-full"
                    placeholder="Name"
                  />
                  <ErrorMessage name='name' component='div' className="text-red-500 text-xs" />
                </div>
                <div className="pt-5">
                  <Field
                    type="email"
                    name='email'
                    className="border-gray-300 border rounded-md text-sm py-2 px-5 shadow-md w-full"
                    placeholder="Email"
                  />
                  <ErrorMessage name='email' component='div' className="text-red-500 text-xs" />
                </div>
                <div className="pt-5">
                  <Field
                    type="tel"
                    name='phone'
                    className="border-gray-300 border rounded-md text-sm py-2 px-5 shadow-md w-full"
                    placeholder="Phone"
                  />
                  <ErrorMessage name='phone' component='div' className="text-red-500 text-xs" />
                </div>
                {alignment === 'recruiter' && (
                  <>
                    <div className="pt-5">
                      <Field
                        type="text"
                        name='companyName'
                        className="border-gray-300 border rounded-md text-sm py-2 px-5 shadow-md w-full"
                        placeholder="Company name"
                      />
                      <ErrorMessage name='companyName' component='div' className="text-red-500 text-xs" />
                    </div>
                    <div className="pt-5">
                      <Field
                        type="email"
                        name='companyEmail'
                        className="border-gray-300 border rounded-md text-sm py-2 px-5 shadow-md w-full"
                        placeholder="Company Email"
                      />
                      <ErrorMessage name='companyEmail' component='div' className="text-red-500 text-xs" />
                    </div>
                  </>
                )}
                <div className="pt-5">
                  <Field
                    type="password"
                    name='password'
                    className="border-gray-300 border rounded-md text-sm py-2 px-5 shadow-md w-full"
                    placeholder="Password"
                  />
                  <ErrorMessage name='password' component='div' className="text-red-500 text-xs" />
                </div>
                <div className="pt-5">
                  <Field
                    type="password"
                    name='confirmPassword'
                    className="border-gray-300 border rounded-md text-sm py-2 px-5 shadow-md w-full"
                    placeholder="Confirm Password"
                  />
                  <ErrorMessage name='confirmPassword' component='div' className="text-red-500 text-xs" />
                </div>
                <div className="flex justify-center pt-8 pb-5">
                  <button
                    type="submit"
                    className="border border-black w-64 py-1 flex justify-center items-center rounded-md text-white bg-black hover:cursor-pointer hover:bg-slate-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Signup'}
                  </button>
                </div>
                {isSubmitting && (
                  <div className="flex justify-center">
                    <span>Loading...</span>
                  </div>
                )}
                {alignment === 'user' && (
                  <>
                    <div className="pt-4 flex justify-center">
                      <label>
                        or continue with <hr />
                      </label>
                    </div>
                    <div className="flex justify-center pt-4 pb-5">
                      <label className="border border-b-slate-300 w-64 py-1 flex justify-center items-center rounded-md hover:cursor-pointer hover:bg-slate-200">
                        <img src={googleLogo} alt="Google" className="h-5 w-5 mr-3" />
                        Google
                      </label>
                    </div>
                  </>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <Toaster position="top-center" expand={false} richColors/>
    </div>
  );
}

export default Signup;
