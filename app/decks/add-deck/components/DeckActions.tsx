"use client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Ico from "@/app/util-components/ico";

type DeckActionsProps = {
    addField: (type: "TEXT" | "IMAGE" | "AUDIO") => void;
};

export default function DeckActions({ addField }: DeckActionsProps) {
    return (
        <div className="flex justify-between">
            <h1 className="font-bold text-xl">Add Fields to Deck</h1>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant={"default"}
                        size={"default"}
                        className="bg-white/5 text-white flex items-center gap-2 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                    >
                        Add Field{" "}
                        <Ico
                            src="https://cdn-icons-png.flaticon.com/512/3524/3524388.png"
                            size={12}
                            className="invert"
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-transparent backdrop-blur-xs shadow-black/30 shadow-xl rounded-2xl">
                    <DropdownMenuLabel className="font-bold" inset={false}>
                        Select Field Type
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                        className={"cursor-pointer"}
                        inset={false}
                        onClick={() => addField("TEXT")}
                    >
                        <Ico
                            src="https://cdn-icons-png.flaticon.com/512/3721/3721901.png"
                            size={15}
                            className="invert"
                        />
                        Text
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className={"cursor-pointer"}
                        inset={false}
                        onClick={() => addField("IMAGE")}
                    >
                        <Ico
                            src="https://cdn-icons-png.flaticon.com/512/6499/6499530.png"
                            size={15}
                            className="invert"
                        />
                        Image
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className={"cursor-pointer"}
                        inset={false}
                        onClick={() => addField("AUDIO")}
                    >
                        <Ico
                            src="https://cdn-icons-png.flaticon.com/512/59/59284.png"
                            size={15}
                            className="invert"
                        />
                        Audio
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
