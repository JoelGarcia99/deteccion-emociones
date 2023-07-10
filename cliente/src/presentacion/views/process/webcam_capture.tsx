import React, { useEffect } from 'react'
import Webcam from 'react-webcam';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import classMerge from '../../../core/utils/class_merge';
import { Button } from '@mui/material';
import { translateEmotion } from '../../../core/utils/emotion_translator';

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
  const [firstCaptureEmotion, setFirstCaptureEmotion] = React.useState<string | null>(null);
  const [secondCaptureEmotion, setSecondCaptureEmotion] = React.useState<string | null>(null);
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);

  // loading the two images
  const [firstBase64Image, setFirstBase64Image] = React.useState<string | undefined>(undefined);
  const [secondBase64Image, setSecondBase64Image] = React.useState<string | undefined>(undefined);
  const [targetImage, setTargetImage] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    const recommendedImage = impactImagesList[
      Math.floor(Math.random() * impactImagesList.length)
    ];

    setTargetImage(recommendedImage);
  }, []);


  const onMultipleCapture = async (iter: number, base64: string) => {

    // if the secondary image is already loaded then do nothing
    if (secondBase64Image && firstBase64Image) {
      return;
    }

    // It'll help to show a random image of a cactus or something like that 
    // to see the impact on the user
    setIsMultiCapture(true);

    const blob = await fetch(base64).then((r) => r.blob());
    const url = `${process.env.REACT_APP_MODEL_HOST}/predict`;
    const formData = new FormData();
    formData.append('image', blob);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.ok === false) {
      alert(data.error);
      if (firstCaptureEmotion) {
        setSecondBase64Image(undefined);
        return;
      }
      else {
        window.location.reload();
      }
    }

    if (iter < 2) {
      setFirstBase64Image(base64);
      setSecondBase64Image(undefined);
      setFirstCaptureEmotion(data.prediction);
    }
    // if the secondary image isn't being captured yet then capture 
    // it, otherwise do nothing with the event
    else {
      setSecondBase64Image(base64);
      setSecondCaptureEmotion(data.prediction);
    }
  }

  const webcamRef = React.useRef<Webcam>(null);
  const capture = React.useCallback(
    async (): Promise<string | null | undefined> => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        if (isMultiCapture && !firstBase64Image) {
          setFirstBase64Image(imageSrc);
        }
        else {
          setSecondBase64Image(imageSrc);
        }
      }

      return imageSrc;
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
        {
          firstBase64Image &&
          <div
            className="flex flex-col justify-center items-center"
          >
            <h1
              className='text-[1.3rem] text-center font-bold'
            >
              Imagen capturada {firstCaptureEmotion ? `(${translateEmotion(firstCaptureEmotion)})` : ''}
            </h1>
            <img src={firstBase64Image} />
          </div> ||
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
        }
        {
          firstCaptureEmotion &&
          <div className="flex flex-col items-center">
            <h1
              className='text-[1.3rem] text-orange-600 text-center font-bold'
            >
              MIRA ESTA IMAGEN
            </h1>
            <img
              src={targetImage}
              alt=""
              style={{
                objectFit: 'contain',
              }}
              className="h-[300px] w-[300px]"
            />
          </div>
        }
        {
          ((secondBase64Image) && (!isMultiCapture) || ((secondBase64Image))) &&
          <div
            className="flex flex-col justify-center items-center"
          >
            <h1
              className='text-[1.3rem] text-center font-bold'
            >
              Imagen capturada {secondCaptureEmotion ? `(${translateEmotion(secondCaptureEmotion)})` : ''}
            </h1>
            <img src={secondBase64Image} />
          </div>
          || (
            isMultiCapture &&
            <div
              className='flex flex-col justify-center items-center'
            >
              <h1
                className='text-[1.3rem] text-center font-bold'
              >
                Capturar la segunda imagen
              </h1>
              <Webcam
                videoConstraints={videoConstraints}
                audio={false}
                ref={webcamRef}
              />
            </div>
          )
        }
      </div>
      <br />

      {
        (anyNotNull && !isMultiCapture) &&
        <Button
          variant="outlined"
          onClick={capture}
        >
          {
            secondBase64Image ? 'Capturar de nuevo' : 'Capturar'
          }
        </Button>
      }
      {
        (firstBase64Image || secondBase64Image) &&
        <>
          <br />
          {
            (firstCaptureEmotion && secondCaptureEmotion) &&
            <h2
              className="text-xl font-bold text-indigo-500"
            >
              {
                firstCaptureEmotion !== secondCaptureEmotion ?
                  `▓▓▓▓ LA EMOCIóN HA CAMBIADO DE ${translateEmotion(firstCaptureEmotion)} A ${translateEmotion(secondCaptureEmotion)} ▓▓▓`.toUpperCase()
                  : "▓▓▓▓ NO HA HABIDO UN IMPACTO CONSIDERABLE EN LA EMOCIóN ▓▓▓".toUpperCase()
              }
            </h2>
          }
          <br />

          <div className="flex flex-row justify-center items-center gap-4">
            <Button
              variant="contained"
              sx={{ backgroundColor: 'orange' }}
              onClick={
                async () => {

                  if (!firstBase64Image || !secondBase64Image) {
                    let tempBase64Image: string | null | undefined;
                    // capturing the second image if the first one already exists
                    if (firstBase64Image) {
                      tempBase64Image = await capture();
                    }

                    // Here I'm passing the secondBase64Image since it's always present 
                    // regardless of the user's choice. If the user chooses to go for 
                    // multi capture then the content of the secondary base64 image is 
                    // passed to the first base64 image.
                    onMultipleCapture(firstBase64Image ? 2 : 1, secondBase64Image ?? tempBase64Image!);
                  }
                  else {
                    onNext(secondBase64Image!);
                  }
                }
              }
            >
              {
                !isMultiCapture ?
                  "Proceder con captura múltiple" :
                  (
                    firstBase64Image && secondBase64Image ?
                      "Proceder con la predicción" : "Proceder con segunda captura"
                  )
              }
            </Button>
            {
              !isMultiCapture &&
              <Button
                variant="contained"
                onClick={
                  () => onNext(secondBase64Image!)
                }
              >
                Realizar la predicción
              </Button>
            }
          </div>
        </>
      }
    </div>
  )
}
