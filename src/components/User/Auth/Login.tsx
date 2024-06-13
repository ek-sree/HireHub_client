import { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import googleLogo from '../../../assets/images/google.png';
import HireHub from '../../../assets/images/HireHub.png';

function Login() {
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
            Welcome.. Login as a&nbsp;<b><u>{alignment === 'recruiter' ? 'Recruiter' : 'User'}</u></b>
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
         
          <div className="pt-5">
            <input
              type="email"
              className="border-gray-300 border rounded-md text-sm py-2 px-5 shadow-md w-full"
              placeholder="Email"
            />
          </div>
          <div className="pt-5">
            <input
              type="password"
              className="border-gray-300 border rounded-md text-sm py-2 px-5 shadow-md w-full"
              placeholder="Password"
            />
          </div>
          <div className="flex justify-center pt-8 pb-5">
            <label className="border border-black w-64 py-1 flex justify-center items-center rounded-md text-white bg-black hover:cursor-pointer hover:bg-slate-700">
              Signup
            </label>
          </div>
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
        </div>
      </div>
    </div>
  );
}

export default Login;
