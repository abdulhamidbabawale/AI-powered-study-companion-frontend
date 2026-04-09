import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useLogin } from '../hooks/useAuth'

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

const LoginPage = () => {
  const { mutate: login, isPending, isError } = useLogin()

  return (
    <div>
      <h1>Login</h1>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          login(values, {
            onSettled: () => setSubmitting(false),
          })
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="email">Email</label>
              <Field
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
              />
              <ErrorMessage name="email" component="p" />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <Field
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
              />
              <ErrorMessage name="password" component="p" />
            </div>

            {isError && <p>Invalid email or password. Please try again.</p>}

            <button type="submit" disabled={isSubmitting || isPending}>
              {isPending ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default LoginPage