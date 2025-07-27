"use client";

import { useState } from "react";
import Image from "next/image";

interface ProfileImageProps {
	src: string;
	alt: string;
}

export function ProfileImage({ src, alt }: ProfileImageProps) {
	const [imageSrc, setImageSrc] = useState(src);
	const fallbackImage = "https://cdn.midjourney.com/067ea16b-4d91-4342-a7f3-80c90825ae47/0_0.jpeg";

	const handleError = () => {
		if (imageSrc !== fallbackImage) {
			setImageSrc(fallbackImage);
		}
	};

	return (
		<Image
			src={imageSrc}
			alt={alt}
			width={2048}
			height={2048}
			className="w-full h-full object-cover"
			placeholder="blur"
			blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
			onError={handleError}
		/>
	);
}
