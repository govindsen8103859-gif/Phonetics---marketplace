document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const message = document.getElementById("message");

  if (!form || !emailInput || !passwordInput) {
    console.error("Login form or input IDs not found.");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (message) message.textContent = "Logging in...";

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: emailInput.value.trim(),
      password: passwordInput.value
    });

    if (error) {
      if (message) message.textContent = "Login failed: " + error.message;
      console.error(error);
      return;
    }

    const { data: admin, error: adminError } = await supabaseClient
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (adminError || !admin) {
      await supabaseClient.auth.signOut();
      if (message) message.textContent = "This account is not authorized as admin.";
      return;
    }

    window.location.href = "dashboard.html";
  });
});
