import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/DefaultLayout";
import MainContainer from "../components/MainContainer";
import { Pixel } from "../interfaces/Pixel";

const IndexPage: React.FC = () => {
  const [pixels, setPixels] = useState<Pixel[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/pixels", {
      method: "GET",
      credentials: "include", // Include credentials (cookies, etc.)
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched pixels data:", data);
        setPixels(data);
      })
      .catch((error) => {
        console.error("Error fetching pixel data:", error);
      });
  }, []);

  return (
    <Layout
      title="The Million Dollar Homepage - Own a Piece of the Internet"
      description="Purchase and own a piece of The Million Dollar Homepage. Showcase your brand, link to your website, and be a part of internet history."
    >
      <div className="container mx-auto p-4">
        <h1 className="text-4xl text-center mb-8">
          The V2 Million Crytpo Homepage
        </h1>
        <MainContainer pixels={pixels} />
      </div>
    </Layout>
  );
};

export default IndexPage;
