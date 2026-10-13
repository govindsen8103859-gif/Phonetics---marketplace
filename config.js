(function () {
  "use strict";

  const SUPABASE_URL =
    "https://vuvznvwlzlabfaasylss.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_E885kuUfeqieX5c0l0zgMQ_DBI76YAY";

  if (!window.supabase) {
    console.error("Supabase library load nahi hui.");
    return;
  }

  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

  console.log("Supabase client ready.");
})();
