import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import AppBarComponent from "../../shared_widgets/Navbar";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { WebcamCapture } from './webcam_capture';
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <VideoLabelIcon />,
    2: <SettingsIcon />,
    3: <GroupAddIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = [
  'Capturar imagen',
  'Procesar imagen',
  'Recomendaciones',
];

export function ProcessStep() {

  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [capturedImg, setCaptureImg] = React.useState<string | null>(null);
  let [loading, setLoading] = useState(true);

  const components = [
    <WebcamCapture
      onNext={(img) => {
        setCaptureImg(img);
        setActiveStep(1);
      }}
    />,
    <div
      className='flex flex-col items-center justify-center'
    >
      <h2
        className="text-xl font-bold"
      >
        Analizando imagen
      </h2>
      <ClipLoader
        color={"blue"}
        loading={loading}
        size={60}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <span>Trabajando sobre la siguiente imagen</span>
      <img src={capturedImg ?? ''} />
    </div>
  ];

  return (
    <Stack sx={{ width: '100%' }} spacing={4}>
      <AppBarComponent />
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={
          <ColorlibConnector />
        }
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {
        components[activeStep]
      }
    </Stack>
  );
}
