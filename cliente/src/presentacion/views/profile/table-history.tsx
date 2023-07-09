import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import React, { useEffect } from "react";
import { translateEmotion } from "../../../core/utils/emotion_translator";
import { IPrediccion } from "./profile.edit";
import LaunchIcon from '@mui/icons-material/Launch';
import Launch from "@mui/icons-material/Launch";
import dayjs from "dayjs";

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'emocion', label: 'Emoción', minWidth: 100 },
  { id: 'url', label: 'Imagen URL', minWidth: 170 },
  {
    id: 'recurso',
    label: 'Recurso',
    minWidth: 150,
    align: 'right',
  },
  {
    id: 'date',
    label: 'F. Predicción',
    minWidth: 170,
    align: 'right',
  },
];

interface Data {
  emocion: 'angry' | 'fear' | 'happy' | 'sad' | 'surprise' | 'neutral';
  url: string;
  recurso: string;
  date: string;
}

export enum Emotion {
  Angry = 'angry',
  Fear = 'fear',
  Happy = 'happy',
  Sad = 'sad',
  Surprise = 'surprise',
  Neutral = 'neutral',
}

function createData(
  emocion: Emotion,
  url: string,
  recurso: string,
  date: string
): Data {
  return {
    emocion,
    url,
    recurso,
    date,
  };
}


export default function StickyHeadTable({
  predictions,
}: { predictions: IPrediccion[] }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [rows, setRows] = React.useState<readonly Data[]>([]);

  useEffect(() => {
    setRows([
      ...predictions.map((p) =>
        createData(
          p.resource.proposito as Emotion,
          p.media?.url,
          p.resource.embebido,
          p.createdAt
        )
      ),
    ]);
  }, [predictions]);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {columns.map((column, index2) => {
                      let value = row[column.id as keyof Data];
                      let htmlChild: React.ReactElement;

                      if (index2 === 1) {
                        htmlChild = <a
                          href={value}
                          target="_blank"
                          className="underline-offset-auto text-blue-500"
                        >
                          {value}
                        </a>;
                      }
                      else if (index2 === 0) {
                        htmlChild = <span>{translateEmotion(value)}</span>;
                      }
                      else if (index2 === 2) {
                        htmlChild = <a
                          href={value}
                          target="_blank"
                          className="underline-offset-auto text-blue-500"
                        >
                          Navegar al recurso recomendado&nbsp;<LaunchIcon />
                        </a>;
                      }
                      else if (index2 === 3) {
                        htmlChild = <span>{dayjs(value).add(0, 'hours').format('DD/MM/YYYY, HH:mm')}</span>;
                      }
                      else {
                        htmlChild = <span>{value}</span>;
                      }

                      return (
                        <TableCell key={column.id} align={column.align}>
                          {htmlChild}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
