import { Button } from '@mui/material';
import React, { useEffect } from 'react'
import { ClipLoader } from 'react-spinners'

interface ImageProcessingProps {
  imageSrc: string | undefined | null;
  onNext: (emotion: string) => void;
  onBack: () => void;
}

export const ImageProcessing = (props: ImageProcessingProps) => {

  const [hasError, setHasError] = React.useState<string | null>(null);

  useEffect(() => {

    const process = async () => {
      const blob = await fetch(props.imageSrc!).then((r) => r.blob());
      const url = 'http://localhost:8200/predict';
      const formData = new FormData();
      formData.append('image', blob);


      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.ok) {
        setHasError(data.error);
      }
      else {
        props.onNext(data.prediction);
      }
    }

    process();
  }, [props.imageSrc]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h2
        className="text-xl font-bold"
      >
        Analizando imagen
      </h2>
      <ClipLoader
        color={"blue"}
        size={60}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <img src={props.imageSrc ?? ''} />
      {
        hasError
        &&
        <p className="text-red-500">
          {hasError} Vuelva al paso anterior y tome una mejor captura
        </p>
      }
      <div className="my-4"></div>
      <Button
        variant="contained"
        onClick={() => {
          props.onBack();
        }}
      >
        Volver a capturar rostro
      </Button>
    </div >
  );
}
