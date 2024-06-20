import AsideAccount from "../components/AsideAccountComponent";
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './style/AccountPage.scss';

function createData(
    name: string,
    calories: string,
    fat: string,
) {
    return { name, calories, fat };
}

const rows = [
    createData('#838484', 'October 17', 'S/. 23'),
    createData('#838484', 'October 17', 'S/. 23'),
    createData('#838484', 'October 17', 'S/. 23'),
    createData('#838484', 'October 17', 'S/. 23'),
    createData('#838484', 'October 17', 'S/. 23'),
    createData('#838484', 'October 17', 'S/. 23'),
    createData('#838484', 'October 17', 'S/. 23'),
    createData('#838484', 'October 17', 'S/. 23'),
    createData('#838484', 'October 17', 'S/. 23'),
];

function MisCompras() {
    return (
        <>
        <main className="main flex">
            <AsideAccount />
            <section className="account-details">
                <h2>Historial de compras</h2>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Numero ID</TableCell>
                                <TableCell align="right">Fecha</TableCell>
                                <TableCell align="right">Precio</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.calories}</TableCell>
                                    <TableCell align="right">{row.fat}</TableCell>
                          
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </section>
        </main>

        </>
    )
}
export default MisCompras;