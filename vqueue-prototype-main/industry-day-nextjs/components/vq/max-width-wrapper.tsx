import { cn } from "@/lib/utils";
import { ReactNode } from "react"

const MaxWidthWrapper = ({
    className,
    children 
} : {
    className? : string
    children : ReactNode
}) => {

    return (
        // cn() set default styles if className is not provided 
        // if className has passed, then they append to default styles  
        <div className={cn(
            "max-auto w-full px-2.5 md:px-20 bg-white", 
            className
        )}>
            {children} 
        </div>
    );

}

export default MaxWidthWrapper