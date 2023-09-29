interface HeadingProps {
    title: string;
    description: string;
}

const Heading: React.FC<HeadingProps> = ({
    title,
    description
}) => {
    return ( 
        <div className="">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground ml-1">{description}</p>
        </div>
    )
}

export default Heading;