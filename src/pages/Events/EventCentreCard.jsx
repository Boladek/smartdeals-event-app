import { FaLaptop, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useGetEventClass } from "../../hooks/EventsHooks";

const eventData = [
    {
        title: "General Events",
        description: "Access free or paid events near you easily",
        icon: <FaLaptop size={24} />,
        bgColor: "bg-[#FFA04B26]",
        textColor: "text-black",
        iconBg: "bg-[#FFA04B]",
        category: "public",
    },
    {
        title: "Private Events",
        description:
            "Selected private events strictly on access code or invitation",
        icon: <FaLock size={24} />,
        bgColor: "bg-[#5CC88026]",
        textColor: "text-black",
        iconBg: "bg-[#5CC880]",
        category: "private",
    },
];

export const EventCentreCard = () => {
    const navigate = useNavigate();
    const { isLoading, data = [] } = useGetEventClass();

    const cards = mergeEventClassWithUI(data || []);

    if (isLoading) {
        return (
            <div className="max-w-lg mx-auto space-y-8">
                <div>
                    <h2 className="text-[20px] font-semibold text-center">
                        Event Centre
                    </h2>
                    <p className="text-center text-[#414B5A]">check-in:</p>
                </div>

                {/* Skeleton loader cards */}
                {[1, 2].map((i) => (
                    <div
                        key={i}
                        className="p-6 rounded-[20px] flex gap-4 items-center bg-gray-100 animate-pulse"
                    >
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-[15px]" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-24 bg-gray-300 rounded" />
                            <div className="h-2 w-40 bg-gray-200 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto space-y-8">
            <div>
                <h2 className="text-[20px] font-semibold text-center">
                    Event Centre
                </h2>
                <p className="text-center text-[#414B5A]">check-in:</p>
            </div>

            {cards?.map((event) => (
                <div
                    key={event.category}
                    className={`${event.bgColor} p-6 rounded-[20px] flex gap-4 items-center cursor-pointer`}
                    onClick={() => navigate(event.category)}
                >
                    <div
                        className={`flex items-center justify-center w-10 h-10 ${event.iconBg} text-white rounded-[15px]`}
                    >
                        {event.icon}
                    </div>
                    <div className="space-y-2">
                        <h3
                            className={`text-[14px] font-bold ${event.textColor}`}
                        >
                            {event.title}
                        </h3>
                        <p className="text-[10px] text-gray-600 font-light">
                            {event.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const mergeEventClassWithUI = (apiData) => {
    return eventData.map((item) => {
        const match = apiData?.find((d) => d.code === item.category);

        if (!match) return item; // No match → keep default

        return {
            ...item,
            title: match.name_ || item.title,
            description: match.description || item.description,
            category: match.code, // overwrite category with API code
            logo_1: match.logo_1,
        };
    });
};
