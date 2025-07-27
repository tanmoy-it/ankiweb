export default function Ico({src="", className="", size = 24, alt = "icon", style={}}) {
    return (
        <div className="inline-flex justify-center items-center"  >
            <img
                src={src}
                alt={alt}
                width={size*5}
                height={size*5}
                className={`w-${size} h-${size} ${className}`}
                style={{ ...style, width: `${size}px`, height: `${size}px` }}
            />
        </div>
    );
}