import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

import Container from "@/components/ui/container";
import MainNav from "@/components/main-nav";

const Navbar = () => {
  return (
    <div className="py-4">
      <Container>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 justify-start">
            <div className="max-w-[20px] lg:max-w-[50px]">
              <Image
                className="max-w-xs"
                src={"/logo.png"}
                alt="lilyandco"
                width={3443}
                height={5030}
                layout="responsive"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold leading-8">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Manage your store</p>
            </div>
          </div>
          <div className="flex items-center gap-6 lg:gap-10">
            <MainNav />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
