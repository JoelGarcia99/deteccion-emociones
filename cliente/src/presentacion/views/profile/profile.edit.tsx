import { Button, Grid, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useDispatch, useSelector } from 'react-redux';
import { AuthState } from '../../redux/reducers/auth.reducer';
import { AppDispatch, RootState } from '../../redux/store';
import AppBarComponent from "../../shared_widgets/Navbar";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
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
import SaveIcon from '@mui/icons-material/Save';
import { Resource as IResource } from '../process/recommendations';
import { translateEmotion } from '../../../core/utils/emotion_translator';



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
      text: 'Historial de predicciones realizadas por día'
    },
  },
};

const labels = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

export interface IMedia {
  id: string;
  url: string;
  tipo: string;
  createdAt: string;
}

export interface IPrediccion {
  id: string;
  media: IMedia;
  resource: IResource;
  createdAt: string;
}

export const UserProfile = () => {

  const { user, accessToken } = useSelector((state: RootState) => state.auth) as AuthState;

  // Using the userAux as form handler
  const [userAux, setUserAux] = useState<User | null>(null)

  const dispatch = useDispatch<AppDispatch>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userPredictions, setUserPredictions] = useState<IPrediccion[]>([]);

  useEffect(() => {
    setUserAux({ ...user! });
  }, [user])

  // loading data from SS
  useEffect(() => {
    if (!accessToken) {
      return;
    }

    fetch(`${process.env.REACT_APP_API_HOST}/api/prediccion/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    }).then(async (r) => {
      if (!r.ok) {
        alert((await r.json()).message);
        return;
      }

      const data = await r.json();
      data.sort((a: IPrediccion, b: IPrediccion) => {
        return (new Date(b.createdAt)).getTime() - (new Date(a.createdAt)).getTime();
      });
      setUserPredictions(data);
    })
  }, [accessToken]);

  // Used to determine if the user content changed in the form so we can show the update button
  // the [userAux] and [user] are compared to detect changes
  let divergentUser;

  if (!userAux) {
    return <h1>Cargando usuario...</h1>;
  }

  if (userAux.emailRecuperacion !== user?.emailRecuperacion || userAux.nombre !== user?.nombre || userAux.fechaNacimiento !== user?.fechaNacimiento) {
    divergentUser = true;
  } else {
    divergentUser = false;
  }

  const updateData = () => {
    const userController = new UserController();

    dispatch(userController.update({
      ...userAux,
      password: password
    }));
  }

  const updatePassword = () => {

    // verifying the password matches
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const userController = new UserController();

    dispatch(userController.update({
      ...userAux,
      password: password,
    }));
  }

  // TODO:
  const predictionsByMonthData = {
    labels,
    datasets: [
      {
        label: 'Predicciones',
        data: [1, 2, 3, 4, 5, 6, 0].map((day) => {
          let counter = 0;

          for (const prediction of userPredictions) {
            const tempDate = new Date(prediction.createdAt);
            const dbDay = (new Date(tempDate.getTime())).getDay()

            if (day === dbDay) {
              counter++;
            }
          }
          return counter;
        }),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  // extracting all the present emotions in predictions
  const availableEmotions: string[] = [];

  for (const emotion of userPredictions) {
    if (!availableEmotions.includes(emotion.resource.proposito)) {
      availableEmotions.push(emotion.resource.proposito);
    }
  }

  const pieProcessedData = availableEmotions.map(
    (emotion) => {
      return userPredictions.filter(
        prediction => emotion === prediction.resource.proposito
      ).length
    }
  );

  const predictionsByEmotionsData = {
    labels: availableEmotions.map((x) => translateEmotion(x)),
    datasets: [
      {
        data: pieProcessedData,
        label: '# de predicciones',
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
        {
          pieProcessedData.length > 0 &&
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
        }
      </div>
      <div className="p-10">
        <h3 className="text-xl font-bold text-center">
          <span>Historial de predicciones</span>&nbsp;
          <Button
            variant="outlined"
            id="download-data"
            endIcon={<SaveIcon />}
            className="mx-2"
            onClick={() => {
              if (!accessToken) {
                console.log("No AT provided");
                return;
              }

              fetch(`${process.env.REACT_APP_API_HOST}/api/prediccion/download`, {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                }
              }).then(async (r) => {
                const json = await r.json();
                // Create a blob with the data we want to download as a file
                const blob = new Blob([JSON.stringify(json)], { type: 'application/json' })
                // Create an anchor element and dispatch a click event on it
                // to trigger a download
                const a = document.createElement('a')
                a.download = "data.json"
                a.href = window.URL.createObjectURL(blob)
                const clickEvt = new MouseEvent('click', {
                  view: window,
                  bubbles: true,
                  cancelable: true,
                })
                a.dispatchEvent(clickEvt)
                a.remove()
              })
            }}
          >
            Descargar
          </Button>
        </h3>
        <StickyHeadTable predictions={userPredictions} />
      </div>
    </>
  );
}
