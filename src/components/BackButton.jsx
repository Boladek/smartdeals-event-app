import { FaArrowLeft } from "react-icons/fa";

export const BackButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="p-2 text-red-600 rounded-full hover:bg-red-100 transition-all bg-[#E41F260F] cursor-pointer"
        >
            <FaArrowLeft size={16} />
        </button>
    );
};
