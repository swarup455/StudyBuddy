import React, { useEffect } from 'react'
import { useState } from 'react';
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { loginAndSignupUser } from '../reduxToolkit/auth/authSlice';
import { ImSpinner8 } from "react-icons/im";

const LoginPage = () => {
  const [currState, setCurrState] = useState("login");
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();
  const { pending } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    if (currState === "login") {
      if (email && password) {
        dispatch(
          loginAndSignupUser({
            state: currState,
            userData: { email, password },
          })
        );
      } else {
        toast.error("Both email and password required!");
      }
    } else {
      if (fullname && email && newPassword && newPassword === confirmPassword) {
        dispatch(
          loginAndSignupUser({
            state: currState,
            userData: { fullName: fullname, email, password: newPassword }
          })
        );

      } else if (!fullname || !email || !newPassword) {
        toast.error("All fields are required!");
      } else if (newPassword != confirmPassword) {
        toast.error("Confirm password is incorrect!")
      }
    }
    e.preventDefault();
  }

  //reset everything when currState changes
  useEffect(() => {
    setFullName('');
    setEmail('');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }, [currState]);

  return (
    <div className='h-screen w-full flex items-center justify-center p-5'>
      <div className='min-h-2/3 sm:min-h-8/9 w-full max-w-md hidden lg:block border-y border-l rounded-l-2xl border-zinc-300 dark:border-zinc-700'>
        <img src="/login.svg" alt="background image" />
        <h1 className='text-2xl mx-auto my-3 text-center'>{currState === "login" ? "Welcome Back" : "Welcome to StudyBuddy"}</h1>
        <p className='text-zinc-500 text-center my-5'>
          {currState === "login" ? "Welcome back! please enter your details" : "Create a new account by entering details"}
        </p>
      </div>
      <div className='min-h-2/3 sm:min-h-8/9 w-full max-w-md border-y lg:border-l-0 border-x rounded-2xl lg:rounded-l-none border-zinc-300 dark:border-zinc-700 py-10 px-5 overflow-hidden'>
        <h1 className='text-2xl block lg:hidden mx-auto my-3 text-center'>{currState === "login" ? "Welcome Back" : "Welcome to StudyBuddy"}</h1>
        <p className='text-zinc-500 block lg:hidden text-center my-5'>
          {currState === "login" ? "Welcome back! please enter your details" : "Create a new account by entering details"}
        </p>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          {currState === "signup" &&
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
              placeholder='Enter Fullname'
              className='w-full bg-zinc-100 dark:bg-zinc-700/30 border border-zinc-300 dark:border-zinc-700 p-3 rounded-xl focus:outline-none'
            />
          }
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter Email'
            className='w-full bg-zinc-100 dark:bg-zinc-700/30 border border-zinc-300 dark:border-zinc-700 p-3 rounded-xl focus:outline-none'
          />
          {currState === "login" &&
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter Password'
              className='w-full bg-zinc-100 dark:bg-zinc-700/30 border border-zinc-300 dark:border-zinc-700 p-3 rounded-xl focus:outline-none'
            />
          }
          {currState === "signup" &&
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder='New Password'
              className='w-full bg-zinc-100 dark:bg-zinc-700/30 border border-zinc-300 dark:border-zinc-700 p-3 rounded-xl focus:outline-none'
            />
          }
          {currState === "signup" &&
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Confirm Password'
              className='w-full bg-zinc-100 dark:bg-zinc-700/30 border border-zinc-300 dark:border-zinc-700 p-3 rounded-xl focus:outline-none'
            />
          }
          <div className='w-full flex flex-col gap-5'>
            <div className='w-full'>
              <button type="submit"
                className='w-full flex items-center justify-center gap-3 text-white bg-violet-500 border border-zinc-300 dark:border-zinc-700 p-3 rounded-xl cursor-pointer'
              >
                {pending && <ImSpinner8 size={15} className='animate-spin' />}
                {currState === "login" ? "Sign In" : "Sign Up"}
              </button>
              <p className='w-full p-3 gap-2 flex justify-center items-center text-sm text-zinc-800 dark:text-zinc-500'>
                {currState === "signup" ? "Already have an account?" : "Don't have an account?"}
                <button
                  type="button"
                  onClick={() => setCurrState(currState === "login" ? "signup" : "login")}
                  className='cursor-pointer font-semibold text-red-500'>
                  {currState === "login" ? "Register" : "Login"}
                </button>
              </p>
            </div>
            <div className='w-full flex items-center justify-between'>
              <hr className='flex-grow border-t border-zinc-400 dark:border-zinc-700' />
              <span className='text-zinc-500 mx-3'>OR</span>
              <hr className='flex-grow border-t border-zinc-400 dark:border-zinc-700' />
            </div>
            <button
              className='border border-zinc-400 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 p-3 rounded-xl cursor-pointer'
            >
              Join as a guest
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage