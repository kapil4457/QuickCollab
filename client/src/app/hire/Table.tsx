import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Link from "next/link";

export default function BasicTable({ users }) {
  return (
    <TableContainer
      component={Paper}
      className="w-[90%] bg-slate-700 dark:bg-white"
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              className="text-white text-xl font-bold dark:text-[rgba(0,0,0,0.7)] font-sans"
            >
              Number
            </TableCell>
            <TableCell
              className="text-white text-xl font-bold dark:text-[rgba(0,0,0,0.7)] font-sans"
              align="center"
            >
              Name{" "}
            </TableCell>
            <TableCell
              className="text-white text-xl font-bold dark:text-[rgba(0,0,0,0.7)] font-sans"
              align="center"
            >
              Rating
            </TableCell>
            <TableCell
              className="text-white text-xl font-bold dark:text-[rgba(0,0,0,0.7)] font-sans"
              align="center"
            >
              Experience &nbsp;(in years)
            </TableCell>

            <TableCell
              className="text-white text-xl font-bold dark:text-[rgba(0,0,0,0.7)] font-sans"
              align="center"
            >
              Chat
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.map((user, key) => (
            <TableRow
              key={user?.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                align="center"
                scope="user"
                className="text-white text-lg  font-bold dark:text-zinc-700"
              >
                {key + 1}
              </TableCell>
              <TableCell
                className="text-white text-lg  font-bold dark:text-zinc-700"
                component="th"
                scope="user"
                align="center"
              >
                {user?.name}
              </TableCell>
              <TableCell
                className="text-white text-lg  font-bold dark:text-zinc-700"
                align="center"
              >
                {user?.rating}
              </TableCell>
              <TableCell
                className="text-white text-lg  font-bold dark:text-zinc-700"
                align="center"
              >
                {user?.experience}
              </TableCell>
              <TableCell
                className="text-white  font-bold 
                text-lg dark:text-zinc-700 "
                align="center"
              >
                <Link
                  href={`/chats/${user?._id}`}
                  className="text-red-600 font-bold"
                >
                  Chat
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
