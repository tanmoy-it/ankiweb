export default function Pdiv({
	src,
	size,
	opacity,
	children,
	className,
	blendMode = "multiply" as React.CSSProperties["mixBlendMode"],
}: {
	src?: string;
	size?: number;
	opacity?: number;
	children?: React.ReactNode;
	className?: string;
	blendMode?: React.CSSProperties["mixBlendMode"];
}) {
	return (
		<div className={`min-w-full min-h-full rounded-[inherit] relative ${className}`}>
			{/* Background pattern layer with blend mode */}
			<div
				className="absolute inset-0 rounded-[inherit]"
				style={{
					backgroundImage: `url("${src ??
						"https://i.pinimg.com/736x/91/b9/0c/91b90cb683576c61f03f5e731ae31b51.jpg"
					}")`,
					backgroundSize: `${size ?? 100}px ${size ?? 100}px`,
					backgroundRepeat: "repeat",
					backgroundPosition: "center",
					opacity: opacity ?? 0.1,
					mixBlendMode: blendMode,
				}}
			/>
			{/* Content layer - unaffected by blend mode */}
			<div className="relative z-10">{children}</div>
		</div>
	);
}
