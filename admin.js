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

    const inputs = form.querySelectorAll("input");
    const emailInput = form.querySelector('input[type="email"]') || inputs[0];
    const passwordInput = form.querySelector('input[type="password"]') || inputs[1];

    if (!emailInput || !passwordInput) {
      alert("Email ya password field nahi mili!");
      return;
    }

    if (typeof supabaseClient === "undefined") {
      alert("Supabase config load nahi hui!");
      return;
    }

    alert("Login process shuru ho raha hai!");

    const { data, error } =
      await supabaseClient.auth.signInWithPassword({
        email: emailInput.value.trim(),
        password: passwordInput.value
      });

    if (error) {
      alert("Login error: " + error.message);
      return;
    }

    const { data: admin, error: adminError } =
      await supabaseClient
        .from("admin_users")
        .select("user_id")
        .eq("user_id", data.user.id)
        .maybeSingle();

    if (adminError || !admin) {
      await supabaseClient.auth.signOut();
      alert("Admin permission nahi mili!");
      return;
    }

    window.location.href = "dashboard.html";
  });
});
