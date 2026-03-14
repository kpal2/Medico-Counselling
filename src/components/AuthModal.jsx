import { useMemo, useState } from "react";
import { useAuth } from "../hooks/auth-context";

const AuthModal = ({ isOpen, onClose }) => {
  const { isConfigured, supabase } = useAuth();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const redirectTo = useMemo(() => window.location.origin, []);

  if (!isOpen) {
    return null;
  }

  const handleGoogleSignIn = async () => {
    if (!supabase) {
      return;
    }

    setSubmitting(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (authError) {
      setError(authError.message);
      setSubmitting(false);
    }
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    const { error: authError } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (authError) {
      setError(authError.message);
      setSubmitting(false);
      return;
    }

    setMessage("OTP sent to your phone number.");
    setStep("otp");
    setSubmitting(false);
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    const { error: authError } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });

    if (authError) {
      setError(authError.message);
      setSubmitting(false);
      return;
    }

    setMessage("Signed in successfully.");
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="authOverlay" role="dialog" aria-modal="true" aria-labelledby="signin-title">
      <div className="authModal">
        <button className="authClose" type="button" onClick={onClose} aria-label="Close sign in">
          x
        </button>

        <div className="authHeader">
          <h2 id="signin-title">Sign In</h2>
          <p>Use Google or your phone number. Auth is handled by Supabase.</p>
        </div>

        {!isConfigured && (
          <div className="authAlert authAlert--error">
            Supabase is not configured. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
          </div>
        )}

        {isConfigured && (
          <>
            <button className="authGoogleBtn" type="button" onClick={handleGoogleSignIn} disabled={submitting}>
              Continue with Google
            </button>

            <div className="authDivider">
              <span>or use phone OTP</span>
            </div>

            {step === "phone" ? (
              <form onSubmit={handleSendOtp} className="authForm">
                <label className="filterLabel">
                  Phone number
                  <input
                    className="textInput"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+91XXXXXXXXXX"
                    required
                  />
                </label>
                <button className="primaryBtn authAction" type="submit" disabled={submitting}>
                  Send OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="authForm">
                <label className="filterLabel">
                  Phone number
                  <input className="textInput" type="tel" value={phone} disabled />
                </label>
                <label className="filterLabel">
                  OTP
                  <input
                    className="textInput"
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    placeholder="Enter 6 digit code"
                    required
                  />
                </label>
                <div className="authActions">
                  <button className="btnSecondary" type="button" onClick={() => setStep("phone")}>
                    Change Number
                  </button>
                  <button className="primaryBtn authAction" type="submit" disabled={submitting}>
                    Verify OTP
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {message ? <div className="authAlert authAlert--success">{message}</div> : null}
        {error ? <div className="authAlert authAlert--error">{error}</div> : null}
      </div>
    </div>
  );
};

export default AuthModal;
