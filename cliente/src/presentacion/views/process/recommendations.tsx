import { Button } from '@mui/material';
import React, { ReactNode, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { translateEmotion } from '../../../core/utils/emotion_translator';
import { AuthState } from '../../redux/reducers/auth.reducer';
import { RootState } from '../../redux/store';

interface RecommendationsProps {
  onReboot: () => void;
  imageSrc: string | undefined | null;
  emotion: string | undefined | null;
}

export interface Resource {
  id: string;
  nombre: string;
  tipo: string;
  url: string;
  embebido: string;
  proposito: string;
}

export const Recommendations = (props: RecommendationsProps) => {

  // extracting the access token
  const { accessToken } = useSelector((state: RootState) => (state.auth as AuthState));
  const [resources, setResources] = React.useState<any | null>(null);
  const [suggestedResource, setSuggestedResource] = React.useState<Resource | null>(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_HOST}/api/resources`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    })
      .then(async (r) => {
        if (!r.ok) {
          alert((await r.json()).message[0]);
          return;
        }

        const data = await r.json();

        // setting the resources list
        setResources(data);


        const emotion = props.emotion;
        const image = props.imageSrc;

        const suggestedEmotionResources = data[emotion!];

        const suggestion: Resource = suggestedEmotionResources[
          Math.floor(Math.random() * suggestedEmotionResources.length)
        ];

        // updating the suggested emotion
        setSuggestedResource(suggestion);

        // const splittedBase64 = image!.split(',');
        // const cleanedBlob = splittedBase64[1];

        // parsing base64 image to blob
        const blob = await fetch(image!).then((r) => r.blob());

        console.log("Blob file is: ", blob);

        // transforming base64 image to blob
        const formData = new FormData();
        formData.append('media[tipo]', 'image');
        formData.append('media[file]', blob, 'image.jpg');
        formData.append('emocionDetectada', emotion!);
        formData.append('recursoId', suggestion.id);

        // updating the predicted resource in the background
        fetch(`${process.env.REACT_APP_API_HOST}/api/prediccion/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          body: formData
        });
      })
  }, []);

  // preventing rendering the wrong content
  if (!resources) {
    return <h1>Cargando recursos, espere...</h1>;
  }


  // Here I'll save the prediction directly to the user account

  return (
    <div className="flex flex-col items-center justify-center">
      <h2
        className="text-3xl my-2 font-bold"
      >
        Emoción detectada correctamente
      </h2>
      <img src={props.imageSrc ?? ''} />
      <h3
        className="text-xl my-2 font-bold"
      >
        <span className="text-blue-800">
          La emoción dominante es:
        </span>&nbsp;
        <span className="text-green-800">
          {translateEmotion(props.emotion)}
        </span>
      </h3>
      <div className="flex p-4 w-full flex-col justify-start items-center my-4">
        <div
          className="flex w-full flex-col justify-start items-start"
        >
          <span className="text-xl font-bold text-indigo-500">
            RECURSO RECOMENDADO: {suggestedResource?.nombre}
          </span>
          <iframe src={suggestedResource?.embebido ?? suggestedResource?.url} width="100%" height="500px"></iframe>
        </div>
      </div>
      <div className="flex flex-row justify-center my-8">
        <Button
          variant="contained"
          onClick={props.onReboot}
        >
          Reboot
        </Button>
      </div>
    </div >
  );
}

