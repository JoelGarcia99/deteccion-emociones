import React from 'react'
import Webcam from 'react-webcam';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import classMerge from '../../../core/utils/class_merge';
import { Button } from '@mui/material';

interface WebcamCaptureProps {
  onNext: (base64Image: string) => void;
}

const videoConstraints = {
  width: 500,
  height: 300,
  facingMode: "user"
};

const impactImagesList = [
  '/lioness.png',
  '/cactus.jpg',
  '/nature.jpg',
  '/sea.jpg',
  '/car.png',
  '/cat.png',
  '/dog.jpg',
  '/football.png',
];

export const WebcamCapture = ({
  onNext,
}: WebcamCaptureProps) => {

  const [isMultiCapture, setIsMultiCapture] = React.useState<boolean>(false);

  // storing the first & second captures to see if there's any difference
  const [firstCaptureEmotion, setFirstCaptureEmotion] = React.useState<string>('');
  const [secondCaptureEmotion, setSecondCaptureEmotion] = React.useState<string>('');

  const onMultipleCapture = async (iter: number, base64: string) => {
    // It'll help to show a random image of a cactus or something like that 
    // to see the impact on the user
    setIsMultiCapture(iter < 2);

    // TODO:
    const blob = await fetch(base64).then((r) => r.blob());
    const url = `${process.env.REACT_APP_MODEL_HOST}/predict`;
    const formData = new FormData();
    formData.append('image', blob);


    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (iter < 2) {
      setFirstCaptureEmotion(data.prediction);
    }
    else {
      setSecondCaptureEmotion(data.prediction);
    }
  }

  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);
  const [base64Image, setBase64Image] = React.useState<string>('');

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
    navigator.permissions.query({ name: 'camera' as PermissionName })
      .then(function(permissionStatus) {
        if (permissionStatus.state === 'granted') {
          navigator.mediaDevices.enumerateDevices().then(handleDevices)
        }
        permissionStatus.onchange = function() {
          if (permissionStatus.state === 'granted') {
            navigator.mediaDevices.enumerateDevices().then(handleDevices)
          }
        };
      });
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
            'gap-4 flex-wrap'
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
          firstCaptureEmotion &&
          <div className="flex flex-col items-center">
            <h1
              className='text-[1.3rem] text-orange-600 text-center font-bold'
            >
              MIRA ESTA IMAGEN
            </h1>
            <img
              src={impactImagesList[Math.floor(Math.random() * impactImagesList.length)]}
              alt=""
              style={{
                objectFit: 'contain',
              }}
              className="h-[300px] w-[300px]"
            />
          </div>
        }
        {
          (base64Image) &&
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

          <div className="flex flex-row justify-center items-center gap-4">
            <Button
              variant="contained"
              sx={{ backgroundColor: 'orange' }}
              onClick={
                () => onMultipleCapture(1, base64Image)
              }
            >
              {
                !isMultiCapture ?
                  "Proceder con captura múltiple" : "Proceder con segunda captura"
              }
            </Button>
            {
              !isMultiCapture &&
              <Button
                variant="contained"
                onClick={
                  () => onNext(base64Image)
                }
              >
                Continuar al siguiente paso
              </Button>
            }
          </div>
        </>
      }
    </div>
  )
}
