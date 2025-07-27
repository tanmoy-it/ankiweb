import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
export default function TT({
	children,
	tip,
}: {
	children: React.ReactNode;
	tip: string;
}) {
	return (
		<Tooltip >
			<TooltipTrigger>{children}</TooltipTrigger>
            <TooltipContent className="pointer-events-none">
                <p>{tip}</p>
            </TooltipContent>
		</Tooltip>
	);
}
