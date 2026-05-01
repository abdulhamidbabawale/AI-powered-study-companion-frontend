import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useLogin, useRegister } from '../hooks/useAuth'

const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
})

const signupSchema = Yup.object({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone_no: Yup.string().optional(),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
})

const InputField = ({ id, name, type, placeholder }: {
  id: string, name: string, type: string, placeholder: string
}) => (
  <div>
    <Field
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
    />
    <ErrorMessage name={name} component="p" className="mt-1.5 text-xs text-red-600" />
  </div>
)

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const { mutate: login, isPending: loginPending, isError: loginError } = useLogin()
  const { mutate: signup, isPending: signupPending, isError: signupError } = useRegister()

  const isPending = isLogin ? loginPending : signupPending
  const isError = isLogin ? loginError : signupError

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-10">

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Study Companion</h1>
            <p className="text-sm text-gray-500 mt-1">
              {isLogin ? 'Sign in to continue learning' : 'Create your account'}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition cursor-pointer ${
                isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition cursor-pointer ${
                !isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Error banner */}
          {isError && (
            <div className="mb-6 flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {isLogin ? 'Invalid email or password.' : 'Signup failed. Please try again.'}
            </div>
          )}

          {/* Login Form */}
          {isLogin ? (
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={loginSchema}
              onSubmit={(values, { setSubmitting }) =>
                login(values, { onSettled: () => setSubmitting(false) })
              }
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email address
                    </label>
                    <InputField id="email" name="email" type="email" placeholder="you@example.com" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <a href="#" className="text-xs text-indigo-600 hover:text-indigo-500 font-medium">
                        Forgot password?
                      </a>
                    </div>
                    <InputField id="password" name="password" type="password" placeholder="••••••••" />
                  </div>

                  <SubmitButton isPending={loginPending} isSubmitting={isSubmitting} label="Sign in" />
                </Form>
              )}
            </Formik>

          ) : (

            /* Signup Form */
            <Formik
              initialValues={{ first_name: '', last_name: '', email: '', phone_no: '', password: '', confirm_password: '' }}
              validationSchema={signupSchema}
              onSubmit={(values, { setSubmitting }) => {
                const { confirm_password, ...payload } = values
                signup(payload, { onSettled: () => setSubmitting(false) })
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                        First name
                      </label>
                      <InputField id="first_name" name="first_name" type="text" placeholder="John" />
                    </div>
                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Last name
                      </label>
                      <InputField id="last_name" name="last_name" type="text" placeholder="Doe" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email address
                    </label>
                    <InputField id="email" name="email" type="email" placeholder="you@example.com" />
                  </div>

                  <div>
                    <label htmlFor="phone_no" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone number
                      <span className="ml-1 text-xs text-gray-400 font-normal">(optional)</span>
                    </label>
                    <InputField id="phone_no" name="phone_no" type="tel" placeholder="+1 234 567 8900" />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Password
                    </label>
                    <InputField id="password" name="password" type="password" placeholder="••••••••" />
                  </div>

                  <div>
                    <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Confirm password
                    </label>
                    <InputField id="confirm_password" name="confirm_password" type="password" placeholder="••••••••" />
                  </div>

                  <SubmitButton isPending={signupPending} isSubmitting={isSubmitting} label="Create account" />
                </Form>
              )}
            </Formik>
          )}

        </div>
      </div>
    </div>
  )
}

const SubmitButton = ({ isPending, isSubmitting, label }: {
  isPending: boolean, isSubmitting: boolean, label: string
}) => (
  <button
    type="submit"
    disabled={isSubmitting || isPending}
    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold py-2.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed"
  >
    {isPending ? (
      <span className="flex items-center justify-center gap-2">
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Loading...
      </span>
    ) : label}
  </button>
)

export default AuthPage