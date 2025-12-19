import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { useUploadImage } from "../../hooks/EventsHooks";
import { UseAuth } from "../../contexts/AuthContext";

const BannerCard = ({ index, onImageUpload, initialUrl }) => {
    const { user } = UseAuth();
    const [image, setImage] = useState(initialUrl || null);
    const [uploadError, setUploadError] = useState("");

    const { mutateAsync, isPending } = useUploadImage();

    useEffect(() => {
        // If parent resets / prefills
        setImage(initialUrl || null);
    }, [initialUrl]);

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadError("");

        try {
            const fd = new FormData();
            fd.append("files", file);
            fd.append("username", user.username);
            fd.append("region", user.region);

            const response = await mutateAsync(fd);

            // Your API returns the URL in response.data
            const imageUrl = response?.data;

            if (!imageUrl) {
                setUploadError("Upload succeeded but no URL was returned.");
                return;
            }

            setImage(imageUrl);
            onImageUpload(index, imageUrl); // <-- IMPORTANT: bubbles URL up
        } catch (err) {
            console.error(err);
            setUploadError("Failed to upload image.");
        }
    };

    return (
        <div className="flex flex-col items-center space-y-3">
            <label
                className="w-full bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                htmlFor={`file-upload-${index}`}
            >
                <div className="relative w-full h-40 bg-gray-100 flex justify-center items-center rounded-lg overflow-hidden">
                    {image ? (
                        <img
                            src={image}
                            alt={`Banner ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                No Image Uploaded
                            </p>
                            <p className="text-xs text-center text-primary">
                                Click to upload an image
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-3 flex items-center justify-center bg-gray-100 p-2 rounded-md cursor-pointer hover:bg-gray-200">
                    <input
                        id={`file-upload-${index}`}
                        className="hidden"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isPending}
                    />
                    {isPending ? (
                        <ImSpinner2 className="animate-spin text-xl text-blue-500" />
                    ) : (
                        <FaCloudUploadAlt className="text-xl text-primary/75" />
                    )}
                </div>
            </label>

            {uploadError ? (
                <p className="text-sm text-red-600">{uploadError}</p>
            ) : null}
        </div>
    );
};

export default BannerCard;
