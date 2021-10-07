import Link from "next/link";
import Image from "next/image";

import mellinsLogo from "../static/public/Mellins_Logo.png";

export default function Nav() {
  return (
    <nav className="flex justify-between space-x-10">
      <div className="flex-shrink-0 h-auto w-72">
        <Image src={mellinsLogo} alt="Mellins i-Style" />
      </div>
      <div>
        <Link href="/">
          <a className="px-4 py-2 mr-4 text-lg text-white shadow-md bg-primary hover:bg-black border-lg">Orders</a>
        </Link>
      </div>
    </nav>
  );
}
