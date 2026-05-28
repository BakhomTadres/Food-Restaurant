export default function Notification({ type }: { type: "success" | "error" }) {
  return (
    <div
      className={
        type === "success"
          ? `fixed z-50 bottom-4 right-4 bg-green-700 text-white p-4 rounded-md shadow-lg`
          : `fixed z-50 bottom-4 right-4 bg-red-700 text-white p-4 rounded-md shadow-lg`
      }
    >
      {type === "success" ? (
        <div>
          <i className="fa-regular fa-circle-check"></i> Added to Cart
          successfully!
        </div>
      ) : (
        <div>
          <i className="fa-regular fa-circle-xmark"></i> Removed from Cart
          successfully!
        </div>
      )}
    </div>
  );
}
