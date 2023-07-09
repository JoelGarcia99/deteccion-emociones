import { Button, Grid, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useDispatch, useSelector } from 'react-redux';
import { AuthState } from '../../redux/reducers/auth.reducer';
import { AppDispatch, RootState } from '../../redux/store';
import AppBarComponent from "../../shared_widgets/Navbar";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import { useContext, useState } from 'react';
import { User } from '../../../dominio/entities/user.entity';
import UserController from '../../redux/events/user.event';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import classMerge from '../../../core/utils/class_merge';
import StickyHeadTable from './table-history';



// registering needed charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Historial de predicciones realizadas por mes'
    },
  },
};

const labels = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export const UserProfile = () => {

  const { user } = useSelector((state: RootState) => state.auth) as AuthState;

  // Using the userAux as form handler
  const [userAux, setUserAux] = useState<User>({
    ...user!,
  })

  const dispatch = useDispatch<AppDispatch>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Used to determine if the user content changed in the form so we can show the update button
  // the [userAux] and [user] are compared to detect changes
  let divergentUser;

  if (userAux.emailRecuperacion !== user?.emailRecuperacion || userAux.nombre !== user?.nombre || userAux.fechaNacimiento !== user?.fechaNacimiento) {
    divergentUser = true;
  } else {
    divergentUser = false;
  }

  const updateData = () => {
    const userController = new UserController();

    dispatch(userController.update(userAux));
  }

  const updatePassword = () => {
    alert("Actualizando contraseña");
  }

  // TODO:
  const predictionsByMonthData = {
    labels,
    datasets: [
      {
        label: 'Predicciones',
        data: labels.map(() => Math.random() * 100),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const predictionsByEmotionsData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <AppBarComponent />,
      <div className="flex flex-col justify-center items-center py-[2rem] px-[3rem]">
        <div className="flex my-4 w-full justify-between items-center flex-row">
          <span
            className="text-2xl font-bold text-indigo-500"
          >
            DATOS DE USUARIO
          </span>
          {
            (divergentUser || !(password?.length === 0)) &&
            <div>
              <Button
                variant='outlined'
                onClick={
                  password?.length === 0 ? updateData : updatePassword
                }
              >
                {
                  password?.length === 0 ? "Guardar cambios" : "Cambiar contraseña"
                }
              </Button>
            </div>
          }
        </div>
        <Grid container spacing={{ xs: 2 }}>
          <Grid item xs={12} sm={6} lg={4}>
            <TextField
              label="Correo"
              variant="filled"
              disabled={true}
              fullWidth={true}
              value={userAux.email}
              onChange={(e) => setUserAux({ ...userAux, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <TextField
              label="Correo de recuperación"
              variant="filled"
              disabled={!(password?.length === 0)}
              helperText={!(password?.length === 0) ? 'Editando contraseña' : ''}
              fullWidth={true}
              value={userAux?.emailRecuperacion}
              onChange={(e) => setUserAux({ ...userAux, emailRecuperacion: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <TextField
              label="Nombre"
              variant="filled"
              disabled={!(password?.length === 0)}
              helperText={!(password?.length === 0) ? 'Editando contraseña' : ''}
              fullWidth={true}
              value={userAux.nombre}
              onChange={(e) => setUserAux({ ...userAux, nombre: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha de nacimiento"
                maxDate={dayjs(Date.now())}
                minDate={dayjs(new Date('1900-01-01'))}
                disabled={!(password?.length === 0)}
                defaultValue={dayjs(userAux.fechaNacimiento ?? new Date())}
                sx={{ width: '100%' }}
                onChange={(newValue) => setUserAux({ ...userAux, fechaNacimiento: newValue?.toDate() ?? userAux.fechaNacimiento })}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <TextField
              label="Contraseña"
              variant="filled"
              type="password"
              fullWidth={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <TextField
              label="Confirmar Contraseña"
              variant="filled"
              fullWidth={true}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Grid>
        </Grid>
        <div className="flex my-4 w-full justify-between items-center flex-row">
          <span
            className="text-2xl font-bold text-indigo-500"
          >
            {"Resumen estadístico".toUpperCase()}
          </span>
        </div>
      </div>
      <div className={classMerge(
        'p-10 flex flex-row justify-evenly items-center flex-wrap',
      )}>
        <div className="w-[60%] min-w-[500px]">
          <Bar options={options} data={predictionsByMonthData} />
        </div>
        <div className='w-[30%] min-w-[300px]'>
          <Pie data={predictionsByEmotionsData} options={{
            plugins: {
              legend: {
                position: 'top' as const,
              },
              title: {
                display: true,
                text: 'Predicciones por emociones'
              }
            },
          }} />
        </div>
      </div>
      <div className="p-10">
        <h3 className="text-xl font-bold text-center">
          Historial de predicciones
        </h3>
        <StickyHeadTable />
      </div>
    </>
  );
}
