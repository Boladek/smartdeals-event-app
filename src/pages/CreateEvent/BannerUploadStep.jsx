import { useState } from "react";
import BannerCard from "./BannerCard"; // Import the BannerCard component

const BannerUploadStep = ({ onFinish, watch, setValue }) => {
    const [images, setImages] = useState([null, null, null]); // Store uploaded images
    const [uploading, setUploading] = useState(false); // Track if any image is uploading
    const [uploadError, setUploadError] = useState(""); // Handle upload errors globally

    // Validate if at least one image is uploaded
    const validateBanners = () => {
        if (!images.some((image) => image !== null)) {
            alert("At least one banner must be uploaded.");
            return false;
        }
        return true;
    };

    // Handle the image upload logic for individual cards
    const handleImageUpload = (index, imageUrl) => {
        const updatedImages = [...images];
        updatedImages[index] = imageUrl; // Update the image URL for the specific card
        setImages(updatedImages);

        // Save the URL in the form field using react-hook-form
        setValue(`banners.${index}`, imageUrl);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Upload a Banner</h2>

            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
                <p className="text-sm font-semibold">Instructions</p>
                <p className="text-xs text-gray-600">
                    Upload at least 2-3 photos of your event banner. The first
                    image is the default thumbnail. Move the cards between each
                    other to swap positions.
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((image, index) => (
                    <BannerCard
                        key={index}
                        index={index}
                        onImageUpload={handleImageUpload}
                    />
                ))}
            </div>
        </div>
    );
};

export default BannerUploadStep;
