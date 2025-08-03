export default function MinimalTest() {
  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      <h1>Minimal Test Page</h1>
      <p>If you can see this text and the page stays loaded, then basic routing works.</p>
      <div style={{ marginTop: '20px' }}>
        <p>Current time: {new Date().toLocaleTimeString()}</p>
        <p>This page has minimal dependencies and should not crash.</p>
      </div>
    </div>
  );
}