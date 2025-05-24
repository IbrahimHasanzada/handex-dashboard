"use client"

import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HexColorPicker } from "react-colorful";

export function ColorPicker({
    value,
    onChange,
}: {
    value: string;
    onChange: (color: string) => void;
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="flex gap-2">
                    <Input
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-[120px]"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        className={cn(
                            "w-[60px] h-10 p-2 rounded-md border",
                            "flex items-center justify-center"
                        )}
                    >
                        <div
                            className="w-full h-full rounded-sm"
                            style={{ backgroundColor: value }}
                        />
                    </Button>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-2">
                <HexColorPicker color={value} onChange={onChange} />
            </PopoverContent>
        </Popover>
    );
}