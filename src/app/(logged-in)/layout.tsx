import Link from "next/link";
import LogoutButton from "../logout-button";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-200 flex justify-between p-4 items-center">
        <ul className="flex gap-4">
          <li>
            <Link href="/my-account">Minha conta</Link>
          </li>
          <li>
            <Link href="/change-password">Alterar senha</Link>
          </li>
        </ul>
        <div>
          <LogoutButton />
        </div>
      </nav>
      <div className="flex flex-1 justify-center items-center">{children}</div>
    </div>
  );
}
