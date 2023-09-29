import Container from "@/components/ui/container";
import { ColorForm } from "./component/size-form";
import prismadb from "@/lib/prismadb";

const SizePage = async ({ params }: { params: { sizeId: string } }) => {
  const size = await prismadb.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });

  return (
    <div>
      <Container>
        <ColorForm initialData={size} />
      </Container>
    </div>
  );
};

export default SizePage;
