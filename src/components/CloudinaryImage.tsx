import React from "react";

type CloudinaryImageProps = {
  cloudinaryUrl: string;
  alt?: string;
};

const CloudinaryImage: React.FC<CloudinaryImageProps> = ({ cloudinaryUrl, alt }) => {
  if (!cloudinaryUrl) return <p>No image available</p>;

  return (
    <div style={{ textAlign: "center" }}>
      <img
        src={cloudinaryUrl}
        alt={alt || "Cloudinary Image"}
        style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
      />
    </div>
  );
};

export default CloudinaryImage;