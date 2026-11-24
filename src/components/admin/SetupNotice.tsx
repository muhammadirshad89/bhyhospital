export function SetupNotice() {
  return (
    <div className="admin-alert admin-alert--error" role="alert">
      <strong>The database is not configured.</strong> Set the <code>DATABASE_URL</code> environment variable and run the migration, then reload this page. Steps are in{" "}
      <code>docs/ADMIN-SETUP.md</code>.
    </div>
  );
}
