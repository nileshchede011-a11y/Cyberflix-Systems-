module.exports = async (req, res) => {
  const supabaseConfigured =
    !!process.env.SUPABASE_URL &&
    !!(
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");

  res.end(
    JSON.stringify({
      success: true,
      service: "Cyberflix Systems LLP API",
      status: "online",
      database: supabaseConfigured ? "configured" : "not configured",
      timestamp: new Date().toISOString()
    })
  );
};