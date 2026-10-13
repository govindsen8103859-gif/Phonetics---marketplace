document.addEventListener("DOMContentLoaded", () => {
  const form =
    document.getElementById("loginForm") ||
    document.getElementById("login-form") ||
    document.querySelector("form");

  if (!form) {
    alert("Login form nahi mila!");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const emailInput = form.querySelector('input[type="email"]');
    const passwordInput = form.querySelector('input[type="password"]');

    if (!emailInput || !passwordInput) {
      alert("Email ya password field nahi mili!");
      return;
    }

    if (!window.supabaseClient) {
      alert("Supabase config load nahi hui! Page refresh karo.");
      return;
    }

    const { data, error } =
      await window.supabaseClient.auth.signInWithPassword({
        email: emailInput.value.trim(),
        password: passwordInput.value
      });

    if (error) {
      alert("Login error: " + error.message);
      return;
    }

    const { data: admin, error: adminError } =
      await window.supabaseClient
        .from("admin_users")
        .select("user_id")
        .eq("user_id", data.user.id)
        .maybeSingle();

    if (adminError || !admin) {
      await window.supabaseClient.auth.signOut();
      alert("Admin permission nahi mili!");
      return;
    }

    window.location.href = "dashboard.html";
  });
});
