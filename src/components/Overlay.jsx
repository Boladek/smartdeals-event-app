export function Overlay() {
    return (
        <div
            className="fixed w-full top-0 left-0 h-screen z-1000 flex justify-center items-center bg-white/90"
            style={{
                zIndex: 9999,
            }}
        >
            <div className="p-6 max-w-sm min-w-36 w-full space-y-6">
                <div className="w-full h-full flex flex-col justify-center items-center">
                    <div className="flex justify-center space-x-2">
                        {/* Dot 1 */}
                        <div className="w-2 h-2 bg-gray-700 rounded-full animate-bounce delay-200"></div>
                        {/* Dot 2 */}
                        <div className="w-2 h-2 bg-gray-700 rounded-full animate-bounce delay-500"></div>
                        {/* Dot 3 */}
                        <div className="w-2 h-2 bg-gray-700 rounded-full animate-bounce delay-800"></div>
                    </div>
                </div>
                <div>
                    <p className="text-gray-800 text-center text-md">
                        Processing...
                    </p>
                    <p className="text-gray-800 text-center text-xs">
                        Kindly hold on for few Seconds
                    </p>
                </div>
            </div>
        </div>
    );
}
