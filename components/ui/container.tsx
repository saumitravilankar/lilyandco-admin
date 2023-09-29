interface ContainerProps {
    children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({
    children
}) => {
    return (
        <div className="mx-auto max-w-7xl px-4 2xl:px-0">
            {children}
        </div>
    )
}

export default Container;