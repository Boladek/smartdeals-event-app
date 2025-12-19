import { useNavigate } from "react-router";
import { BaseButton } from "../../components/BaseButton";

export const SuccessPage = ({
    message = "Event Created Successfully",
    description = "Start checking in guests",
    link = "/my-events"
}) => {
    const navigate = useNavigate();

    const handleReturnHome = () => {
        // Navigate to home or any other page
        navigate(link); // Adjust based on your routing setup
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-6">
            {/* Success Icon */}
            <div className="p-6 rounded-full bg-red-100 text-red-600">
                <span role="img" aria-label="success" className="text-4xl">
                    🎉
                </span>
            </div>

            {/* Success Message */}
            <h2 className="text-2xl font-bold text-center">{message}</h2>
            <p className="text-sm text-center text-gray-500">{description}</p>

            {/* Button to Return Home */}
            <BaseButton
                type="button"
                onClick={handleReturnHome}
                className="px-6 py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700"
            >
                Return Home
            </BaseButton>
        </div>
    );
};
