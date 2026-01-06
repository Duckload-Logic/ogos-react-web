import { RegisterForm } from "./components/RegisterForm";

export default function Register() {
  return (
    <div id="register_page" className="register-page">
      <div className="register-page__container">
        <div className="register-page__content">
          <div className="register-page__header">
            <h1 className="register-page__title">
              Create Account
            </h1>
            <p className="register-page__subtitle">
              Join us by creating your account
            </p>
          </div>

          <RegisterForm />

          <div className="register-page__footer">
            <p className="register-page__login-text">
              Already have an account?
              <a href="/login" className="register-page__link">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
