import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import RouteNames from '../../routes/names.route';
import { Link as RRDLink } from 'react-router-dom';
import AuthController from '../../redux/events/auth.event';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { Button } from '@mui/material';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://utm.edu.ec/" target={"_blank"}>
        UTM
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const authController = new AuthController();
    dispatch(authController.login(
      (data.get('email') ?? '').toString(),
      (data.get('password') ?? '').toString()
    ));
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Inicio de sesión
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo electrónico"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar sesión
            </Button>
            <Grid container>
              <Grid item>
                <RRDLink
                  to={RouteNames.REGISTER}
                  className="text-blue-600 text-sm"
                >
                  {"¿No tiene una cuenta? Regístrese"}
                </RRDLink>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item>
                <div
                  onClick={() => {
                    const host = process.env.REACT_APP_API_HOST;

                    let email = prompt('Ingrese su correo electrónico');

                    if (!email) {
                      alert('Debe ingresar un correo electrónico');
                      return;
                    }

                    fetch(`${host}/api/auth/recover-password`, {
                      method: 'POST',
                      body: JSON.stringify({
                        email,
                      })
                    }).then(response => response.json()).then(data => {
                      if (data.message) {
                        alert(data.message);
                      }
                    });
                  }}
                  className="text-blue-600 text-sm cursor-pointer"
                >
                  {"¿Olvidó su contraseña?"}
                </div>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
