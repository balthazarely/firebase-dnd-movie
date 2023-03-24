import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <div
      style={{
        background: "lightgray",
        color: "black",
        padding: "15px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <Link style={{ marginRight: "32px" }} href="/movies">
          Movies
        </Link>
        <Link style={{ marginRight: "32px" }} href="/profile">
          Profile
        </Link>
        <Link style={{ marginRight: "32px" }} href="/enter">
          login
        </Link>
      </div>
    </div>
  );
}
