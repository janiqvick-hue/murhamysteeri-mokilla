import { firebaseConfigured } from "./firebase";

export default function App() {
  return (
    <div
      style={{
        background: "white",
        color: "black",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <h1>Testi 2</h1>
      <p>firebaseConfigured = {String(firebaseConfigured)}</p>
    </div>
  );
}
