import { Nothing } from "@/assets/icons";

interface NothingFoundProps {
    message: string;
}

export const NothingFound = ({ message }: NothingFoundProps) => {
    return (
        <div className="w-full h-full bg-transparent p-12 text-center items-center justify-center flex flex-col gap-4">
            <Nothing className="w-64 h-64 text-muted" />
            <p className="text-muted text-lg font-semibold">{message}</p>
        </div>
    )
}