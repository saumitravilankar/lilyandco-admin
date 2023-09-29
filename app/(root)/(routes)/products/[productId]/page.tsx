import Container from "@/components/ui/container";
import { ProductForm } from "./component/product-form";
import prismadb from "@/lib/prismadb";

const ProductPage = async ({ params }: { params: { productId: string } }) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
      sizes: true,
      colors: true,
    },
  });

  const currentSizes = product?.sizes.map((size) => size.id);
  const currentColors = product?.colors.map((color) => color.id);

  if (product) {
    Number(product?.price);
  }

  const sizes = await prismadb.size.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const colors = await prismadb.color.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <Container>
        <ProductForm
          initialData={product}
          availableSizes={sizes}
          availableColors={colors}
          currentColors={currentColors}
          currentSizes={currentSizes}
        />
      </Container>
    </div>
  );
};

export default ProductPage;
