import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types";
import Link from "next/link";
import { routes } from "@/constants";

export function UserTable({ users }: { users: User[] }) {
  const statusStyles: Record<"active" | "inactive", string> = {
    active: "border-emerald-900 text-emerald-400",
    inactive: "border-red-900 text-red-400",
  };

  return (
    <div className="space-y-4">
      <div className="border border-[#2C2621] bg-[#241F1B] overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#141211]/30">
            <TableRow className="border-[#2C2621] hover:bg-transparent">
              <TableHead className="text-[14px] text-white uppercase">
                S/N
              </TableHead>
              <TableHead className="text-[14px] text-white uppercase">
                User
              </TableHead>
              <TableHead className="text-[14px] text-white uppercase text-right">
                Role
              </TableHead>
              <TableHead className="text-[14px] text-white uppercase text-right">
                Status
              </TableHead>
              <TableHead className="text-[14px] text-white uppercase text-right">
                Last Login
              </TableHead>
              <TableHead className="text-[14px] text-white uppercase text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, i) => {
              const status: "active" | "inactive" = user.account_enabled
                ? "active"
                : "inactive";

              return (
                <TableRow key={user.id} className="border-[#2C2621] text-xs hover:bg-transparent">
                  <TableCell className="font-medium">{i + 1}.</TableCell>

                  <TableCell className="font-medium capitalize">
                    {user.first_name} {user.last_name}
                  </TableCell>

                  <TableCell className="text-right font-mono">
                    {user.role}
                  </TableCell>

                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={`capitalize ${statusStyles[status]}`}
                    >
                      {status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    {new Date(user.last_login!).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right">
                    <Link
                      href={`${routes.USERS}/${user.id}`}
                      className="text-[#E6A15C] hover:text-[#e6c19c] font-bold underline underline-offset-4"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
