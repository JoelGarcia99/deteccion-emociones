import React from 'react'
import Webcam from 'react-webcam';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import classMerge from '../../../core/utils/class_merge';
import { Button } from '@mui/material';
import { ClassNames } from '@emotion/react';

interface WebcamCaptureProps {
  onNext: (base64Image: string) => void;
}

const videoConstraints = {
  width: 500,
  height: 300,
  facingMode: "user"
};

export const WebcamCapture = ({
  onNext,
}: WebcamCaptureProps) => {

  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);
  const [base64Image, setBase64Image] = React.useState<string>('');
  const [predictedEmotion, setPredictedEmotion] = React.useState<string>('');

  const webcamRef = React.useRef<Webcam>(null);
  const capture = React.useCallback(
    async () => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setBase64Image(imageSrc);
      }
    },
    [webcamRef],
  );

  const handleDevices = React.useCallback(
    (mediaDevices: MediaDeviceInfo[]) => {
      setDevices(mediaDevices)
    },
    [setDevices]
  );

  React.useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices)
  }, [handleDevices]);

  // determines all the video devices available on the user device
  const videoDevices = devices.filter(device => device.kind === 'videoinput');

  // determines if there is at least one video device with a label
  const anyNotNull = videoDevices.find(device => device.label !== '') !== undefined;

  return (
    <div
      className={
        classMerge(
          'flex flex-col justify-center items-center',
        )
      }
    >
      {
        !anyNotNull &&
        <div
          className={
            classMerge(
              'flex flex-col justify-center items-center',
            )
          }
        >
          <OndemandVideoIcon
            sx={{
              fontSize: 100,
              color: 'primary.main',
            }}
          />
          <br />

          <h1
            className={
              classMerge(
                'text-[1rem] text-center',
              )
            }
          >
            No hay dispositivos de video disponibles <br />
            Por favor, conecte una cámara web o conceda permisos para usar la cámara
            actual y recargue la página
          </h1>
          <hr />
          <br />
        </div>
      }
      <div
        className={
          classMerge(
            'flex flex-row justify-center items-center',
            'gap-2 flex-wrap'
          )
        }
      >
        <div
          className='flex flex-col justify-center items-center'
        >
          <h1
            className='text-[1.3rem] text-center font-bold'
          >
            Captura de imagen
          </h1>
          <Webcam
            videoConstraints={videoConstraints}
            audio={false}
            ref={webcamRef}
          />
        </div>
        {
          base64Image &&
          <div
            className="flex flex-col justify-center items-center"
          >
            <h1
              className='text-[1.3rem] text-center font-bold'
            >
              Imagen capturada
            </h1>
            <img src={base64Image} />
          </div>
        }
      </div>
      <br />

      {
        anyNotNull &&
        <Button
          variant="outlined"
          onClick={capture}
        >
          {
            base64Image ? 'Capturar de nuevo' : 'Capturar'
          }
        </Button>
      }
      {
        base64Image && <>
          <br />

          <Button
            variant="contained"
            onClick={
              () => onNext(base64Image)
            }
          >
            Continuar al siguiente paso
          </Button>
        </>
      }
    </div>
  )
}
