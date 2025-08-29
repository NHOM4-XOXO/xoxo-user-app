const LoadingOverlay = () => {
    return (
        <div className="absolute inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="loader border-4 border-white border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
        </div>
    );
};

export default LoadingOverlay;
