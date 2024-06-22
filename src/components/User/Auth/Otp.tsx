import React, { useEffect, useRef, useCallback, useState } from "react";
import { FormikErrors, useFormik } from "formik";
import HireHub from "../../../assets/images/HireHub.png";
import { userAxios } from "../../../constraints/axios/userAxios";
import { userEndpoints } from "../../../constraints/endpoints/userEndpoints";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from 'sonner'
import { useDispatch } from "react-redux";
import { login as userLogin } from "../../../redux/slice/UserSlice";
import { login as recruiterLogin} from "../../../redux/slice/RecruiterSlice";
import Cookies from 'js-cookie';
import { recruiterAxios } from "../../../constraints/axios/recruiterAxios";
import { recruiterEndpoints } from "../../../constraints/endpoints/recruiterEndpoints";

interface FormValues {
  otp: string[];
}

const validate = (values: FormValues) => {
  const errors: FormikErrors<FormValues> = {};
  if (values.otp.some((data) => data === "")) {
    errors.otp = "This field is required";
  }
  return errors;
};

const Otp = () => {
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [countdown, setCountdown] = useState(30);
  const [showResendButton, setShowResendButton] = useState(false);

  const [recruiter, setRecruiter] = useState<string | undefined>(undefined);



const axiosInstance = recruiter == "false" ? userAxios : recruiterAxios;
const endpoint = recruiter == "false" ? userEndpoints : recruiterEndpoints;

  const formik = useFormik<FormValues>({
    initialValues: {
      otp: Array(6).fill(""),
    },
    validate,
    onSubmit: async (values) => {
      console.log("Otp is sending");
      
        try {
            const otp = values.otp.join("")
            const response = await axiosInstance.post(endpoint.otp,{otp})
            console.log("Send successfully", response);
            if(response.data.success && response.data.isRecruiter==false){
              dispatch(userLogin(
                 response.data.user_data,
              ))
              navigate('/home');
            }else if(response.data.success && response.data.isRecruiter==true){
              dispatch(recruiterLogin(
                response.data.recruiter_data,
              ))
              navigate('/recruiter/home')
            }else{
              toast.error('Entered otp is incorrect.')
            }
        } catch (error) {
            console.log("error otp", error);
            
        }
     

    },
  });

  const pasteText = useCallback(
    (e: ClipboardEvent) => {
      const pastedText = e.clipboardData?.getData("text") || "";
      const fieldValue: string[] = pastedText.split("").slice(0, 6);
      formik.setValues({ otp: fieldValue });
      if (inputRef.current[5]) {
        inputRef.current[5].focus();
      }
    },
    [formik]
  );

  useEffect(() => {
    const firstInput = inputRef.current[0];
    if (firstInput) {
      firstInput.addEventListener("paste", pasteText);
    }
    return () => {
      if (firstInput) {
        firstInput.removeEventListener("paste", pasteText);
      }
    };
  }, [pasteText]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowResendButton(true);
    }
  }, [countdown]);

  useEffect(()=>{
    const recruiterStatus = Cookies.get('isRecruiter');
console.log("Checking recruiterstatus", recruiterStatus);
console.log(typeof recruiterStatus);

setRecruiter(recruiterStatus)
  },[])

  useEffect(() => {
    inputRef.current[0]?.focus();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (/[^0-9]/.test(value)) return;

    const currentOtp = [...formik.values.otp];
    currentOtp[index] = value.slice(-1);

    formik.setValues((prev) => ({
      ...prev,
      otp: currentOtp,
    }));

    if (value && index < 5) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handleBackSpace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && index > 0 && !formik.values.otp[index]) {
      inputRef.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async() => {
    try {
      await axiosInstance.post(endpoint.resendOtp)
      formik.resetForm();
    setCountdown(30);
    setShowResendButton(false);
    if (inputRef.current[0]) {
      inputRef.current[0].focus();
    }
    } catch (error) {
      console.log("error in resend otp", error);
      
    }
  };

  const renderInput = () => {
    return formik.values.otp.map((value, index) => (
      <input
        key={index}
        ref={(element) => (inputRef.current[index] = element)}
        type="text"
        name={`otp${index}`}
        value={value}
        className="w-12 mb-5 shadow-xl sm:w-9 md:w-14 lg:w-16 h-12 rounded-md mr-2 text-center text-xl border border-zinc-200"
        onChange={(e) => handleChange(e, index)}
        onKeyDown={(e) => handleBackSpace(e, index)}
        maxLength={1}
      />
    ));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md overflow-hidden flex flex-col items-center">
        <img src={HireHub} alt="HireHub logo" className="w-20 mb-4" />
        <form onSubmit={formik.handleSubmit} className="w-full">
          <h3 className="text-3xl mb-8 text-center">Please Fill in the OTP</h3>
          <div className="flex items-center justify-center">
            {renderInput()}
          </div>
          {formik.errors.otp && (
            <p className="mt-3 text-sm text-red-400 text-center">
              Please fill all fields
            </p>
          )}
          {countdown > 0 ?(
            <button
            type="submit"
            className="mt-4 w-full bg-gray-800 text-white rounded-lg py-3 hover:bg-gray-700"
          >
            Submit
          </button>
          ):(
            <p></p>
          )}
          
        </form>
        {countdown > 0 ? (
          <p className="text-center mt-4">Resend OTP in {countdown} seconds</p>
        ) : (
          <button
            onClick={handleResendOtp}
            className="mt-4 w-full bg-gray-800 text-white rounded-lg py-3 hover:bg-gray-700"
          >
            Resend OTP
          </button>
        )}
      </div>
      <Toaster position="top-center" expand={false} richColors/>
    </div>
  );
};

export default Otp;
