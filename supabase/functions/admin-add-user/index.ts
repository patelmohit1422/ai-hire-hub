import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing Authorization header" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!supabaseServiceKey) {
      console.error("SUPABASE_SERVICE_ROLE_KEY is not set");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Client 1: Verify caller identity using their JWT
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller }, error: callerError } = await userClient.auth.getUser(token);

    if (callerError || !caller) {
      console.error("Caller auth error:", callerError);
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid token" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Client 2: Service role for admin operations
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    // Verify caller is admin via user_roles table
    const { data: adminRole, error: roleError } = await serviceClient
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError) {
      console.error("Role check error:", roleError);
      return new Response(
        JSON.stringify({ error: "Failed to verify permissions" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!adminRole) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Only admins can add users" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body = await req.json();
    const { name, email, password, role, status } = body;

    if (!name || !email || !role) {
      return new Response(
        JSON.stringify({ error: "Bad Request: name, email, and role are required" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if email already exists in auth or profiles
    const { data: existingProfile } = await serviceClient
      .from("profiles")
      .select("id, email")
      .eq("email", email)
      .maybeSingle();

    if (existingProfile) {
      return new Response(
        JSON.stringify({ error: "This email is already registered. One email can only have one role." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Also check auth.users directly (listUsers filter is fuzzy, so we must exact-match)
    const { data: existingAuthUser } = await serviceClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const exactMatch = existingAuthUser?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );
    if (exactMatch) {
      return new Response(
        JSON.stringify({ error: "This email address is already registered in the system." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Admin ${caller.email} creating user: ${email} with role: ${role}`);

    // Use provided password or generate a temporary one
    const userPassword = password || Math.random().toString(36).slice(-12) + "A1!";

    // Create user via Supabase Admin Auth API
    const { data: createData, error: createError } =
      await serviceClient.auth.admin.createUser({
        email,
        password: userPassword,
        email_confirm: false, // User must confirm via email
        user_metadata: { name, role },
      });

    if (createError) {
      console.error("User create error:", createError);

      const msg =
        createError.message?.includes("already") ||
        createError.message?.includes("exists")
          ? "This email address is already registered."
          : (createError.message || "Failed to create user");

      return new Response(
        JSON.stringify({ error: msg }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const newUserId = createData.user.id;

    // Role is auto-assigned by handle_new_user trigger, but verify
    console.log(`User created: ${newUserId} (${email}), role assigned via trigger`);

    // Update profile status if not active
    if (status && status !== "active") {
      await serviceClient
        .from("profiles")
        .update({ status })
        .eq("user_id", newUserId);
    }

    console.log(`User created successfully: ${newUserId} (${email})`);

    return new Response(
      JSON.stringify({
        user_id: newUserId,
        email,
        name,
        role,
        status: status || "active",
        message: "User created successfully. They must confirm their email before logging in.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error in admin-add-user:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected server error occurred. Please try again." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
