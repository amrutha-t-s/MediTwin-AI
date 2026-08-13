function EmailVerification() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Email Verification</h1>

      <p className="mt-4 text-gray-600">
        Please check your email and click the verification link.
      </p>

      <button className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg">
        Resend Verification Email
      </button>
    </div>
  );
}

export default EmailVerification;
