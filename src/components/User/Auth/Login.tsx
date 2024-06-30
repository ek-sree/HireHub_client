import { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
// import googleLogo from '../../../assets/images/google.png';
import HireHub from '../../../assets/images/HireHub.png';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup'; 
import { useDispatch } from 'react-redux';
import { recruiterAxios } from '../../../constraints/axios/recruiterAxios';
import { userAxios } from '../../../constraints/axios/userAxios';
import { recruiterEndpoints } from '../../../constraints/endpoints/recruiterEndpoints';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import { Toaster, toast } from 'sonner';
import { login as userlogin } from '../../../redux/slice/UserSlice';
import {login as recruiterlogin} from '../../../redux/slice/RecruiterSlice'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required("Email is required"),
  password: Yup.string().required("Password is required")
});

const initialValues ={
  email:'',
  password:''
}

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [alignment, setAlignment] = useState<string | null>('user');

  const handleChange = ( newAlignment: string | null) => {
    setAlignment(newAlignment);
  };

const  clientId = '1004012480940-lan5bqbd81a1i0c4278voqg6q1e8tvh4.apps.googleusercontent.com'

  const onSubmit = async (values: typeof initialValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const axiosInstance = alignment === 'recruiter' ? recruiterAxios : userAxios;
      const endpoint = alignment === 'recruiter' ? recruiterEndpoints : userEndpoints;
      console.log("trying to logging");
  
      const response = await axiosInstance.post(endpoint.login, values);
      console.log("Success logging", response);
  
      if (response.data.success && response.data.isRecruiter === false) {
        console.log("Dispatching user login");
        dispatch(userlogin({token:response.data.token, UserData:response.data.user_data}));
        navigate('/home');
      } else if (response.data.success && response.data.isRecruiter === true) {
        console.log("Dispatching recruiter login");
        dispatch(recruiterlogin({token:response.data.token,RecruiterData:response.data.recruiter_data}));
        navigate('/recruiter/home');
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

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;
    console.log('Google Credential', credential);
    try {
      const response = await userAxios.post("/google-login", { credential });
      console.log('Google Login Response', response);

      if (response.data.success) {
        dispatch(userlogin({token:response.data.token, UserData:response.data.user_data}));
        navigate("/home");
      } else {
        toast.error("Failed to log in with Google");
      }
    } catch (error) {
      console.error("Error while processing Google login:", error);
      toast.error("An error occurred. Please try again");
    }
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
          Welcome.. Login as a&nbsp;<b><u>{alignment === 'recruiter' ? 'Recruiter' : 'User'}</u></b>
        </div>
        <div className="pt-2 flex justify-center">
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={(_, newAlignment) => handleChange(newAlignment)}
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
              {alignment === 'user' && (
                <>
                  <div className="flex justify-center">
                    <label>
                      or continue with <hr />
                    </label>
                  </div>
                  <div className="flex justify-center pt-4 pb-5">
                  <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </GoogleOAuthProvider>
                  </div>
                </>
              )}
            </Form>
          )}
        </Formik>
        <div className='mb-3'>
          <label className='pl-20 text-sm'>Don't have an account? <Link to='/signup' className='text-blue-300'>Click here</Link></label>
        </div>
      </div>
    </div>
    <Toaster position="top-center" expand={false} richColors />
  </div>
);
}

export default Login;
