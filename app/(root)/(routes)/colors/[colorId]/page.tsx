import Container from "@/components/ui/container";
import { ColorForm } from "./component/color-form";
import prismadb from "@/lib/prismadb";

const ColorPage = async ({ params }: { params: { colorId: string } }) => {
  const color = await prismadb.color.findUnique({
    where: {
      id: params.colorId,
    },
  });

  return (
    <div>
      <Container>
        <ColorForm initialData={color} />
      </Container>
    </div>
  );
};

export default ColorPage;
